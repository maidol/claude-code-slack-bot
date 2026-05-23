export type Locale = 'en' | 'zh';

const messages: Record<string, Record<Locale, string>> = {
  // --- Status messages ---
  'status.thinking': { en: '*Thinking...*', zh: '*思考中...*' },
  'status.planning': { en: '*Planning...*', zh: '*制定计划中...*' },
  'status.writing': { en: '*Writing...*', zh: '*正在编写...*' },
  'status.usingTool': { en: '*Using {{toolName}}...*', zh: '*使用 {{toolName}} 中...*' },
  'status.usingToolCount': { en: '*Using {{toolName}}... ({{count}})*', zh: '*使用 {{toolName}} 中... ({{count}})*' },
  'status.taskCompleted': { en: '*Task completed*', zh: '*任务完成*' },
  'status.planReady': { en: '*Plan ready*', zh: '*计划就绪*' },
  'status.errorOccurred': { en: '*Error occurred*', zh: '*出错了*' },
  'status.cancelled': { en: '*Cancelled*', zh: '*已取消*' },
  'status.cancelHint': { en: '_send \`-stop\` to cancel_', zh: '_发送 \`-stop\` 中断_' },
  'status.tokens': { en: '↑ {{count}} tokens', zh: '↑ {{count}} tokens' },

  // --- Command responses ---
  'cmd.stop.stopped': { en: 'Stopped.', zh: '已中断。' },
  'cmd.stop.noActive': { en: 'No active query to stop.', zh: '没有正在执行的查询。' },
  'cmd.reset.done': { en: 'Session reset. Next message will start a new conversation.', zh: '会话已重置。下一条消息将开启新对话。' },

  // Model
  'cmd.model.current': { en: 'Current model: `{{model}}`\n_Change: `-opus`/`-o`, `-sonnet`/`-s`, `-haiku`/`-h`, `-m default`. One-time: prefix `!o `, `!s `, `!h `_', zh: '当前模型：`{{model}}`\n_切换：`-opus`/`-o`、`-sonnet`/`-s`、`-haiku`/`-h`、`-m default`。一次性：`!o `、`!s `、`!h ` 前缀_' },
  'cmd.model.set': { en: 'Model set to `{{model}}`', zh: '模型已设置为 `{{model}}`' },
  'cmd.model.default': { en: 'default', zh: '默认' },


  // Cost
  'cmd.cost.header': { en: '*Last query*', zh: '*上次查询*' },
  'cmd.cost.costLine': { en: 'Cost: ${{cost}}', zh: '费用：${{cost}}' },
  'cmd.cost.durationLine': { en: 'Duration: {{duration}}s', zh: '耗时：{{duration}} 秒' },
  'cmd.cost.modelLine': { en: 'Model: `{{model}}`', zh: '模型：`{{model}}`' },
  'cmd.cost.sessionLine': { en: 'Session ID: `{{sessionId}}`', zh: '会话 ID：`{{sessionId}}`' },
  'cmd.cost.noData': { en: 'No query cost data yet.', zh: '尚无查询费用数据。' },

  // Permission modes
  'cmd.defaultMode': {
    en: 'Default mode — Bash, file edits, and MCP tools require approval.\nUse `-safe` to auto-approve edits, or `-trust` to auto-approve all.',
    zh: '默认模式 — Bash、文件编辑、MCP 工具都需要批准。\n使用 `-safe` 自动批准编辑，或 `-trust` 自动批准所有工具。',
  },
  'cmd.safeMode': {
    en: 'Safe mode — File edits auto-approved, Bash and MCP tools require approval.\nUse `-default` for full approval, or `-trust` to auto-approve all.',
    zh: '安全模式 — 文件编辑自动批准，Bash 和 MCP 工具需要批准。\n使用 `-default` 切换到全部需批准，或 `-trust` 自动批准所有工具。',
  },
  'cmd.trustMode': {
    en: 'Trust mode — All tools auto-approved.\nUse `-default` or `-safe` to require approvals.',
    zh: '信任模式 — 所有工具自动批准。\n使用 `-default` 或 `-safe` 切回需要批准的模式。',
  },
  'cmd.trustMode.denied': {
    en: 'Trust mode is restricted to admins. Contact the bot owner to be added to `ADMIN_USER_IDS`.',
    zh: '信任模式仅限管理员使用。请联系机器人运维将你加入 `ADMIN_USER_IDS`。',
  },

  // Sessions
  'cmd.sessions.noCwd': { en: 'Set a working directory first (`-cwd <path>`) to list sessions.', zh: '查看会话列表前请先设置工作目录（`-cwd <路径>`）。' },

  // MCP
  'cmd.mcp.reloadSuccess': { en: 'MCP configuration reloaded successfully.', zh: 'MCP 配置重新加载成功。' },
  'cmd.mcp.reloadFailed': { en: 'Failed to reload MCP configuration. Check the mcp-servers.json file.', zh: 'MCP 配置重新加载失败。请检查 mcp-servers.json 文件。' },

  // --- Working directory ---
  'cwd.set': { en: 'Working directory set for {{context}}: `{{path}}`', zh: '{{context}}工作目录已设置：`{{path}}`' },
  'cwd.settingsCreated': { en: 'Created `.claude/settings.local.json` with gateway config from `.env` (overrides user-level settings).', zh: '已在该目录创建 `.claude/settings.local.json`（写入 `.env` 中的网关配置，会覆盖用户级 settings）。' },
  'cwd.context.thread': { en: 'this thread', zh: '此 thread' },
  'cwd.context.dm': { en: 'this conversation', zh: '此对话' },
  'cwd.context.channel': { en: 'this channel', zh: '此频道' },

  'cwd.noCwd': { en: 'No working directory set. ', zh: '尚未设置工作目录。' },
  'cwd.noCwd.channel': { en: 'Please set a default working directory for this channel first using:', zh: '请先为此频道设置默认工作目录：' },
  'cwd.noCwd.thread': { en: 'You can set a thread-specific working directory using:\n`-cwd /path/to/directory`', zh: '可以为单个 thread 设置专用工作目录：\n`-cwd /path/to/directory`' },
  'cwd.noCwd.generic': { en: 'Please set one first using:\n`-cwd /path/to/directory`', zh: '请先设置：\n`-cwd /path/to/directory`' },
  'cwd.noCwd.relativeHint': { en: '`-cwd project-name` or `-cwd /absolute/path`\n\nBase directory: `{{baseDir}}`', zh: '`-cwd 项目名` 或 `-cwd /绝对路径`\n\n基础目录：`{{baseDir}}`' },
  'cwd.noCwd.absoluteHint': { en: '`-cwd /path/to/directory`', zh: '`-cwd /path/to/directory`' },

  // formatDirectoryMessage
  'cwd.current': { en: 'Current working directory for {{context}}: `{{directory}}`', zh: '{{context}}当前工作目录：`{{directory}}`' },
  'cwd.baseDir': { en: 'Base directory: `{{baseDir}}`', zh: '基础目录：`{{baseDir}}`' },
  'cwd.relativeHint': { en: 'You can use relative paths like `-cwd project-name` or absolute paths.', zh: '可以使用相对路径如 `-cwd 项目名`，或绝对路径。' },
  'cwd.notSet': { en: 'No working directory set for {{context}}. Please set one using:', zh: '{{context}}尚未设置工作目录。请用以下命令设置：' },
  'cwd.notSet.relativeOption': { en: '`-cwd project-name` (relative to base directory)', zh: '`-cwd 项目名`（相对于基础目录）' },
  'cwd.notSet.absoluteOption': { en: '`-cwd /absolute/path/to/directory` (absolute path)', zh: '`-cwd /绝对路径`（绝对路径）' },
  'cwd.notSet.absoluteOnly': { en: '`-cwd /path/to/directory`', zh: '`-cwd /path/to/directory`' },

  // formatChannelSetupMessage
  'cwd.channelSetup.title': { en: '**Channel Working Directory Setup**', zh: '**频道工作目录设置**' },
  'cwd.channelSetup.prompt': { en: 'Please set the default working directory for #{{channel}}:', zh: '请为 #{{channel}} 设置默认工作目录：' },
  'cwd.channelSetup.options': { en: '**Options:**', zh: '**可选项：**' },
  'cwd.channelSetup.usage': { en: '**Usage:**', zh: '**用法：**' },
  'cwd.channelSetup.relativeOption': { en: '• `-cwd project-name` (relative to: `{{baseDir}}`)', zh: '• `-cwd 项目名`（基于：`{{baseDir}}`）' },
  'cwd.channelSetup.absoluteOption': { en: '• `-cwd /absolute/path/to/project` (absolute path)', zh: '• `-cwd /绝对路径/项目`（绝对路径）' },
  'cwd.channelSetup.absoluteOnly': { en: '• `-cwd /path/to/project`', zh: '• `-cwd /path/to/project`' },
  'cwd.channelSetup.defaultNote': { en: 'This becomes the default for all conversations in this channel.', zh: '将作为此频道所有对话的默认目录。' },
  'cwd.channelSetup.overrideNote': { en: 'Individual threads can override this by mentioning me with a different `-cwd` command.', zh: '个别 thread 可通过 `-cwd` 命令覆盖此默认。' },

  // --- File upload ---
  'file.processing': { en: 'Processing {{count}} file(s): {{names}}', zh: '正在处理 {{count}} 个文件：{{names}}' },

  // --- Tool approval ---
  'approval.approve': { en: 'Approve', zh: '批准' },
  'approval.deny': { en: 'Deny', zh: '拒绝' },
  'approval.bash': { en: '*Approve Bash command?*', zh: '*批准 Bash 命令吗？*' },
  'approval.edit': { en: '*Approve edit to* `{{path}}`?', zh: '*批准对* `{{path}}` *的编辑吗？*' },
  'approval.write': { en: '*Approve creating* `{{path}}`?', zh: '*批准创建* `{{path}}` *吗？*' },
  'approval.notebook': { en: '*Approve notebook edit to* `{{path}}`?', zh: '*批准对* `{{path}}` *的 notebook 编辑吗？*' },
  'approval.mcp': { en: '*Approve MCP tool* `{{tool}}` _({{server}})_?', zh: '*批准 MCP 工具* `{{tool}}` _({{server}})_ *吗？*' },
  'approval.generic': { en: '*Approve {{toolName}}?*', zh: '*批准 {{toolName}} 吗？*' },
  'approval.approved': { en: 'Approved', zh: '已批准' },
  'approval.alwaysAllow': { en: 'Always Allow {{toolName}}', zh: '始终允许 {{toolName}}' },
  'approval.alwaysAllowed': { en: '{{toolName}} will be auto-approved in this channel. Use `-default` to reset.', zh: '此频道将自动批准 {{toolName}}。使用 `-default` 重置。' },
  'approval.denied': { en: 'Denied', zh: '已拒绝' },
  'approval.expired': { en: 'Approval expired (already auto-approved)', zh: '批准已过期（已被自动批准）' },

  // --- Tool display ---
  'tool.editing': { en: '*Editing `{{path}}`*', zh: '*正在编辑 `{{path}}`*' },
  'tool.creating': { en: '*Creating `{{path}}`*', zh: '*正在创建 `{{path}}`*' },
  'tool.running': { en: '*Running command:*', zh: '*执行命令：*' },
  'tool.using': { en: '*Using {{toolName}}*', zh: '*正在使用 {{toolName}}*' },
  'tool.taskUpdate': { en: '*Task Update:*', zh: '*任务更新：*' },

  // --- Plan mode ---
  'plan.complete': { en: 'Plan complete. Execute?', zh: '计划已就绪。执行吗？' },
  'plan.readyExecute': { en: '*Plan ready.* Execute this plan?', zh: '*计划已就绪。* 是否执行此计划？' },
  'plan.execute': { en: 'Execute', zh: '执行' },
  'plan.cancel': { en: 'Cancel', zh: '取消' },
  'plan.expired': { en: 'Plan expired. Please re-run.', zh: '计划已过期。请重新执行。' },
  'plan.executing': { en: '*Executing plan...*', zh: '*正在执行计划...*' },
  'plan.cancelled': { en: 'Cancelled.', zh: '已取消。' },

  // --- Session picker ---
  'picker.title': { en: '*Recent Sessions*', zh: '*最近会话*' },
  'picker.noSessions': { en: 'No sessions found. Start a new conversation or use `-continue` to resume the last CLI session.', zh: '没有找到会话。请开始新对话，或用 `-continue` 恢复上次 CLI 会话。' },
  'picker.resume': { en: '▶ Resume', zh: '▶ 恢复' },
  'picker.footer': { en: '_`-continue`: resume last session · expires in 5 min_', zh: '_`-continue`: 恢复上次会话 · 5 分钟后过期_' },
  'picker.expired': { en: '_Session picker expired._', zh: '_会话选择器已过期。_' },
  'picker.expiredAction': { en: 'Session picker expired. Use `-r` again.', zh: '会话选择器已过期。请再次使用 `-r`。' },
  'picker.resuming': { en: '*Resuming:* {{title}}', zh: '*正在恢复：* {{title}}' },
  'picker.noTitle': { en: '(no title)', zh: '（无标题）' },
  'picker.showMore': { en: 'Show more ({{count}})', zh: '显示更多 ({{count}})' },
  'picker.moreAvailable': {
    en: '_{{remaining}} more session(s) not shown. Use `-cwd <path>` to switch to the project, then `-sessions` to list and `-resume <id>` to resume._',
    zh: '_还有 {{remaining}} 个会话未显示。用 `-cwd <路径>` 切到该项目，再用 `-sessions` 列出，`-resume <id>` 恢复。_',
  },

  // --- Sessions list ---
  'sessions.title': { en: '*Recent Sessions*', zh: '*最近会话*' },
  'sessions.noSessions': { en: 'No sessions found for this working directory.', zh: '此工作目录下没有会话。' },
  'sessions.noPreview': { en: '(no preview)', zh: '（无预览）' },
  'sessions.resumeHint': { en: '_Use `-resume <session-id>` to resume a session._', zh: '_使用 `-resume <会话ID>` 恢复会话。_' },

  // --- Rate limit ---
  'rateLimit.reached': { en: '*Rate limit reached.*', zh: '*已触发 Rate limit。*' },
  'rateLimit.retryEstimate': { en: 'Estimated retry: *{{time}}* ({{minutes}} min later)', zh: '预计重试时间：*{{time}}*（{{minutes}} 分钟后）' },
  'rateLimit.prompt': { en: '_Prompt: {{prompt}}_', zh: '_提示词：{{prompt}}_' },
  'rateLimit.schedule': { en: '🔁 Auto-retry ({{time}})', zh: '🔁 自动重试（{{time}}）' },
  'rateLimit.cancel': { en: 'Cancel', zh: '取消' },
  'rateLimit.autoNotify': { en: "_Click 'Auto-retry' to re-run your prompt automatically when the limit resets._", zh: "_点击「自动重试」会在重置时间自动用相同提示词执行。_" },
  'rateLimit.scheduled': { en: '🔁 Auto-retry scheduled at *{{time}}*. The original prompt will run automatically.', zh: '🔁 已预约 *{{time}}* 自动重试。会用原始提示词自动执行。' },
  'rateLimit.autoRetryFiring': { en: '🔁 Auto-retry firing now…', zh: '🔁 自动重试启动中…' },
  'rateLimit.retryExpired': { en: 'Retry info expired. Please resend your message manually.', zh: '重试信息已过期。请手动重新发送消息。' },

  'rateLimit.continueWithApiKey': { en: 'Continue with API key', zh: '使用 API 密钥继续' },
  'rateLimit.switchAccount': { en: '🔄 Switch to {{account}}', zh: '🔄 切换到 {{account}}' },

  // API key
  'apiKey.modalTitle': { en: 'API Key', zh: 'API 密钥' },
  'apiKey.modalSubmit': { en: 'Save', zh: '保存' },
  'apiKey.modalClose': { en: 'Cancel', zh: '取消' },
  'apiKey.modalBody': { en: 'Enter your Anthropic API key. It will be stored locally and used when the subscription rate limit is reached.', zh: '请输入你的 Anthropic API 密钥。会保存在本地，订阅 Rate limit 时启用。' },
  'apiKey.modalLabel': { en: 'API Key', zh: 'API 密钥' },

  'apiKey.limitLabel': { en: 'Spending Limit (optional)', zh: '用量上限（可选）' },
  'apiKey.limitPlaceholder': { en: 'e.g. 2.00 (leave blank for no limit)', zh: '例：2.00（留空则无上限）' },
  'apiKey.saved': { en: 'API key saved.', zh: 'API 密钥已保存。' },
  'apiKey.savedAndRetrying': { en: 'API key saved. Retrying with API key...', zh: 'API 密钥已保存，正在用 API 密钥重试...' },
  'apiKey.switchingToApiKey': { en: 'Switching to API key. Retrying...', zh: '正在切换到 API 密钥并重试...' },
  'apiKey.switchingToSubscription': { en: 'Rate limit reset. Switching back to subscription auth.', zh: 'Rate limit 已重置，切回订阅认证方式。' },
  'apiKey.noKey': { en: 'No API key registered. Enter one to continue.', zh: '尚未注册 API 密钥。请先输入。' },

  // --- Schedule ---
  'schedule.sessionStart': { en: '🌅 Starting new Claude session...', zh: '🌅 正在开启新的 Claude 会话...' },
  'schedule.noConfig': { en: '_No schedules configured. Use the buttons below to add._', zh: '_尚未配置任何调度。请用下方按钮添加。_' },
  'schedule.status.header': { en: '*Session Auto-Start*', zh: '*会话自动启动*' },
  'schedule.conflictWithExisting': { en: '`{{time}}` is within the 5-hour window of `{{existing}}` — the follow-up at ~`{{existing}}+5h` already covers this slot. Remove `{{existing}}` first with `-schedule remove {{existingHour}}` if you want to change the base time.', zh: '`{{time}}` 在 `{{existing}}` 的 5 小时会话窗口内 — `{{existing}}+5h` 自动跟进已覆盖此时段。若要改基准时间，先用 `-schedule remove {{existingHour}}` 删掉。' },
  'schedule.invalidTime': { en: 'Invalid time. Use an hour (e.g., `6`, `16`).', zh: '时间无效。请输入小时（例：`6`、`16`）。' },
  'schedule.clearBtn': { en: '🗑 Clear all', zh: '🗑 全部清除' },
  'schedule.noAccounts': { en: '_No accounts configured. Use `-account` to set up accounts first._', zh: '_尚未配置账号。请先用 `-account` 设置账号。_' },
  'schedule.modal.title': { en: 'Add Schedule', zh: '添加调度' },
  'schedule.modal.submit': { en: 'Add', zh: '添加' },
  'schedule.modal.close': { en: 'Cancel', zh: '取消' },
  'schedule.modal.body': { en: 'Add a scheduled time for *{{account}}*.\nA greeting will be sent at the specified time (+0~10min jitter), then again ~5h later.', zh: '为 *{{account}}* 添加调度。\n在指定时间（+0~10 分钟随机抖动）发送问候消息，约 5 小时后再次发送。' },
  'schedule.modal.label': { en: 'Time (hour or HH:MM)', zh: '时间（小时或 HH:MM）' },
  'schedule.rotation.status': { en: '🔄 Daily rotation: *ON* (today = {{status}})', zh: '🔄 每日轮换：*ON*（今天 = {{status}}）' },
  'schedule.rotation.normal': { en: 'as configured', zh: '默认顺序' },
  'schedule.rotation.swapped': { en: 'swapped', zh: '交换顺序' },
  'schedule.rotation.effective': { en: '_→ {{pattern}}_', zh: '_→ {{pattern}}_' },
  'schedule.rotation.enableBtn': { en: '🔄 Enable rotation', zh: '🔄 启用轮换' },
  'schedule.rotation.disableBtn': { en: '🔄 Disable rotation', zh: '🔄 关闭轮换' },
  'schedule.accountNotSet': { en: 'Scheduled session skipped: {{account}} is not configured. Use `-account` to set it up, or remove the {{time}} schedule.', zh: '调度会话已跳过：{{account}} 未配置。请用 `-account` 设置，或移除 {{time}} 调度。' },

  // --- Version ---
  'cmd.version.title': { en: '*Bot Version*', zh: '*机器人版本*' },
  'cmd.version.version': { en: 'Version: `{{version}}`', zh: '版本：`{{version}}`' },
  'cmd.version.commit': { en: 'Commit: `{{hash}}` ({{date}})', zh: 'Commit：`{{hash}}`（{{date}}）' },
  'cmd.version.commitUnknown': { en: 'Commit: unknown (not a git repo)', zh: 'Commit：未知（非 git 仓库）' },
  'cmd.version.upToDate': { en: '✅ Up to date', zh: '✅ 已是最新版本' },
  'cmd.version.updateAvailable': { en: '⬆️ Update available: {{count}} commit(s) behind (latest: `{{hash}}`)\nRun `update.sh` or `update.bat` to update.', zh: '⬆️ 有更新：落后 {{count}} 次提交（最新：`{{hash}}`）\n运行 `update.sh` 或 `update.bat` 更新。' },
  'cmd.version.checkFailed': { en: '_Could not check for updates._', zh: '_检查更新失败。_' },

  // API key cost suffix (appended to completion status when API key mode is active)
  'apiKey.costSuffix': { en: ' | 🔑 ${{queryCost}} (total: ${{totalCost}})', zh: ' | 🔑 ${{queryCost}}（累计：${{totalCost}}）' },

  // Limit command
  'cmd.limit.set': { en: '✅ Spending limit set: ${{amount}}', zh: '✅ 用量上限已设置：${{amount}}' },
  'cmd.limit.cleared': { en: '✅ Spending limit cleared.', zh: '✅ 用量上限已清除。' },
  'cmd.limit.exceeded': { en: '⚠️ Spending limit (${{limit}}) reached (spent: ${{cost}}). Switched back to subscription auth.', zh: '⚠️ 已达用量上限 ${{limit}}（已用：${{cost}}）。切回订阅认证方式。' },
  'cmd.limit.invalidAmount': { en: 'Invalid amount. Use a number like `2.00`.', zh: '金额无效。请输入数字，例：`2.00`。' },
  'cmd.limit.none': { en: 'No spending limit configured. Use `-limit <amount>` to set one (e.g., `-limit 2.00`).', zh: '尚未设置用量上限。请用 `-limit <金额>` 设置（例：`-limit 2.00`）。' },

  // Account management
  'account.current': { en: '🔑 Current account: `{{account}}`', zh: '🔑 当前账号：`{{account}}`' },
  'account.list': { en: 'Available accounts:', zh: '可用账号：' },
  'account.entryActive': { en: '• ✅ `{{id}}` _(active)_', zh: '• ✅ `{{id}}` _(活跃)_' },
  'account.entryAvailable': { en: '• ✅ `{{id}}`', zh: '• ✅ `{{id}}`' },
  'account.entryMissing': { en: '• ❌ `{{id}}` _(not configured)_', zh: '• ❌ `{{id}}` _(未配置)_' },
  'account.useBtn': { en: '▶ Use', zh: '▶ 使用' },
  'account.setBtn': { en: '✎ Set', zh: '✎ 设置' },
  'account.unsetBtn': { en: '✕ Unset', zh: '✕ 解除' },
  'account.unset.done': { en: '✅ `{{id}}` unset.', zh: '✅ `{{id}}` 已解除。' },
  'account.switchedTo': { en: '✅ Switched to `{{account}}`', zh: '✅ 已切换到 `{{account}}`' },
  'account.notFound': { en: '❌ Credentials file not found for `{{account}}`', zh: '❌ 找不到 `{{account}}` 的凭据文件' },
  'account.alreadyCurrent': { en: 'Already on `{{account}}`', zh: '当前已是 `{{account}}`' },
  'account.rateLimitSwitch': { en: 'Rate limit reached. Switching to `{{account}}` and retrying...', zh: 'Rate limit 触发。正在切换到 `{{account}}` 并重试...' },
  'account.switchedTerminalGuide': { en: '✅ Switched to `{{account}}`.\n_Terminal: `/exit` → `claude -c` or `claude -r` to apply._', zh: '✅ 已切换到 `{{account}}`。\n_终端：`/exit` 后用 `claude -c` 或 `claude -r` 重启即可生效。_' },
  'account.hint': { en: '_Use `-account <id>` to switch (e.g., `-account 1`, `-account 2`)_', zh: '_使用 `-account <id>` 切换（例：`-account 1`、`-account 2`）_' },
  'account.tokenExpired': { en: '⚠️ *Token expired* for {{accounts}}. Please re-login with `-account` → `Set`.', zh: '⚠️ {{accounts}} 的 *令牌已过期*。请用 `-account` → `设置` 重新登录。' },

  // Setup wizard
  'account.setup.title': { en: '🔑 *Multi-Account Setup*', zh: '🔑 *多账号设置*' },
  'account.setup.intro': {
    en: 'Add backup Claude accounts for automatic rate limit failover.\nWhen your primary account hits a rate limit, the bot switches to the next account automatically — no action needed.',
    zh: '添加备用 Claude 账号，Rate limit 时自动切换。\n主账号触发 Rate limit 后会自动切到下一个账号 — 无需手动操作。',
  },
  'account.setup.chooseSlot': { en: 'Choose which slot to configure:', zh: '选择要配置的槽位：' },
  'account.setup.slotAvailable': { en: '{{id}}', zh: '{{id}}' },
  'account.setup.slotTaken': { en: '{{id}} (overwrite)', zh: '{{id}}（覆盖）' },
  'account.setup.cancelBtn': { en: 'Cancel', zh: '取消' },
  'account.setup.cancelled': { en: 'Setup cancelled.', zh: '设置已取消。' },
  'account.setup.expired': { en: '⚠️ Setup session expired. Run `-account setup` again.', zh: '⚠️ 设置会话已过期。请再次运行 `-account setup`。' },
  'account.setup.captureNew.title': { en: '🔑 *Setup `{{slot}}`*\nIn your terminal:\n1. Type `/logout` and press Enter\n2. Run `claude` and login with your *`{{slot}}`* account\n\nClick ✅ Done when login is complete:', zh: '🔑 *设置 `{{slot}}`*\n在终端中：\n1. 输入 `/logout` 回车\n2. 运行 `claude`，用 *`{{slot}}`* 账号登录\n\n登录完成后点击 ✅ 完成：' },
  'account.setup.captureNew.doneBtn': { en: '✅ Done', zh: '✅ 完成' },
  'account.setup.captureNew.notChanged': { en: '❌ Credentials haven\'t changed yet. Please complete the login first, then click Done again.', zh: '❌ 凭据尚未变化。请先完成登录再点击完成。' },
  'account.setup.done': { en: '✅ *`{{slot}}` setup complete!*\nThis account will be used automatically on rate limit failover.\n_Terminal: `/exit` → `claude -c` or `claude -r` to resume with the original account._', zh: '✅ *`{{slot}}` 设置完成！*\nRate limit 时会自动切到此账号。\n_终端：`/exit` 后用 `claude -c` 或 `claude -r` 重启即可回到原账号。_' },

  // --- Error ---
  'error.generic': { en: 'Error: {{message}}', zh: '错误：{{message}}' },
  'error.somethingWrong': { en: 'Something went wrong', zh: '出错了' },

  // --- Welcome (channel join) ---
  'welcome.greeting': { en: "Hi! I'm Claude Code, your AI coding assistant.", zh: '你好！我是 Claude Code 编程助手。' },
  'welcome.needCwd': { en: 'To get started, I need to know the default working directory for #{{channel}}.', zh: '请先为 #{{channel}} 设置默认工作目录。' },
  'welcome.useRelative': { en: 'You can use:\n• `-cwd project-name` (relative to base directory: `{{baseDir}}`)\n• `-cwd /absolute/path/to/project` (absolute path)', zh: '可以使用：\n• `-cwd 项目名`（基于基础目录：`{{baseDir}}`）\n• `-cwd /绝对路径/项目`（绝对路径）' },
  'welcome.useAbsolute': { en: 'Please set it using:\n• `-cwd /path/to/project`', zh: '请使用以下命令设置：\n• `-cwd /path/to/project`' },
  'welcome.channelDefault': { en: 'This will be the default working directory for this channel. You can always override it for specific threads with `-cwd`.', zh: '将作为此频道的默认工作目录。可在指定 thread 中用 `-cwd` 覆盖。' },
  'welcome.helpHint': { en: 'Type `-help` to see all available commands.', zh: '输入 `-help` 查看全部命令。' },

  // --- Relative time ---
  'time.justNow': { en: 'just now', zh: '刚刚' },
  'time.minutesAgo': { en: '{{n}} min ago', zh: '{{n}} 分钟前' },
  'time.hoursAgo': { en: '{{n}}h ago', zh: '{{n}} 小时前' },
  'time.daysAgo': { en: '{{n}}d ago', zh: '{{n}} 天前' },

  // --- MCP info ---
  'mcp.noServers': { en: 'No MCP servers configured.', zh: '尚未配置 MCP 服务。' },
  'mcp.title': { en: '**MCP Servers Configured:**', zh: '**已配置的 MCP 服务：**' },
  'mcp.toolsPattern': { en: 'Available tools follow the pattern: `mcp__serverName__toolName`', zh: '可用工具命名规则：`mcp__服务名__工具名`' },
  'mcp.approvalHint': { en: 'MCP tools require approval by default. Use `-trust` to auto-approve.', zh: 'MCP 工具默认需要批准。使用 `-trust` 可自动批准。' },

  // --- Todo list ---
  'todo.title': { en: '*Task List*', zh: '*任务列表*' },
  'todo.empty': { en: 'No tasks defined yet.', zh: '尚未定义任务。' },
  'todo.inProgress': { en: '*🔄 In Progress:*', zh: '*🔄 进行中：*' },
  'todo.pending': { en: '*⏳ Pending:*', zh: '*⏳ 待办：*' },
  'todo.completed': { en: '*✅ Completed:*', zh: '*✅ 已完成：*' },
  'todo.progress': { en: '*Progress:* {{completed}}/{{total}} tasks completed ({{percent}}%)', zh: '*进度：* {{completed}}/{{total}} 任务完成（{{percent}}%）' },
  'todo.added': { en: '➕ Added: {{content}}', zh: '➕ 新增：{{content}}' },
  'todo.removed': { en: '➖ Removed: {{content}}', zh: '➖ 删除：{{content}}' },

  // --- Permission denial (CLI mode) ---
  'permission.denied': {
    en: 'Permission denied for: {{tools}}. The task was paused.',
    zh: '权限被拒：{{tools}}。任务已暂停。',
  },
  'permission.allowTool': {
    en: 'Allow {{toolName}}',
    zh: '允许 {{toolName}}',
  },
  'permission.allowAllAndResume': {
    en: 'Allow All & Resume',
    zh: '全部允许并继续',
  },
  'permission.resuming': {
    en: 'Resuming with approved tools...',
    zh: '正在用已批准的工具继续...',
  },

  // --- Misc ---
  'misc.continuePrompt': { en: 'Continue where you left off.', zh: '从你上次中断的地方继续。' },
  'misc.cancelled': { en: 'Cancelled.', zh: '已取消。' },
  'hint.threadStart': {
    en: '`-stop` cancel · `-reset` new session · `-plan` plan first · `-help` all commands',
    zh: '`-stop` 中断 · `-reset` 新会话 · `-plan` 先做计划 · `-help` 全部命令',
  },
  'hint.resumeTerminal': {
    en: '💡 If this session is open in a terminal, close the terminal window instead of `/exit` to preserve Slack work.',
    zh: '💡 如果此会话在终端打开，请直接关闭终端窗口而不是 `/exit` — `/exit` 会覆盖 Slack 的工作记录。',
  },

  // --- Assistant ---
  'assistant.briefingRunning': {
    en: '📋 Running briefing...',
    zh: '📋 正在执行简报...',
  },
  'assistant.briefingScheduled': {
    en: 'Next briefing: {{time}}',
    zh: '下次简报：{{time}}',
  },
  'assistant.configUpdated': {
    en: 'Assistant config updated.',
    zh: '助手配置已更新。',
  },
  'assistant.configShow': {
    en: 'Current assistant configuration:',
    zh: '当前助手配置：',
  },
  'assistant.reminderPaused': {
    en: '⚠️ Calendar auth renewal needed — reminders paused',
    zh: '⚠️ 日历认证需要更新 — 提醒已暂停',
  },
  'assistant.reportNotFound': {
    en: '📄 No reports found for: {{type}}',
    zh: '📄 找不到报告：{{type}}',
  },
  'assistant.reportAvailableTypes': {
    en: 'Available types',
    zh: '可查询的类型',
  },
  'assistant.analysisRunning': {
    en: '📊 Running {{type}} analysis...',
    zh: '📊 正在执行 {{type}} 分析...',
  },
  'assistant.notConfigured': {
    en: 'Assistant not configured. Set `ASSISTANT_DM_CHANNEL` and `ASSISTANT_CONFIG_DIR` in `.env`',
    zh: '助手未配置。请在 `.env` 中设置 `ASSISTANT_DM_CHANNEL` 和 `ASSISTANT_CONFIG_DIR`',
  },
  'analysis.running': {
    en: '🔬 Running analysis: {{type}}...',
    zh: '🔬 正在执行分析：{{type}}...',
  },

  // Memory watchdog
  'watchdog.confirm': {
    en: ':warning: *System Memory Warning*\nCommit memory: {{committedMB}} MB / {{limitMB}} MB ({{pct}}%)\n\nTarget: `{{name}}` (PID {{pid}}, {{commitMB}} MB)\nAuto-kill in {{minutes}} min if no response.',
    zh: ':warning: *系统内存警告*\nCommit 内存：{{committedMB}} MB / {{limitMB}} MB（{{pct}}%）\n\n目标：`{{name}}`（PID {{pid}}，{{commitMB}} MB）\n{{minutes}} 分钟内无响应将自动终止。',
  },
  'watchdog.confirmProcess': {
    en: ':warning: *Process Memory Warning*\n`{{name}}` (PID {{pid}}) is using {{commitMB}} MB — over the per-process threshold ({{processThresholdMB}} MB).\nSystem commit: {{committedMB}} MB / {{limitMB}} MB ({{pct}}%).\nAuto-kill in {{minutes}} min if no response.',
    zh: ':warning: *进程内存警告*\n`{{name}}`（PID {{pid}}）正在使用 {{commitMB}} MB — 超过单进程阈值（{{processThresholdMB}} MB）。\n系统 commit：{{committedMB}} MB / {{limitMB}} MB（{{pct}}%）。\n{{minutes}} 分钟内无响应将自动终止。',
  },
  'watchdog.killed': {
    en: ':skull: `{{name}}` (PID {{pid}}) killed — {{commitMB}} MB reclaimed.',
    zh: ':skull: `{{name}}`（PID {{pid}}）已终止 — 回收 {{commitMB}} MB。',
  },
  'watchdog.ignored': {
    en: ':white_check_mark: `{{name}}` (PID {{pid}}) — kept.',
    zh: ':white_check_mark: `{{name}}`（PID {{pid}}）— 已保留。',
  },
  'watchdog.autoKill': {
    en: ':skull: `{{name}}` (PID {{pid}}) auto-killed — no response in {{minutes}} min ({{commitMB}} MB).',
    zh: ':skull: `{{name}}`（PID {{pid}}）已自动终止 — {{minutes}} 分钟内无响应（{{commitMB}} MB）。',
  },
  'watchdog.alreadyGone': {
    en: ':white_check_mark: `{{name}}` (PID {{pid}}) — already exited.',
    zh: ':white_check_mark: `{{name}}`（PID {{pid}}）— 已退出。',
  },
  'watchdog.excluded': {
    en: ':no_entry_sign: `{{name}}` (PID {{pid}}) — excluded from future watchdog alerts.',
    zh: ':no_entry_sign: `{{name}}`（PID {{pid}}）— 已加入看门狗后续观察例外。',
  },
};

/**
 * Translate a message key with optional parameter interpolation.
 * Falls back to English if the key is missing for the given locale,
 * and returns the key itself if not found at all.
 */
export function t(key: string, locale: Locale, params?: Record<string, string | number>): string {
  const template = messages[key]?.[locale] ?? messages[key]?.['en'] ?? key;
  if (!params) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, k) => String(params[k] ?? `{{${k}}}`));
}

/**
 * Format a date as locale-appropriate time string (HH:MM).
 */
export function formatTime(date: Date, locale: Locale): string {
  const loc = locale === 'zh' ? 'zh-CN' : 'en-US';
  return date.toLocaleString(loc, { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit' });
}

/**
 * Format a date as locale-appropriate short date + time string.
 */
export function formatDateTime(date: Date, locale: Locale): string {
  const loc = locale === 'zh' ? 'zh-CN' : 'en-US';
  return date.toLocaleString(loc, { timeZone: 'Asia/Seoul', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

/**
 * Format a date as locale-appropriate short date string.
 */
export function formatShortDate(date: Date, locale: Locale): string {
  const loc = locale === 'zh' ? 'zh-CN' : 'en-US';
  return date.toLocaleDateString(loc, { month: 'numeric', day: 'numeric' });
}

/**
 * Build the full help text for the given locale.
 */
export function getHelpText(locale: Locale): string {
  if (locale === 'zh') {
    let help = `*Claude Code Bot — 命令*\n\n`;
    help += `*工作目录*\n`;
    help += `\`-cwd <路径>\` — 设置工作目录（相对/绝对路径）\n`;
    help += `\`-cwd\` — 显示当前工作目录\n\n`;
    help += `*会话*\n`;
    help += `\`-r\` / \`resume\` / \`continue\` / \`继续\` — 最近会话选择器（手机友好）\n`;
    help += `\`-c\` / \`-continue [消息]\` — 恢复最近一次 CLI 会话\n`;
    help += `\`-resume <会话ID>\` — 恢复指定会话\n`;
    help += `\`-sessions\` / \`会话\` — 当前 cwd 的会话列表\n`;
    help += `\`-sessions all\` / \`会话 全部\` — 全部项目会话\n`;
    help += `\`-stop\` — 中断正在执行的查询（优雅 interrupt）\n`;
    help += `\`-reset\` / \`重置\` — 结束会话（下一条消息开启新对话）\n\n`;
    help += `*计划与权限*\n`;
    help += `\`-plan <提示>\` / \`计划 <提示>\` — 只做计划（只读，不执行）\n`;
    help += `\`-d\` / \`-default\` / \`默认\` — 默认模式：编辑、Bash、MCP 需要批准（默认值）\n`;
    help += `\`-safe\` / \`安全\` — 安全模式：编辑自动批准，Bash/MCP 需要批准\n`;
    help += `\`-trust\` / \`信任\` — 信任模式：所有工具自动批准\n\n`;
    help += `*设置*\n`;
    help += `\`-m\` / \`-model [名称]\` / \`模型\` — 查询/设置模型（\`sonnet\`、\`opus\`、\`haiku\`、\`default\`）\n`;
    help += `\`-opus\` / \`-o\`、\`-sonnet\` / \`-s\`、\`-haiku\` / \`-h\` — 一键切换频道模型\n`;
    help += `\`!o <prompt>\`、\`!s <prompt>\`、\`!h <prompt>\` — 单条消息用不同模型执行\n`;
    help += `\`-cost\` / \`费用\` — 上次查询费用及会话 ID\n`;
    help += `\`-v\` / \`-version\` / \`版本\` — 机器人版本及更新检查\n\n`;
    help += `*MCP*\n`;
    help += `\`-mcp\` — 显示 MCP 服务状态\n`;
    help += `\`-mcp reload\` — 重新加载 MCP 配置\n`;
    help += `\`-key\` / \`-apikey\` / \`密钥\` — 注册/修改 API 密钥（rate limit 时自动切换）\n`;
    help += `\`-limit [金额]\` / \`限额\` — 查询/设置 API 密钥用量上限（例：\`-limit 2.00\`）\n`;
    help += `\`-limit clear\` / \`限额 清除\` — 清除用量上限\n`;
    help += `\`-sc\` / \`-schedule\` / \`调度\` — 管理会话自动启动（按账号增删）\n`;
    help += `\`-ac\` / \`-account\` / \`账号\` — 显示当前账号及已注册账号列表\n`;
    help += `\`-ac setup\` — 账号设置向导（交互式）\n`;
    help += `\`-ac <id>\` — 切换账号（例：\`-ac 1\`、\`-ac 2\`）\n\n`;

    help += `*助手*\n`;
    help += `\`-br\` / \`-briefing\` / \`简报\` — 立即执行简报\n`;
    help += `\`-rp\` / \`-report [类型]\` — 查看最新分析报告\n`;
    help += `\`-as config\` / \`-assistant config\` — 显示助手配置\n`;
    help += `\`-as briefing HH:MM\` — 修改简报时间\n`;
    help += `\`-as reminder N\` — 修改日历提醒提前时间（分钟）\n\n`;

    help += `*提示*\n`;
    help += `• 同一 thread = 会话自动延续（无需命令）\n`;
    help += `• 拖拽文件即可上传并分析\n`;
    help += `• Rate limit → 自动切换 API 密钥或预约重试\n`;
    help += `• \`help\` 或 \`-help\` — 显示此消息\n`;
    return help;
  }

  // English (default)
  let help = `*Claude Code Bot — Commands*\n\n`;
  help += `*Working Directory*\n`;
  help += `\`-cwd <path>\` — Set working directory (relative or absolute)\n`;
  help += `\`-cwd\` — Show current working directory\n\n`;
  help += `*Session*\n`;
  help += `\`-r\` / \`resume\` / \`continue\` — Recent sessions picker (mobile-friendly)\n`;
  help += `\`-c\` / \`-continue [message]\` — Resume last CLI session\n`;
  help += `\`-resume <session-id>\` — Resume a specific session\n`;
  help += `\`-sessions\` — List sessions for current cwd\n`;
  help += `\`-sessions all\` — List sessions across all projects\n`;
  help += `\`-stop\` — Cancel the running query (graceful interrupt)\n`;
  help += `\`-reset\` — End current session (next message starts fresh)\n\n`;
  help += `*Plan & Permissions*\n`;
  help += `\`-plan <prompt>\` — Plan only (read-only, no execution)\n`;
  help += `\`-d\` / \`-default\` — Default: edits, bash, MCP require approval (default)\n`;
  help += `\`-safe\` — Safe: edits auto-approved, bash/MCP require approval\n`;
  help += `\`-trust\` — Trust: all tools auto-approved\n\n`;
  help += `*Settings*\n`;
  help += `\`-m\` / \`-model [name]\` — Get/set model (\`sonnet\`, \`opus\`, \`haiku\`, \`default\`)\n`;
  help += `\`-opus\` / \`-o\`, \`-sonnet\` / \`-s\`, \`-haiku\` / \`-h\` — Switch channel model in one shot\n`;
  help += `\`!o <prompt>\`, \`!s <prompt>\`, \`!h <prompt>\` — Run this single message with a different model\n`;
  help += `\`-cost\` — Show last query cost and session ID\n`;
  help += `\`-v\` / \`-version\` — Show bot version and check for updates\n\n`;
  help += `*MCP*\n`;
  help += `\`-mcp\` — Show MCP server status\n`;
  help += `\`-mcp reload\` — Reload MCP configuration\n`;
  help += `\`-key\` / \`-apikey\` — Register/update API key (auto-switch on rate limit)\n`;
  help += `\`-limit [amount]\` — View/set API key spending limit (e.g., \`-limit 2.00\`)\n`;
  help += `\`-limit clear\` — Remove spending limit\n`;
  help += `\`-sc\` / \`-schedule\` — Manage session auto-start schedules (per-account add/remove)\n`;
  help += `\`-ac\` / \`-account\` — Show current account and registered accounts\n`;
  help += `\`-ac setup\` — Interactive wizard to configure accounts\n`;
  help += `\`-ac <id>\` — Switch account (e.g., \`-ac 1\`, \`-ac 2\`)\n\n`;

  help += `*Assistant*\n`;
  help += `\`-br\` / \`-briefing\` — Run briefing now\n`;
  help += `\`-rp\` / \`-report [type]\` — View latest analysis report\n`;
  help += `\`-an\` / \`-analyze [type]\` — Run analysis (single type or all)\n`;
  help += `\`-as config\` / \`-assistant config\` — Show assistant configuration\n`;
  help += `\`-as briefing HH:MM\` — Change briefing time\n`;
  help += `\`-as reminder N\` — Change reminder lead time (minutes)\n\n`;

  help += `*Tips*\n`;
  help += `• Same thread = session auto-continues (no command needed)\n`;
  help += `• Drag & drop files to upload and analyze\n`;
  help += `• Rate limit → switch to API key or scheduled retry\n`;
  help += `• \`help\` or \`-help\` — Show this message\n`;
  return help;
}
