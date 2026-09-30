---
name: claude-subagent
description: >
  Use when the user asks to delegate a task to claude as a subagent
---

Run claude headless with a self-contained prompt and a unique log path:

```bash
claude -p '<prompt>' --model <model> --effort <effort> --dangerously-skip-permissions < /dev/null > "$CLAUDE_LOG" 2>&1
```

Defaults: `opus`, `high`. Use the model or effort the user names.

Run it in the background unless the result is needed before continuing. Read the log and verify the result before reporting.
