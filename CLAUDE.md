# 任务指令确认（最高优先级）

会话开始时检查 `TASKS.md` 文件是否存在。
如文件存在：
1. 阅读内容，识别未完成（`[ ]`）的任务
2. 进入 Plan Mode 编写实施计划
3. 获得用户批准后再开始实施
4. 完成的任务标记为 `[x]`，必要时附上结果备注
5. 所有任务完成后向用户汇报

# Claude Code Slack Bot - 项目约定

## 核心编码准则 (Karpathy Skills)

- **深思熟虑 (Thinking First)**：在没有完全理解代码库或逻辑前，严禁盲目修改。如果不确定，必须先提问或读取相关文件。
- **极简主义 (Minimalism)**：拒绝过度工程。优先选择最简单、可读性最高、依赖最少的实现方式。
- **精准操作 (Precision)**：仅修改与任务直接相关的代码。严禁随意改动现有的命名规范、空格、注释或不相关的代码结构。
- **闭环验证 (Test-Driven)**：所有修改必须通过运行测试来验证。在未确认测试通过前，不要宣布任务完成。

## 交互偏好

- **简洁反馈**: 解释修改逻辑时请保持简练，直接告诉我会产生什么影响。
- **确认风险**: 如果修改涉及核心架构，请先列出方案并等待我的 `y` 确认。

## 概述
- Fork 自 [mpociot/claude-code-slack-bot](https://github.com/mpociot/claude-code-slack-bot)
- 跨平台（Windows/macOS/Linux），基于 CLI（`claude -p`）的进程派生
- Slack Socket Mode（无需公网 URL）
- 以 `main` 分支为主，功能开发使用 `feature/*` 分支

## 构建与运行

```bash
npm install                    # macOS / Linux
npm install --ignore-scripts   # Windows（绕过平台检查）
npm run build                  # TypeScript → dist/
npm run dev                    # tsx watch（开发期自动重启）
npm start                      # tsx 直接运行（不构建）
npm run prod                   # node dist/index.js（构建后用于生产）

# 初始化（前置条件检查 + 依赖 + .env + pm2 + 构建）
./setup.sh                    # macOS / Linux
setup.bat                     # Windows

# 运行
./start.sh                    # macOS / Linux
start.bat                     # Windows（通过 pm2 构建并运行）
./stop.sh / stop.bat          # 停止

# 更新（git pull + npm install + 构建 + pm2 重启）
./update.sh                   # macOS / Linux
update.bat                    # Windows
```

- pm2 进程名：`claude-slack-bot`
- 日志：`pm2 logs claude-slack-bot`

## 编码规范

### TypeScript
- 使用严格类型，尽量避免 `any`（仅在 Slack API 等不可避免处使用）
- 保持类基础结构（SlackHandler、CliHandler、WorkingDirectoryManager 等）
- 新功能应在已有类中添加方法，或拆分到独立的 Manager 类

### 命令模式
- 所有用户命令必须使用 `-` 前缀（`-cwd`、`-stop`、`-sessions` 等）
- 例外：`help`、`resume`、`continue`、`keep going`、`계속`、`계속하자` 无需 `-` 也能识别（方便手机输入）
- 命令解析基于正则，遵循 `slack-handler.ts` 的 `is*Command()` / `parse*Command()` 模式
- `-stop`：调用 `CliProcess.interrupt()` 中断 CLI 进程（会话状态保留）
- `-plan <prompt>`：以 `permissionMode: 'plan'` 只读运行 → 通过 Execute 按钮恢复会话执行
- `-default`/`-safe`/`-trust`：权限模式切换（自由度依次递增：default → safe → trust）
- 模型选择（`config.defaultModel`，env `DEFAULT_MODEL` — 默认 `sonnet`）：
  - `-m`/`-model [名称]`/`모델 [名称]` — 查询/设置频道模型（`sonnet`、`opus`、`haiku`、完整 ID、`default`）
  - `-opus`/`-o`、`-sonnet`/`-s`、`-haiku`/`-h` — 通过别名立即切换频道模型
  - `!o <prompt>`/`!s <prompt>`/`!h <prompt>` — 消息前缀方式实现一次性模型应用（try/finally 还原频道模型）
  - 别名映射：`SlackHandler.resolveModelAlias()`（完整 ID 原样透传）
- `-r`/`-resume`：跨项目会话选择器（点击按钮 → 自动切换 cwd 并恢复会话）
- `-sessions all`：列出所有项目会话（与选择器内容相同）
- `-version`：显示机器人版本 + git hash + 检查更新（`src/version.ts`）
- `-apikey`：API 密钥注册/修改模态框（rate limit 自动切换时使用，持久化到 `~/.claude/.bot-api-keys.json`）
- `-account`：多账号状态查看与手动切换（`AccountManager`，持久化到 `~/.claude/.bot-accounts.json`）
  - `-account` — 综合状态视图（Set/Use/Unset 按钮）
  - `-account 1` / `-account 2` / `-account 3` — 手动切换
  - 令牌存储：`~/.claude/.bot-accounts.json`（accessToken、refreshToken、expiresAt、email、oauthAccount）
  - 切换：注入 `CLAUDE_CODE_OAUTH_TOKEN` env var + 自动同步 `~/.claude/.credentials.json` 与 `~/.claude.json`（终端 CLI 也会跟随切换）
  - 过期前 90 分钟自动刷新（OAuth refresh），刷新失败时返回 `null`（避免使用过期令牌）
  - **令牌自动同步**：通过 `fs.watchFile` 每 10 秒监视 `.credentials.json` → 按 email 匹配自动更新 `.bot-accounts.json`
  - 机器人→终端：refresh 时调用 `syncToCredentialsIfActive()` — 按 email 匹配，若终端活动账号一致则更新 `.credentials.json`
  - 终端→机器人：文件监视器 + CLI 派生前的同步
  - **令牌共享**：`captureForSlot()` 只做捕获（已移除独立 refresh — 这是破坏令牌链的原因）
  - **令牌健康检查**：每 1 小时 + 启动时对所有账号检查，检查前先执行 `syncFromCredentialsFile()`，刷新失败时 Slack 通知（每账号 1 次）
  - **终端保护**：终端活动账号跳过预防性刷新（避免 OAuth rotation 让终端内存中的 refresh token 失效），仅在令牌实际过期时刷新
  - rate limit 时切换链：account-1 → account-2 → account-3 → API 密钥按钮
- `-schedule`：会话自动启动配置管理（`ScheduleManager`，持久化到 `.schedule-config.json`）
  - 块状 UI：每账号 `[+ email]` 添加按钮（模态框）+ 每时间 `[✕]` 删除按钮 + `[🗑 Clear all]`
  - 每个调度项关联到具体账号（`ScheduleEntry: { time, account }`）
  - 仅在同一账号内做 5 小时窗口冲突检查（跨账号重叠允许）
  - 模态框提交后通过 `chat.update` 立即更新原消息
  - 预定时刻附加 +0~10 分钟随机抖动以防自动化检测
  - **自动跟进**：首次发送后 5 小时再发第二条消息（覆盖下一个会话窗口）
  - **非工作日跳过**：周末 + 韩国节假日（含农历）自动跳过（`date-holidays` 包，离线）
  - 跟进定时器持久化到磁盘（`pendingFollowUps`）— pm2 重启后恢复，已到期的立即发射
  - 随机问候消息（`say "hi"`、`3+7` 等）+ 使用 haiku 模型启动新会话
  - **每日轮换**：双账号交替调度时，按 dayOfYear 奇偶交换账号 → 两周合计均衡（开关按钮控制 ON/OFF）
- `-briefing`/`-br`/`브리핑`：立即执行晨间简报（`AssistantScheduler.runBriefing()`）
  - 使用缓存的日历数据（不调用 MCP），若缓存日期不是今日则先 `refreshCache()` 再使用，失败时回退到 MCP
  - 收集 `ErrorCollector` 中的机器人错误，集中作为 `⚠️ 시스템 이슈`（系统问题）部分汇报
  - **重启时补发**：`catchUpBriefingIfNeeded()` — 从 `.assistant-costs.json` 读取上次简报日期，若今日未执行则 15 秒后立即执行
  - **周一周报**：自动注入 `monday-briefing-extra.md` 提示词（周成本统计 + 报告汇总）
- **日历提醒**：`CalendarPoller` — 直接通过 Google Calendar REST API HTTP 轮询
  - 查询全部日历，仅通过 `excludeCalendars` 排除（无白名单）
  - 每 5 分钟轮询，仅在检测到 diff 时调用 AI 判断（Haiku 模型，轻量模式约 $0.003/次）
  - AI 判断轻量模式：`cwd=tmpdir` + `--system-prompt` + `--tools ""` + `--no-session-persistence`
  - AI 判断遇 rate limit 时自动暂停 AI 判断直到下一个整点（`aiJudgmentPaused`）
  - 通知队列（`.calendar-notifications.json`）+ 每 1 分钟派发
  - 令牌共享：`~/.config/google-calendar-mcp/tokens.json`（与 MCP 服务相同）
  - 助手会话设 `skipMcp: true` 跳过 MCP 服务连接
  - 通知静音：🔇 按钮关闭重复事件的提醒（`.calendar-muted-events.json`，按 base eventId 匹配系列）
  - 预约文档提醒：事件 description 含 `[scheduled-doc] reports/scheduled/{文件名}` → type `"scheduled-doc"`，派发时读取 `## 요약`（摘要）部分并附在 Slack 消息中
  - `notifyAt` 校正（`clampNotifyAt`）：当 "upcoming" 通知的 `notifyAt` 早于 `eventStart - beforeMinutes` 时强制校正（AI 判断错误的安全网）
  - 认证连续 3 次失败自动暂停 + Slack 通知
- `-report [type]`/`-rp [type]`：递归扫描 reports/ 子目录，Slack 文件上传（`filesUploadV2`，需 `files:write` scope），显示绝对路径 + 摘要，上传失败回退为文本
  - 本地 HTML 报告服务（`src/report-server.ts`，依赖 `marked`）：绑定 127.0.0.1，按进程令牌（`?t=<hex>`）认证，`path.resolve` 防目录穿越。`index.ts` 在 `config.reports.localServer.enabled && config.assistant.configDir` 条件下启动。`EADDRINUSE` 时端口 +5 重试，超过则禁用。
  - 服务启用时 `-rp` 消息追加索引 URL 与每份报告 URL — 浏览器一键打开渲染后的 HTML（`file:///` 在 Slack 客户端会被拦截，因此用 HTTP）
  - 环境变量：`REPORTS_SERVER_ENABLED`（0 禁用）、`REPORTS_SERVER_PORT`（默认 8765）
- `-analyze [type]`/`-an [type]`/`분석 [类型]`：手动执行分析 — 指定类型则单跑，否则全跑
- `-assistant [subcmd]`/`-as [subcmd]`：助手配置管理
  - `-as config`：显示当前配置（config.json 内容）
  - `-as briefing HH:MM`：变更简报时间 → fs.watchFile 监听并自动重新调度
  - `-as reminder N`：变更提醒提前时间（分钟）
  - 环境变量未设置时优雅禁用（`assistantScheduler = null`）
- 成本控制：`--max-budget-usd` 标志限制每会话成本，成本记录于 `.assistant-costs.json`，简报中显示日/周/月统计
  - `config.json` 可调整 `briefing.maxBudgetUsd`、`reminders.maxBudgetUsd`、`analysis.budgetUsd`
  - 分析：`analysis.defaults`（sessionBudgetUsd、allowedTools、writablePaths、maxDurationMinutes、maxRetries）+ `analysis.types`（每类型覆盖）结构
  - 分析 cadence：每类型 `cadence` 字段 — `weekly`（默认）/ `biweekly`（从 `cadenceFrom` 起每 14 天）/ `monthly`（`monthlyWeek: 'first' | 'last'`） — 调度执行时通过 `shouldRunToday()` 自动跳过非周期类型。`mode: 'change-detection'` 视未生成报告为正常结果
  - 分析会话超时：`maxDurationMinutes`（默认 60 分钟）超时则强制终止 CLI 进程，重试 `maxRetries`（默认 2）次后放弃 → 进入下一类型
  - 分析会话：达到成本上限时以 `--resume` 续跑（总额受 `budgetUsd` 限制）
- 新增命令时：
  1. 编写 `is*Command()` 或 `parse*Command()` 方法
  2. 在 `handleMessage()` 的命令分支中加入（stop 要在 help 之前检查）
  3. 在 `messages.ts` 的 `getHelpText()` 中加入帮助文本
  4. 同步更新 `README.md`

### 错误处理
- CLI 进程错误用 `try/catch` 包裹，并通过 Slack 消息告知用户
- Rate limit 检测：CLI `rate_limit_event` 事件 + 共享工具 `isRateLimitText()`（`src/rate-limit-utils.ts`）
  - 用户会话：4 阶段 UI（账号切换 → API 密钥 → 自动重试 → 取消）
  - 调度会话：检测到 rate limit 时发送提示（简报），分析全面停止
  - 日历判断：rate limit 时暂停 AI 判断至下一个整点（`pauseAiJudgment()`）
- 自动重试（`pendingRetries` + `pendingAutoRetries` + `pendingRetryCleanup`）：
  - "自动重试" 按钮 → 在 reset 时刻 +60 秒缓冲处 `setTimeout` 排队 → 同一 thread 以原始 prompt 重新进入 `handleMessage()`
  - "取消" 按钮或 10 分钟未点击 → `clearRetryTimers()` 清理所有定时器/条目
  - 仅内存，未持久化（pm2 重启自然消亡 — rate limit 信息本身就是时效性的）
- API 密钥回退：rate limit 时切换到已注册的 API 密钥 → 重置时间后自动回到订阅方式
- 多账号回退：rate limit 时通过 `AccountManager.switchToNext()` 切换 account-1 → account-2 → account-3 → API 密钥按钮
- 只读工具（Grep、Read、Glob 等）仅显示在状态消息中（`STATUS_ONLY_TOOLS`）
- CLI `is_error` 检测：跟踪 `cliError` 标志 → 出错时显示 ❌ 反应 + `status.errorOccurred`
- 完成时显示工具使用汇总（`toolUsageCounts` → `✅ Task completed (Grep ×5, Read ×2)`）
- 日志使用 `Logger` 类（`this.logger.info/debug/warn/error`）
- **系统内存看门狗**：`ProcessMemoryWatchdog` — 监控 Windows 系统提交内存
  - 每 5 分钟检查系统提交使用率（PowerShell `Get-CimInstance Win32_OperatingSystem`）
  - 提交使用率 > 阈值（默认 80%）时对最大进程发送 Slack 确认消息（Kill/Ignore/Exclude 按钮）
  - Exclude：将该 PID 注册为运行时例外（进程结束自动解除，不持久化）
  - 5 分钟无响应自动 kill，下一周期再评估 → 仍超标则换目标
  - 系统进程保护清单（svchost、dwm、csrss 等）+ 自身（机器人）排除
  - 通过 `ASSISTANT_DM_CHANNEL` 发送通知，仅 Windows（`process.platform === 'win32'`）
  - 单进程提交超过 `processThresholdMB`（默认 5120MB）时即便系统阈值未达也会发送确认消息
  - 环境变量：`MEMORY_WATCHDOG_ENABLED`、`MEMORY_WATCHDOG_THRESHOLD_PCT`、`MEMORY_WATCHDOG_PROCESS_THRESHOLD_MB`、`MEMORY_WATCHDOG_INTERVAL_SEC`、`MEMORY_WATCHDOG_AUTO_KILL_SEC`

### CLI 集成
- 方式：`child_process.spawn('claude', ['-p', '--output-format', 'stream-json', ...])`
- `CliProcess` 类：以 AsyncIterable<CliEvent> 模式流式读取 stdout
- **轻量模式选项**（`runQuery()` opts）：
  - `systemPrompt`：`--system-prompt`（替换默认提示词，节省 ~7K tokens）
  - `tools`：`--tools`（空数组则全禁用）
  - `noSessionPersistence`：`--no-session-persistence`（不生成会话文件）
  - `cwd=os.tmpdir()`：不加载 CLAUDE.md（节省 ~25-39K tokens）
  - 日历判断会话应用：$0.051 → $0.003/会话（节省 94%）
- 权限模式层级（受限 → 自由）：
  - Default（默认）：`--permission-mode default` + `--allowedTools`（仅读取工具）
  - `-safe`：`--permission-mode default` + `--allowedTools`（读取 + 编辑工具）
  - `-trust`：`--dangerously-skip-permissions` → 所有工具自动批准
  - `-default`：回到默认模式
- 权限拒绝处理：检测到 `result.permission_denials` → Slack 按钮（Allow [tool] / Allow All & Resume）
  - 已批准工具注册到 `channelAlwaysApproveTools` → 自动加入 `--allowedTools`
  - `-default` 或 `-reset` 时清空
- Resume 优先级：显式 resumeSessionId > Slack 会话 > 新对话
- Slack 可能用反引号（`）包裹文本 → 正则中对反引号采取可选处理

### UX
- Thread 提示：新会话首次响应时展示默认命令引导（`-stop`、`-reset`、`-plan`、`-help`）
- 锚定反应：查询执行期间保持 ⏳ 反应 → 防止反应数 0↔1 变动导致的 Slack 行跳动
- 工具使用汇总：完成时显示已用工具计数（`✅ Task completed (Grep ×5, Read ×2)`）

### 会话
- Claude 会话文件：`~/.claude/projects/<encoded-path>/*.jsonl`
- 路径编码：非字母数字字符 → `-`（例：`P:\bitbucket` → `P--bitbucket`）
- JSONL 格式：`type: "summary"`（标题）、`type: "user"`（消息）、`type: "assistant"`（回复）
- CLI 兼容：查询完成时把会话登记到 `sessions-index.json` → `claude -c`/`-r` 可看到 Slack 会话
- 会话连续性：跟踪 `lastAssistantUuid`（CLI `--resume` 自动从最后状态续接）
- 会话状态持久化：将 sessionId/lastAssistantUuid 写入 `.session-state.json` → pm2 重启后恢复（保留 7 天）
- 空会话过滤：无对话内容的会话（仅 file-history-snapshot）从选择器排除
- 内存清理：24 小时未活动会话自动清理（每 5 分钟检查），磁盘上的 `.jsonl` 保留
- 与 CLI 共存注意：终端 CLI 的 `/exit` 会覆盖 JSONL，造成 Slack 工作丢失 → 选择器 resume 时显示提示
- 会话选择器上限：`MAX_PICKER_SESSIONS = 15`（受 Slack 50 块限制，每会话 3 块 + 5 块开销）
  - 超过 15 个时不显示 "Show more"，改为引导 `-cwd` → `-sessions` → `-resume <id>`

### MCP 集成
- `mcp-servers.json`（项目根目录，已加入 `.gitignore`）：本地 MCP 服务配置
- 通过 `--mcp-config` 标志传给 CLI（`cli-handler.ts:358-361`）
- **Google Calendar**：`@cocal/google-calendar-mcp` 包（stdio），OAuth 凭据存储在 `~/.claude/`
- platform MCP（`mcp__claude_ai_*`）在 `-p` 模式下不支持 → 改用本地 MCP
- 配置指南：`docs/google-calendar-setup.md`

### 工作目录
- 磁盘持久化：`.working-dirs.json`
- 优先级：Thread > Channel/DM > DEFAULT_WORKING_DIRECTORY
- 在 DM 线程中设置时自动创建 DM 级回退

### i18n（韩文 / 英文）
- `src/messages.ts`：翻译目录（`Record<string, Record<Locale, string>>`）+ `t(key, locale, params?)` 函数
- 通过 Slack `users.info` API 的 `locale` 字段自动检测（带缓存）：`ko-*` → Korean，其他 → English
- 支持 `{{variable}}` 插值
- 翻译范围：所有面向用户的字符串（状态、命令响应、按钮、模态框、帮助等）
- 不翻译：发送给 Claude 的提示词、日志消息、命令输入解析
- 新增字符串：在 `messages.ts` 添加 key → 调用 `t('key', locale)`

## Git 工作流

```bash
# 更新 upstream
git fetch upstream
git checkout main && git merge upstream/main

# 功能开发
git checkout -b feature/<name>
# ... 完成后合回 main
```

## 文件概览

| 文件 | 角色 |
|------|------|
| `src/index.ts` | 入口 — 加载 config、初始化 SlackHandler、启动报告服务 |
| `src/slack-handler.ts` | 处理 Slack 事件、解析命令、格式化消息 |
| `src/cli-handler.ts` | 派生 CLI 进程（`claude -p`）、管理会话 |
| `src/working-directory-manager.ts` | 工作目录的设置/查询/持久化 |
| `src/schedule-manager.ts` | 会话自动启动调度管理（`.schedule-config.json` 持久化） |
| `src/assistant-scheduler.ts` | 个人助理调度器 — 简报/日历提醒/周分析自动化 |
| `src/calendar-poller.ts` | 直接 HTTP 轮询日历、diff、AI 判断、通知派发 |
| `src/error-collector.ts` | 全局错误收集单例 — 由简报集中汇报 |
| `src/file-handler.ts` | 文件上传下载/内联嵌入 |
| `src/session-scanner.ts` | 跨项目会话扫描/选择器数据 |
| `src/messages.ts` | i18n 翻译目录（`t()` 函数、`Locale` 类型） |
| `src/mcp-manager.ts` | MCP 服务配置加载/管理 |
| `src/account-manager.ts` | 多账号管理 — OAuth 令牌存取/刷新、env var 注入式切换 |
| `src/todo-manager.ts` | 跟踪 CLI TodoWrite 结果（按会话存储），Slack 格式化（`📋` 块） |
| `src/version.ts` | 版本信息 + 更新检查（`getVersionInfo()`、`checkForUpdates()`） |
| `src/rate-limit-utils.ts` | 共享 rate limit 检测工具（`isRateLimitText()`、`isRateLimitError()`） |
| `src/process-memory-watchdog.ts` | 系统内存看门狗 — 提交内存监控、进程 kill、Slack 确认 UI |
| `src/report-server.ts` | 本地 HTML 报告服务 — Node http + marked、127.0.0.1、令牌认证、目录穿越防护 |
| `src/config.ts` | 环境变量加载 |
| `src/types.ts` | TypeScript 类型定义 |
| `src/logger.ts` | 结构化日志 |

### 数据文件

| 文件 | 位置 | 含有密钥 |
|------|------|---------|
| `.bot-accounts.json` | `~/.claude/` | ✅ OAuth 令牌 |
| `.bot-api-keys.json` | `~/.claude/` | ✅ API 密钥 |
| `.working-dirs.json` | 项目根目录 | ❌ |
| `.session-state.json` | 项目根目录 | ❌ |
| `.schedule-config.json` | 项目根目录 | ❌ |
| `.assistant-costs.json` | 项目根目录 | ❌ |
| `.calendar-cache.json` | 项目根目录 | ❌ |
| `.calendar-notifications.json` | 项目根目录 | ❌ |
| `.calendar-muted-events.json` | 项目根目录 | ❌ |
