# GitHub Review Posting

Post only reviews with at least one priority finding. Use the local finding shape without `Risks / Unknowns`.

## Placement

- Anchor a finding inline when a current diff line honestly represents its root cause.
- Use one inline comment per finding.
- Put non-inlineable findings in the top-level review body.
- Keep each finding in one place.
- Use `RIGHT` for added or modified head lines and `LEFT` for removed base lines.
- For a rejected anchor, retry once on the nearest changed line for the same root cause; then move the finding to the top-level body.

## Inline review

Create one `COMMENT` review containing all inline comments and any non-inlineable findings. Pin it to the reviewed head SHA.

`review.json`:

```json
{
  "event": "COMMENT",
  "commit_id": "<head-sha>",
  "body": "<non-inline findings, or: See inline findings.>",
  "comments": [
    {
      "path": "path/to/file.ts",
      "line": 42,
      "side": "RIGHT",
      "body": "### P1: Incorrect behavior\n\n- Location: `path/to/file.ts:42`\n- Failure: [trigger, mechanism, and evidence]\n- Impact: [consequence]\n- Fix: [corrective direction]"
    }
  ]
}
```

For a multi-line anchor, add `start_line` and `start_side`; both endpoints must be in the current diff.

```bash
gh api --method POST \
  "repos/$owner/$repo/pulls/$pr/reviews" \
  --input review.json
```

## Top-level review

Use only when no finding has an honest inline anchor or the user explicitly requests top-level feedback. Join finding blocks with one blank line.

```bash
gh pr review "$pr" --repo "$owner/$repo" \
  --comment --body "$body"
```

After posting, confirm the review and comments exist and return the review URL. A posting failure leaves the local report authoritative and must be reported.
