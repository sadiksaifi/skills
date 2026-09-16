# PR Body Template

Fallback for repositories without a PR template. Optimize for reviewer scan without requiring branch-history reconstruction.

Use an outcome title, a one- or two-sentence summary, two to six change bullets, and only verification that ran. If none ran, state the reason.

Each section has one owner:

- `Summary`: motivation and scope boundary
- `Changes`: delivered behavior
- `Verification`: observed automated and manual evidence
- `Related`: issue or specification links

<template>

## Summary

[Explain why this PR exists and where its scope ends.]

## Changes

- [Reviewer-relevant change and observable effect.]

## Verification

- Automated: `[command]` - [result]
- Manual: [action] -> [observed result]

## Related

- Closes [issue reference]

</template>

Omit unused verification lines and `## Related`. With no verification, use `Not run: [reason]`.
