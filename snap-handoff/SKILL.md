---
name: snap-handoff
description: >
  Compact the current conversation into a handoff document for another agent to
  pick up. Use for handoffs, session transfer, resume context, or next-agent
  continuation.
---

Write a concise handoff document summarizing the current conversation so a fresh agent can continue the work.

Save it to a temp file path produced by `HANDOFF_FILE="$(mktemp -t snap-handoff).md"; : > "$HANDOFF_FILE"` and read the file before writing to it.

Include only continuation-critical context:
- current goal and status
- key decisions, constraints, and user preferences
- referenced artifacts, paths, URLs, branches, commits, issues, or PRs
- completed work, pending next steps, and open questions
- suggested skills for the next session, if any
- verification results or gotchas, if relevant

Do not duplicate content already captured in other artifacts such as PRDs, plans, ADRs, issues, commits, diffs, or generated files. Reference them by path or URL instead.

After writing, report the handoff path.
