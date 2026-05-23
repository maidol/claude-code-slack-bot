import dotenv from 'dotenv';

// override: true makes .env the source of truth even when the parent shell
// (or pm2 daemon) already exported ANTHROPIC_BASE_URL / ANTHROPIC_API_KEY.
dotenv.config({ override: true });

export const config = {
  slack: {
    botToken: process.env.SLACK_BOT_TOKEN!,
    appToken: process.env.SLACK_APP_TOKEN!,
    signingSecret: process.env.SLACK_SIGNING_SECRET!,
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY!,
    // Optional proxy/gateway base URL. Bot does not read this directly — it is
    // forwarded to the spawned `claude` CLI via process.env (cli-handler.ts).
    // Declared here for visibility and startup-log diagnostics.
    baseUrl: process.env.ANTHROPIC_BASE_URL || '',
  },
  claude: {
    useBedrock: process.env.CLAUDE_CODE_USE_BEDROCK === '1',
    useVertex: process.env.CLAUDE_CODE_USE_VERTEX === '1',
  },
  loadingSpinner: {
    enabled: process.env.LOADING_SPINNER_ENABLED !== '0',
  },
  baseDirectory: process.env.BASE_DIRECTORY || '',
  defaultWorkingDirectory: process.env.DEFAULT_WORKING_DIRECTORY || '',
  // Default model used when channel has no explicit override.
  // Aliases: 'sonnet' | 'opus' | 'haiku' | full Anthropic ID
  defaultModel: process.env.DEFAULT_MODEL || 'sonnet',
  // Optional alias → full-ID overrides. Required when ANTHROPIC_BASE_URL points
  // at a gateway whose model namespace differs from official Anthropic IDs
  // (e.g. some proxies expect "zo:anthropic/claude-sonnet-4-6"). Empty string
  // means "use the CLI's built-in alias expansion".
  modelAliases: {
    opus: process.env.MODEL_ALIAS_OPUS || '',
    sonnet: process.env.MODEL_ALIAS_SONNET || '',
    haiku: process.env.MODEL_ALIAS_HAIKU || '',
  },
  debug: process.env.DEBUG === 'true' || process.env.NODE_ENV === 'development',
  assistant: {
    dmChannel: process.env.ASSISTANT_DM_CHANNEL || '',
    configDir: process.env.ASSISTANT_CONFIG_DIR || '',
  },
  reports: {
    localServer: {
      enabled: process.env.REPORTS_SERVER_ENABLED !== '0',
      port: parseInt(process.env.REPORTS_SERVER_PORT || '8765', 10),
    },
  },
  adminUserIds: (process.env.ADMIN_USER_IDS || '')
    .split(',').map((s) => s.trim()).filter(Boolean),
  memoryWatchdog: {
    enabled: process.env.MEMORY_WATCHDOG_ENABLED !== '0',
    thresholdPct: parseInt(process.env.MEMORY_WATCHDOG_THRESHOLD_PCT || '90', 10),
    checkIntervalSec: parseInt(process.env.MEMORY_WATCHDOG_INTERVAL_SEC || '180', 10),
    autoKillDelaySec: parseInt(process.env.MEMORY_WATCHDOG_AUTO_KILL_SEC || '600', 10),
    processThresholdMB: parseInt(process.env.MEMORY_WATCHDOG_PROCESS_THRESHOLD_MB || '7168', 10),
  },
};

// Resolve short alias / full ID to the model identifier sent to the CLI.
// Order: configured gateway override > short-alias canonical name > pass-through.
// Keep aliases ('opus'/'sonnet'/'haiku') as the canonical form when no override
// is set, so the CLI handles version expansion. Full IDs pass through untouched.
export function resolveModel(input: string): string {
  const short: Record<string, string> = {
    o: 'opus', opus: 'opus',
    s: 'sonnet', sonnet: 'sonnet',
    h: 'haiku', haiku: 'haiku',
  };
  const canonical = short[input.toLowerCase()] ?? input;
  // Also map full Anthropic IDs back to the alias bucket so users who write the
  // full name still hit the gateway override.
  const fullToAlias: Record<string, 'opus' | 'sonnet' | 'haiku'> = {
    'claude-opus-4-7': 'opus',
    'claude-sonnet-4-6': 'sonnet',
    'claude-haiku-4-5-20251001': 'haiku',
  };
  const bucket = (canonical === 'opus' || canonical === 'sonnet' || canonical === 'haiku')
    ? canonical
    : fullToAlias[canonical];
  if (bucket) {
    const override = config.modelAliases[bucket];
    if (override) return override;
  }
  return canonical;
}

export function validateConfig() {
  const required = [
    'SLACK_BOT_TOKEN',
    'SLACK_APP_TOKEN',
    'SLACK_SIGNING_SECRET',
  ];

  const missing = required.filter((key) => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}