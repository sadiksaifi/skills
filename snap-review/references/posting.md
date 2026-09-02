# GitHub Review Posting

Use this file when posting an approved PR review to GitHub.

Only post when the review contains at least one priority-labeled finding. Treat a material missing-test gap as a `Missing regression coverage` finding before posting. Never post `No Findings`, speculative risks, pending-check notes, summaries, praise, or boilerplate.

## Style

Use this compact finding style:

- one standalone finding block per root cause
- heading: priority plus concise defect title
- fields in this order: `Location`, `Reason`, `Impact`, `Evidence`, `Fix direction`
- plain field labels, without inline-code decoration
- concrete failure mechanism in `Reason`
- observable consequence in `Impact`
- diff, call-path, test, command, or linked-context proof in `Evidence`
- specific corrective action in `Fix direction`

Prefer these stable defect titles when they fit: `Incorrect behavior`, `Missing validation`, `Resource lifecycle defect`, `Concurrency defect`, `Security boundary defect`, `Privacy defect`, `Performance regression`, `Architecture defect`, `Compatibility regression`, `Error handling defect`, and `Missing regression coverage`.

## Rules

- Prefer real review threads over top-level review text.
- Post each finding inline when it has an honest anchor on the current PR diff.
- Include `Location` even in inline comments; use `path:start-end (RIGHT|LEFT)` or `path:line (RIGHT|LEFT)`.
- Put only non-inlineable findings and the required footer in the top-level review body.
- If every finding is inline, use only the footer as the top-level body. Do not add a summary or "posted inline" note.
- Do not duplicate a finding both inline and in the top-level review body.
- If an exact cited line is outside the current diff, choose the nearest changed line for the same root cause. If no honest changed-line anchor exists, keep the finding in the top-level review body.
- One finding per inline review comment.
- Do not include local-report sections, severity explanations, merge instructions, or other reviewer boilerplate in the GitHub review.
- End the top-level body with the footer exactly once, after all non-inlineable finding blocks.

## Finding body

Use the Markdown inside `<template>` for both inline comments and non-inlineable top-level findings. Concatenate multiple top-level findings with one blank line between blocks.

<template>

### P1 — Incorrect behavior

- Location: `path/to/file.ts:42 (RIGHT)`
- Reason: [concrete trigger or affected path and resulting defect]
- Impact: [specific user, system, security, performance, compatibility, or maintenance consequence]
- Evidence: [how the diff, call path, test, command, or linked context proves the issue]
- Fix direction: [specific corrective action without supplying a full patch]

</template>

## Footer

Place this footer at the very end of every top-level review body.

<template>

*Reviewed using [skill:snap-review](https://github.com/sadiksaifi/skills/blob/main/snap-review/SKILL.md)*

</template>

## Post a review with inline comments

Build one pending review containing all inline comments and any non-inlineable finding blocks, then submit it as `COMMENT`.

Use REST `Create a review for a pull request`:

```bash
gh api \
  --method POST \
  repos/{owner}/{repo}/pulls/{pr}/reviews \
  --input review.json
```

`review.json` shape when every finding is inline:

```json
{
  "event": "COMMENT",
  "body": "*Reviewed using [skill:snap-review](https://github.com/sadiksaifi/skills/blob/main/snap-review/SKILL.md)*",
  "comments": [
    {
      "path": "path/to/file.ts",
      "line": 42,
      "side": "RIGHT",
      "body": "### P1 — Incorrect behavior\n\n- Location: `path/to/file.ts:42 (RIGHT)`\n- Reason: The changed branch returns the cached value after the cache has been invalidated.\n- Impact: Callers receive stale data for a supported request.\n- Evidence: The invalidation path leaves this early return reachable without repopulating the cache.\n- Fix direction: Restore cache population before this return path."
    }
  ]
}
```

When the review has non-inlineable findings, prepend their finding blocks and a blank line to the footer in `body`. Use `side: "RIGHT"` for added or modified head lines and `side: "LEFT"` for removed base lines. For multi-line findings, use `start_line`, `line`, `start_side`, and `side` only when both anchors are in the current diff. If GitHub rejects a line anchor, retry once on the nearest changed line for the same finding; otherwise move that finding to the top-level review body.

## Post a top-level-only review

Use this only when no finding can be anchored honestly or the user explicitly asks for a top-level review. The body is one or more finding blocks followed by the footer, with no wrapper sections.

```bash
gh pr review {pr} --repo {owner}/{repo} --comment --body "$body"
```
