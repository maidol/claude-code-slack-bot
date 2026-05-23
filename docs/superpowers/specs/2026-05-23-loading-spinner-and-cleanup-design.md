# Loading Spinner UX + Commit Cleanup + Docs

**Date**: 2026-05-23
**Status**: Approved (brainstorming)

## Context

User feedback after the recent `6e012b5` ("auto-create `.claude/settings.local.json`") landed:

1. Review the last few commits for missed issues.
2. Polish documentation that drifted from current behavior.
3. Match the Claude Code terminal "loading" feel — animated spinner + rotating verb + token counter + cancel hint — across all Slack waiting states.

Scope is a single coordinated change covering all three.

## Goals

- Close three concrete holes left by `6e012b5`.
- Replace the static "🤔 Thinking…" / 5-second clock heartbeat with a Claude-Code-style animated status: brail spinner, rotating verbs, token counter, `-stop` hint.
- Bring `README.md` back in sync with current behavior.

## Non-goals

- No global rate-limit throttler for `chat.update` (YAGNI — current `.catch(() => {})` swallows ratelimited frames, which is acceptable when it happens).
- No replacement of the anchor reaction `⏳` (hourglass_flowing_sand) — kept as-is.
- No spinner on the rate-limit `⏳` countdown message (countdown should not visually "spin").
- No spinner on session picker / sessions list load (typically <1s).

## Part 1 — Commit Cleanup (`6e012b5`)

### 1A. `apiKeyHelper` shell-injection hardening

**Where**: `src/working-directory-manager.ts` → `ensureSettingsFile()` (~line 172)

Current code:
```ts
payload.apiKeyHelper = `echo '${apiKey}'`;
```

If `apiKey` contains `'`, `$`, backtick, or `\`, the resulting `helper` invocation breaks (or worse, allows interpolation). Even with sk-ant-… keys this is fragile.

Fix:
- Validate `apiKey` against `^[A-Za-z0-9_\-]+$` before writing apiKeyHelper.
- If valid → write `apiKeyHelper: \`echo '${apiKey}'\`` as today.
- If invalid → omit `apiKeyHelper` (Local-scope `env.ANTHROPIC_API_KEY` still works for the CLI), and log a warning explaining why.

### 1B. Session-picker silent side effect

**Where**: `src/slack-handler.ts` session-picker resume branch (~line 2939, see audit step)

When a user picks an old session from a different project, the picker auto-calls `setWorkingDirectory()` → `ensureSettingsFile()` may write a file the user didn't expect.

Fix: If the call returns `settingsCreated: true`, append `💡 ${t('cwd.settingsCreated', locale)}` to the picker's "Resuming…" message, matching the explicit `-cwd` UX.

### 1C. README missing the new behavior

**Where**: `README.md` "Working Directory" section.

Add a short subsection ("Per-project Anthropic config") explaining:
- On every successful `-cwd`, the bot writes `.claude/settings.local.json` into the target cwd containing your `.env`'s `ANTHROPIC_API_KEY` / `ANTHROPIC_BASE_URL`.
- Why: Claude CLI only reads settings from `<cwd>/.claude/` and `~/.claude/` — no upward recursion. Without this, a user-level `apiKeyHelper` silently overrides your `.env`'s gateway URL.
- Opt-out: delete the file. The bot only creates it when missing — it will not be recreated.

## Part 2 — Loading Spinner

### 2A. Visual contract

For every waiting status, Slack message text follows this template (locale-aware):

```
{emoji} *{verb}…* {spinner} {sec}s · ↑ {tokens} tokens

_send `-stop` to cancel_
```

Examples:
- `🤔 *Pondering…* ⠋ 12s` (no tokens yet)
- `🤔 *Considering…* ⠙ 14s · ↑ 1.2k tokens`
- `🔍 *Using Grep…* ⠹ 16s · ↑ 1.2k tokens`
- `🔍 *Using Grep (3)…* ⠸ 20s · ↑ 1.5k tokens`
- `✍️ *Writing…*` (no spinner — text is streaming and refreshes itself)

The trailing `_send \`-stop\` to cancel_` line is added to **every** heartbeat-controlled status. It is omitted for the `✍️ Writing` static state (text streams there, so the hint would flicker).

### 2B. Brail spinner

Replace existing `SPINNER_FRAMES` clock emoji array:
```ts
const SPINNER_FRAMES = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏'];
```

Rotation: advance one frame per heartbeat tick. Slack renders brail Unicode reliably on desktop and modern mobile.

### 2C. Frame rate

Change heartbeat `setInterval` from `5000` → `2000` ms.

Rationale: brail rotation at 5s feels glacial; 2s reads as "in motion" without burning `chat.update` budget. Single status message per session ⇒ ~0.5 Hz per session ⇒ 10 concurrent sessions = 5 QPS, well under Slack tier-3 limits in practice. Existing `.catch(() => {})` is the safety net.

### 2D. Rotating verbs (Thinking / Planning only)

Add two locale-keyed arrays as a module-level constant in `src/slack-handler.ts` (not routed through `t()` — the catalog stores discrete strings, but for rotation we need indexable arrays).

```ts
// in src/slack-handler.ts (module level, above class)
const THINKING_VERBS: Record<Locale, string[]> = {
  en: ['Thinking', 'Pondering', 'Considering', 'Reflecting', 'Mulling',
       'Synthesizing', 'Crafting', 'Reasoning', 'Analyzing', 'Deliberating'],
  zh: ['思考中', '推演中', '探索中', '沉思中', '构思中',
       '汇总中', '分析中', '揣度中', '斟酌中', '推敲中'],
};
```

Verb rotation:
- A `verbIndex` counter advances every **3 ticks** (= every 6 seconds).
- Active only when `heartbeatLabel` matches the initial "Thinking" / "Planning" status — i.e. when the bot is waiting for the model to begin tool use or write text.
- Once a `tool_use` event fires, the label switches to `🔍 Using {{toolName}}` and stays there (no verb rotation); the spinner still rotates.

To keep the system simple, the heartbeat owns a `phase: 'thinking' | 'tool' | null` and rotates verbs only when `phase === 'thinking'`.

### 2E. Token counter

CLI `assistant` events include `message.usage` with cumulative counts. Track in scope:

```ts
let totalInputTokens = 0;
// in 'assistant' event handler:
const usage = assistantEvent.message?.usage;
if (usage) {
  totalInputTokens = (usage.input_tokens || 0)
                   + (usage.cache_read_input_tokens || 0)
                   + (usage.cache_creation_input_tokens || 0);
}
```

`formatTokens(n)`:
- n < 1000 → `n` (e.g., `347`)
- n < 1_000_000 → `(n/1000).toFixed(1).replace(/\.0$/, '')` + `k` (e.g., `1.2k`)
- else → `(n/1_000_000).toFixed(1).replace(/\.0$/, '')` + `M`

Render only when `totalInputTokens > 0` (initial Thinking has zero).

### 2F. Coverage extension

Currently `startHeartbeat()` fires only on `stream_event` content_block_start (tool_use). Extend so the spinner is alive whenever the user is waiting:

| State | startHeartbeat? | Verb rotation? |
|---|---|---|
| `🤔 Thinking` (initial) | yes | yes |
| `📝 Planning` (initial, plan mode) | yes | yes |
| `📎 Processing N file(s)` | yes | no (label fixed) |
| `🔍 Using Grep` etc. | yes (current) | no |
| `✍️ Writing` | no — stop (current) | n/a |
| Rate-limit ⏳ countdown | no | no |
| Permission-pending status | yes | no |

Implementation: call `startHeartbeat(initialLabel)` right after the initial status message is created (`say()` returns ts) — instead of only on first tool_use.

### 2G. i18n new keys

```ts
// in messages.ts
'status.cancelHint': {
  en: '_send `-stop` to cancel_',
  zh: '_发送 `-stop` 中断_',
},
'status.tokens': {
  en: '↑ {{count}} tokens',
  zh: '↑ {{count}} tokens',  // English token count is fine in zh too
},
```

The composed heartbeat text builder takes `(emoji, verb, sec, tokens, locale)` and outputs a 2-line string.

### 2H. Backward compatibility / opt-out

Add `LOADING_SPINNER_ENABLED` env (default `1`). When `0`:
- Skip the new spinner: revert to a single static `chat.update` on each state change (no `setInterval`).
- Rationale: lets users disable on slow networks or noisy workspaces without code changes.

## Part 3 — Documentation

### 3A. README updates

- **Working Directory** → add subsection "Per-project Anthropic config" (see 1C).
- **Status & feedback** → add 4-line block describing the new spinner format. Show a snippet:
  ```
  🤔 *Pondering…* ⠋ 12s · ↑ 1.2k tokens

  _send `-stop` to cancel_
  ```
- **Commands** → no change.
- **Configuration** → mention `LOADING_SPINNER_ENABLED`.

### 3B. `.env.example`

Add:
```
# Disable the animated status spinner / verb rotation (0 to disable, default 1)
# LOADING_SPINNER_ENABLED=1
```

### 3C. CLAUDE.md

No update — internal architecture didn't change. (Add an entry only if the developer-facing patterns shifted.)

## Risk + Mitigation

| Risk | Mitigation |
|---|---|
| `chat.update` ratelimit on busy workspaces | `.catch(() => {})` already swallows; frame just gets skipped |
| Brail unicode renders as boxes on old mobile clients | Acceptable degradation; clock emoji fallback can be added later if reported |
| Verb rotation feels gimmicky | 6s/word cadence is slow enough to feel deliberate; can dial back to 1 word per state if user feedback says so |
| apiKey validation regex too strict (rejects valid keys) | sk-ant-… format is `[A-Za-z0-9_\-]+` — safe. If new key formats appear, broaden regex |

## Files Touched

- `src/working-directory-manager.ts` — apiKey validation in `ensureSettingsFile()`
- `src/slack-handler.ts` — spinner overhaul: frames, frame rate, verb rotation, token counter, coverage extension, env toggle, picker-resume settings notice
- `src/messages.ts` — new i18n keys (`status.cancelHint`, `status.tokens`)
- `src/config.ts` — `LOADING_SPINNER_ENABLED` env wire-up
- `.env.example` — document new env
- `README.md` — Working Directory + Status sections

## Acceptance

1. `-cwd <new-dir>` followed by a Slack message shows:
   - `🤔 *Thinking…* ⠋ 0s` → updates verb after 6s → `🤔 *Pondering…* ⠙ 6s · ↑ 234 tokens` →
   - On first tool use: `🔍 *Using Grep…* ⠹ 8s · ↑ 234 tokens` (no verb rotation, spinner continues)
   - On text output: `✍️ *Writing…*` (static; spinner stops)
   - On done: `✅ *Task completed* (Grep ×3)` (existing, unchanged)
2. Locale-zh user sees identical layout with Chinese verbs.
3. `.claude/settings.local.json` with malformed apiKey (containing `'`) writes only `env`, logs a warning, no `apiKeyHelper`.
4. Picking a session for a different project shows the picker resume message **plus** "💡 …settings.local.json created" when applicable.
5. README updated; `LOADING_SPINNER_ENABLED=0` disables animation.
