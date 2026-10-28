---
name: codex-subagent
description: Delegate a task to Codex as a subagent
disable-model-invocation: true
argument-hint: "[model] [effort] [service_tier] <task>"
allowed-tools: Bash(jq *)
---

The user invoked this skill explicitly, which authorizes running Codex with full access for this task.

default_model: !`codex debug models | jq -r '[.models[].slug | select(test("^gpt-[0-9]+(\\.[0-9]+)?-sol$"))] | first' || echo gpt-6.1-sol`
default_effort: high
default_service_tier: default

If the arguments start with a model slug, an effort level, or a service tier (`default` or `fast`), use them; the rest is the task. Otherwise use `default_model`, `default_effort`, and `default_service_tier`.

1. Write a self-contained prompt for the task to a new file in the scratchpad. For computer use, include the keyword `computer_use` in the prompt.
2. Run Codex as one command, with no variable assignments or `&&` before it, using literal paths:

   codex -m <model> -c model_reasoning_effort="<effort>" -c service_tier="<service_tier>" --dangerously-bypass-approvals-and-sandbox exec - < <prompt-file> > <log-file> 2>&1

3. Run it in the background unless the result is needed before continuing.
4. Read the log and verify the result before reporting.
