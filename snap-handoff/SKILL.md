---
name: snap-handoff
description: >
  Use when the current session must be transferred to a fresh agent, paused for
  later resumption, or compacted before a context reset.
---

## Workflow

1. **Gather.** Capture the current goal, exact status, completed work, decisions, constraints, user preferences, repository state, verification, blockers, open questions, and ordered next actions.

2. **Compress.** Keep only continuation-critical facts. Reference durable issues, PRs, commits, diffs, plans, ADRs, paths, and URLs instead of restating them. Preserve exact identifiers and commands.

3. **Write.** Create a Markdown file in a dedicated temporary directory, then use [`references/template.md`](references/template.md):

   ```bash
   HANDOFF_DIR="$(mktemp -d "${TMPDIR:-/tmp}/snap-handoff.XXXXXX")"
   HANDOFF_FILE="$HANDOFF_DIR/handoff.md"
   ```

4. **Verify.** Re-read the file. Confirm the state is current, references are exact, verification claims are factual, and the first next action is executable without the original conversation. Report the path in `$HANDOFF_FILE`.

Completion: a fresh agent can identify the goal, current state, governing decisions, evidence, blockers, and next action without rediscovery.
