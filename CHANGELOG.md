# Changelog

All notable changes to this project are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project adheres to [Semantic Versioning](https://semver.org/).

## [1.2.0] - 2026-05-23

### Security
- **Timing-safe token comparison** in the local report HTTP server — replaces `===` string compare with `crypto.timingSafeEqual` to close a theoretical timing-attack vector on the 32-byte server token. (`src/report-server.ts`)
- **0o600 file permissions** on credential files (POSIX only). `~/.claude/.bot-accounts.json`, `~/.claude/.bot-api-keys.json`, `~/.claude/.credentials.json`, `~/.claude.json`, and the Google Calendar tokens file are now restricted to user-only read/write after each write. (`src/account-manager.ts`, `src/calendar-poller.ts`, `src/slack-handler.ts`)
- **Graceful shutdown hooks** — `SIGTERM` / `SIGINT` clear all `setInterval` timers and stop file watchers, preventing leaked timers under cluster mode. (`src/index.ts`, `src/slack-handler.ts`, `src/account-manager.ts`)
- **OAuth refresh dedup** — concurrent `getAccessToken()` calls share a single in-flight refresh promise, preventing OAuth rotation from invalidating the loser's refresh token. (`src/account-manager.ts`)

### Added
- **Chinese as default user-facing language** — Slack `users.info` API `locale` field now matches `zh-*` and renders all bot UI in Chinese. English remains the fallback for non-`zh` locales.
- **`HOLIDAYS_COUNTRY` environment variable** — replaces hardcoded `'KR'` in `AssistantScheduler` and `ScheduleManager`. Defaults to `KR` for backward compatibility; set to any [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country code (`US`, `JP`, `CN`, …).
- **Heartbeat spinner** during long tool execution — 12-frame clock emoji animation with elapsed seconds so users see progress instead of a static "Using Bash" status.

### Changed
- **i18n migration: Korean → Chinese**
  - `Locale` type renamed from `'en' | 'ko'` to `'en' | 'zh'`
  - All 226 entries in `src/messages.ts` translated to Chinese
  - All Korean command aliases (`중단`, `도움말`, `일하자` etc.) replaced with Chinese equivalents (`中断`, `帮助`, `工作` etc.); ASCII `-stop` / `-help` aliases unchanged
  - All hardcoded Korean strings in source (error messages, log messages, Slack UI literals) translated to Chinese
  - `formatTime`/`formatDateTime`/`formatShortDate` switch from `ko-KR` to `zh-CN` locale
- **`slack-app-manifest.yaml`** — adds the `files:write` scope (required for `-report` Slack file uploads). Existing installs must manually add this scope in their Slack app OAuth settings.
- **`.env.example`** completed: documents `DEFAULT_WORKING_DIRECTORY`, `ADMIN_USER_IDS`, `HOLIDAYS_COUNTRY`, `CLI_INCLUDE_PARTIAL`, and clarifies that `ANTHROPIC_API_KEY` is optional (CLI auth is the default).

### Fixed
- **Heartbeat dead during tool execution** — previously `stopHeartbeat()` at the top of the CLI event loop killed the spinner on every partial-message delta, leaving the status static during the actual tool wait. Now stops only at points where the visible status changes. (`src/slack-handler.ts`)

### Docs
- **README "Quick Start" (5-minute)** section at the top, before features — clones, installs, creates the Slack app, configures `.env`, and runs in 6 steps.
- **README "Architecture"** section — ASCII data-flow diagram showing how SlackHandler dispatches to CliHandler / AccountManager / CalendarPoller / AssistantScheduler.
- **README "Troubleshooting"** expanded — covers "Claude CLI not found", `files:write` scope missing, rate-limit recovery, account-switch propagation, `pm2` startup failure, holiday-country override, and backup/migration.
- **`autostart-setup.bat` reference removed** — replaced with the standard `pm2-windows-startup` workflow.
- **BASE_DIRECTORY examples** for macOS / Linux (was Windows-only).
- **`docs/google-calendar-setup.md`** — token path clarified to `~/.config/google-calendar-mcp/tokens.json`.
- **CLAUDE.md** locale section updated to reflect the Chinese / English split.

### Removed
- All Korean translations from `src/messages.ts` (226 entries — replaced with Chinese).
- Hardcoded `Holidays('KR')` calls (replaced with env-var lookup).

---

## [1.1.0] - 2026-02-24

Initial public release with the `-version` command and `src/version.ts` (commit `1f83fee`). Prior history is preserved in git but not enumerated here.

[1.2.0]: https://github.com/kkhfiles/claude-code-slack-bot/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/kkhfiles/claude-code-slack-bot/releases/tag/v1.1.0
