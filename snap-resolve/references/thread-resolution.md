# Thread Reply and Resolution

Use this file for reviewer replies and review thread resolution.

## Rules

- Choose one reply channel per item:
  - review thread or line comment → reply inline through the review-comment reply endpoint
  - top-level PR comment → post a top-level quote-reply comment with quoted feedback and source URL
- Do not post a top-level PR comment when a review-thread reply endpoint is available.
- Resolve a review thread only after its `[FIX]` or `[EXPLAIN]` response has been posted in the chosen channel.
- `[FIX]` — fixed, committed, replied in the chosen channel → resolve review thread when applicable.
- `[EXPLAIN]` — explained in the chosen channel → resolve review thread when applicable.
- `Unsure`, skipped, or already-addressed items → do not resolve.
- Already resolved threads → skip.
- Inline reply failure → report and fall back to a top-level quote-reply comment only if useful.
- Permission failure while resolving → report and continue.

## Fetch reply targets

Run during context gathering. Keep:

- review thread `id` for GraphQL resolution
- review comment `databaseId` for inline replies
- review comment `url` for source links and reporting
- top-level PR comment `body` and `url` for quote replies

```bash
gh api graphql -f query='
  query($owner: String!, $repo: String!, $pr: Int!) {
    repository(owner: $owner, name: $repo) {
      pullRequest(number: $pr) {
        reviewThreads(first: 100) {
          nodes {
            id
            isResolved
            path
            comments(first: 50) {
              nodes {
                databaseId
                body
                url
                author { login }
              }
            }
          }
        }
      }
    }
  }
' -f owner='{owner}' -f repo='{repo}' -F pr='{number}'
```

## Build reply body

Use the Markdown inside `<template>` as the review comment/thread reply body and as the inner response body for top-level quote replies. Keep only the section that applies: `## FIXED` for code/docs/test changes, `## EXPLANATION` for explain-only replies.

Use clickable commit links for fixes. Include only verification commands actually run.

<template>

## FIXED

- Fixed [specific reviewer concern] in [commit](https://github.com/OWNER/REPO/commit/SHA).
- [Observable behavior, guard, or coverage added.]

Verified:
- `[command]`

## EXPLANATION

- [Explanation for why this is the right scope, behavior, or decision.]
- [Link to PR/issue/spec context if it explains the decision.]

</template>

## Post review-thread inline reply

Reply to the relevant review comment using its `databaseId`:

```bash
gh api \
  --method POST \
  repos/{owner}/{repo}/pulls/{pr}/comments/{comment_id}/replies \
  -f body="$body"
```

## Build top-level PR quote reply body

For ordinary PR comments from the issue timeline, GitHub has no review-thread reply endpoint. Use the Markdown inside `<template>` as the top-level quote-reply body. Quote only the relevant original feedback, not the whole comment when it is long. Replace `[reply body]` with the applicable `## FIXED` or `## EXPLANATION` body from the reply-body template above.

<template>

> [quoted reviewer finding or request]
> [second quoted line if needed]
>
> Source: ORIGINAL_COMMENT_URL

[reply body]

</template>

## Post top-level PR quote reply

Post the quote-reply body with:

```bash
gh pr comment {pr} --repo {owner}/{repo} --body "$body"
```

## Resolve addressed threads

One mutation per addressed thread after replies are posted:

```bash
gh api graphql -f query='
  mutation($threadId: ID!) {
    resolveReviewThread(input: { threadId: $threadId }) {
      thread { id isResolved }
    }
  }
' -f threadId='{thread_node_id}'
```

## Verify

Re-query unresolved threads after mutations:

```bash
gh api graphql -f query='
  query($owner: String!, $repo: String!, $pr: Int!) {
    repository(owner: $owner, name: $repo) {
      pullRequest(number: $pr) {
        reviewThreads(first: 100, filterBy: {resolved: false}) {
          totalCount
          nodes { id path }
        }
      }
    }
  }
' -f owner='{owner}' -f repo='{repo}' -F pr='{number}'
```

Unexpected open threads mean a reply or resolution was missed.
