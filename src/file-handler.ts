import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { Logger } from './logger';
import { config } from './config';

export interface ProcessedFile {
  path: string;
  name: string;
  mimetype: string;
  isImage: boolean;
  isText: boolean;
  size: number;
  tempPath?: string;
}

export class FileHandler {
  private logger = new Logger('FileHandler');

  async downloadAndProcessFiles(files: any[]): Promise<ProcessedFile[]> {
    const processedFiles: ProcessedFile[] = [];

    for (const file of files) {
      try {
        const processed = await this.downloadFile(file);
        if (processed) {
          processedFiles.push(processed);
        }
      } catch (error) {
        this.logger.error(`Failed to process file ${file.name}`, error);
      }
    }

    return processedFiles;
  }

  private async downloadFile(file: any): Promise<ProcessedFile | null> {
    // Check file size limit (50MB)
    if (file.size > 50 * 1024 * 1024) {
      this.logger.warn('File too large, skipping', { name: file.name, size: file.size });
      return null;
    }

    try {
      this.logger.debug('Downloading file', { name: file.name, mimetype: file.mimetype });

      const response = await fetch(file.url_private_download, {
        headers: {
          'Authorization': `Bearer ${config.slack.botToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const buffer = await response.buffer();
      const tempDir = os.tmpdir();
      const tempPath = path.join(tempDir, `slack-file-${Date.now()}-${file.name}`);
      
      fs.writeFileSync(tempPath, buffer);

      const processed: ProcessedFile = {
        path: tempPath,
        name: file.name,
        mimetype: file.mimetype,
        isImage: this.isImageFile(file.mimetype),
        isText: this.isTextFile(file.mimetype, file.name, file.filetype),
        size: file.size,
        tempPath,
      };

      this.logger.info('File downloaded successfully', {
        name: file.name,
        tempPath,
        isImage: processed.isImage,
        isText: processed.isText,
      });

      return processed;
    } catch (error) {
      this.logger.error('Failed to download file', error);
      return null;
    }
  }

  private isImageFile(mimetype: string): boolean {
    return mimetype.startsWith('image/');
  }

  private isTextFile(mimetype: string, name?: string, slackFiletype?: string): boolean {
    const textTypes = [
      'text/',
      'application/json',
      'application/javascript',
      'application/typescript',
      'application/xml',
      'application/yaml',
      'application/x-yaml',
    ];

    if (textTypes.some(type => mimetype.startsWith(type))) return true;

    const codeFiletypes = new Set([
      'javascript', 'typescript', 'python', 'java', 'c', 'cpp', 'csharp',
      'go', 'rust', 'ruby', 'php', 'shell', 'bash', 'sql', 'html', 'css',
      'scss', 'less', 'yaml', 'toml', 'markdown', 'md', 'json', 'xml',
      'jsx', 'tsx', 'vue', 'svelte', 'kotlin', 'swift', 'r', 'lua', 'perl',
      'dart', 'scala', 'clojure', 'haskell', 'elixir', 'erlang', 'objc',
      'matlab', 'tex', 'dockerfile', 'makefile', 'text',
    ]);
    if (slackFiletype && codeFiletypes.has(slackFiletype.toLowerCase())) return true;

    if (name) {
      const ext = name.split('.').pop()?.toLowerCase();
      const textExts = new Set([
        'js', 'mjs', 'cjs', 'ts', 'tsx', 'jsx', 'py', 'java', 'c', 'cpp',
        'h', 'hpp', 'cs', 'go', 'rs', 'rb', 'php', 'sh', 'bash', 'zsh',
        'sql', 'html', 'htm', 'css', 'scss', 'less', 'yaml', 'yml', 'toml',
        'md', 'markdown', 'json', 'xml', 'vue', 'svelte', 'kt', 'swift',
        'r', 'lua', 'pl', 'pm', 'dart', 'scala', 'clj', 'hs', 'ex', 'exs',
        'erl', 'm', 'mm', 'txt', 'log', 'env', 'ini', 'conf', 'config',
        'csv', 'tsv', 'gradle', 'properties',
      ]);
      if (ext && textExts.has(ext)) return true;
    }

    return false;
  }

  async formatFilePrompt(files: ProcessedFile[], userText: string): Promise<string> {
    let prompt = userText || 'Please analyze the uploaded files.';
    
    if (files.length > 0) {
      prompt += '\n\nUploaded files:\n';
      
      for (const file of files) {
        if (file.isImage) {
          prompt += `\n## Image: ${file.name}\n`;
          prompt += `File type: ${file.mimetype}\n`;
          prompt += `Path: ${file.path}\n`;
          prompt += `Note: This is an image file that has been uploaded. You can analyze it using the Read tool to examine the image content.\n`;
        } else if (file.isText) {
          prompt += `\n## File: ${file.name}\n`;
          prompt += `File type: ${file.mimetype}\n`;
          prompt += `Path: ${file.path}\n`;

          try {
            const content = fs.readFileSync(file.path, 'utf-8');
            if (content.length > 10000) {
              prompt += `Content (first 10000 chars shown below; use the Read tool on Path for the full file):\n\`\`\`\n${content.substring(0, 10000)}...\n\`\`\`\n`;
            } else {
              prompt += `Content:\n\`\`\`\n${content}\n\`\`\`\n`;
            }
          } catch (error) {
            prompt += `Error reading file content: ${error}\n`;
          }
        } else {
          prompt += `\n## File: ${file.name}\n`;
          prompt += `File type: ${file.mimetype}\n`;
          prompt += `Path: ${file.path}\n`;
          prompt += `Size: ${file.size} bytes\n`;
          prompt += `Note: Try the Read tool on Path; it supports images and PDFs natively.\n`;
        }
      }
      
      prompt += '\nPlease analyze these files and provide insights or assistance based on their content.';
    }

    return prompt;
  }

  async cleanupTempFiles(files: ProcessedFile[]): Promise<void> {
    for (const file of files) {
      if (file.tempPath) {
        try {
          fs.unlinkSync(file.tempPath);
          this.logger.debug('Cleaned up temp file', { path: file.tempPath });
        } catch (error) {
          this.logger.warn('Failed to cleanup temp file', { path: file.tempPath, error });
        }
      }
    }
  }

  getSupportedFileTypes(): string[] {
    return [
      'Images: jpg, png, gif, webp, svg',
      'Text files: txt, md, json, js, ts, py, java, etc.',
      'Documents: pdf, docx (limited support)',
      'Code files: most programming languages',
    ];
  }
}