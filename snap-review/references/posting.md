# GitHub Review Posting

Post findings only as inline review comments. A finding without an honest changed-line anchor stays in the local report.

## Comment

<template>

**P1: [concise title]**

[Trigger, mechanism, evidence, and impact.]

**Fix:** [corrective direction.]

Reviewed by {agent-harness} using {model-slug}.

</template>

Write the shortest comment that proves the problem and gives a corrective direction. Use concrete facts, active voice, plain words, and one idea per sentence. Cut filler, hedging, repetition, stock AI phrases, and decorative formatting. Keep only the trigger, mechanism, evidence, impact, and fix. Before posting, remove every sentence that does not change what the reader knows or should do.

`{agent-harness}` is the exact product name of the coding tool running the skill, such as `Claude Code` or `Pi`. `{model-slug}` is the exact model identifier. Read both from explicit system or runtime metadata. If either is unavailable, ask before posting; never infer it.

## Placement

- Post one comment per root cause.
- Anchor on a changed root-cause line: `RIGHT` for head lines, `LEFT` for removed base lines.
- Retry a rejected anchor once on the nearest honest changed line; otherwise keep the finding local.
- Multi-line anchors require `start_line` and `start_side`; both endpoints must be in the diff.

## Post

Create each comment through the pull-request review comments API, pinned to the reviewed head SHA.

```json
{
  "body": "<comment>",
  "commit_id": "<head-sha>",
  "path": "path/to/file.ts",
  "line": 42,
  "side": "RIGHT"
}
```

```bash
gh api --method POST \
  "repos/$owner/$repo/pulls/$pr/comments" \
  --input comment.json \
  --jq .html_url
```

Confirm every posted comment exists and return its URL. On failure, report it and keep the local report authoritative.
