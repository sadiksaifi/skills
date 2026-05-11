# GitHub Review Posting

Use this file when posting an approved PR review to GitHub.

## Rules

- Prefer real review threads over top-level review text for findings.
- Post each finding as an inline PR review comment when it has a concrete location on the current PR diff.
- Use the top-level review body only for:
  - findings that cannot be anchored to a current diff line
  - `Missing Tests`
  - `Risks / Unknowns`
  - a short note that inline findings were posted
  - `No Findings`
- Do not duplicate a full finding both inline and in the top-level review body.
- If an exact cited line is outside the current diff, choose the nearest changed line for the same root cause. If no honest changed-line anchor exists, keep the finding in the top-level review body.
- One finding per inline review comment.

## Inline finding body

Use the Markdown inside `<template>` as each inline review comment body. Omit `Location` because the thread anchor supplies it.

<template>

### P1 — [short finding title]

- `Issue:` [what is wrong]
- `Impact:` [why it matters]
- `Evidence:` [how to reproduce or verify the issue from diff, code path, test, command, or linked context]

</template>

## Top-level review body

Use the Markdown inside `<template>` as the review body when at least one finding is posted inline. Include non-inlineable findings under `Findings`; otherwise use the inline note.

<template>

## Findings

[Posted inline on the relevant diff lines, non-inlineable priority-labeled findings, or `No Findings`]

## Missing Tests

[material coverage gaps, or `None`]

## Risks / Unknowns

[merge risks, inaccessible/conflicting context, or `None`]

*Reviewed using [skill:snap-review](https://github.com/sadiksaifi/skills/blob/main/snap-review/SKILL.md)*

</template>

## Post a review with inline comments

Build one pending review containing the top-level body and inline comments, then submit it as `COMMENT`.

Use REST `Create a review for a pull request`:

```bash
gh api \
  --method POST \
  repos/{owner}/{repo}/pulls/{pr}/reviews \
  --input review.json
```

`review.json` shape:

```json
{
  "event": "COMMENT",
  "body": "## Findings\n\nPosted inline on the relevant diff lines.\n\n## Missing Tests\n\nNone\n\n## Risks / Unknowns\n\nNone\n\n*Reviewed using [skill:snap-review](https://github.com/sadiksaifi/skills/blob/main/snap-review/SKILL.md)*",
  "comments": [
    {
      "path": "path/to/file.ts",
      "line": 42,
      "side": "RIGHT",
      "body": "### P1 — Short finding title\n\n- `Issue:` ...\n- `Impact:` ...\n- `Evidence:` ..."
    }
  ]
}
```

Use `side: "RIGHT"` for added/modified head lines and `side: "LEFT"` for removed base lines. For multi-line findings, use `start_line`, `line`, `start_side`, and `side` only when both anchors are in the current diff. If GitHub rejects a line anchor, retry once on the nearest changed line for the same finding; otherwise move that finding to the top-level review body.

## Post a top-level-only review

Use this only when there are no inlineable findings or the user explicitly asks for a top-level review.

```bash
gh pr review {pr} --repo {owner}/{repo} --comment --body "$body"
```
