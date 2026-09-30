---
name: codex-subagent
description: >
  Use when the user asks to delegate a task to codex as a subagent
---

Run codex headless with a self-contained prompt and a unique log path:

```bash
codex -m <model> -c model_reasoning_effort="<effort>" --dangerously-bypass-approvals-and-sandbox exec '<prompt>' < /dev/null > "$CODEX_LOG" 2>&1
```

Defaults: `gpt-6.1-sol`, `high`. Use the model or effort the user names. For computer use, include the keyword `computer use` in the prompt.

Run it in the background unless the result is needed before continuing. Read the log and verify the result before reporting.
