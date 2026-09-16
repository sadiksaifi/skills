# Replies and Thread Resolution

Reply through the feedback's original channel, then resolve eligible review threads.

## Capture targets

Fetch thread state and reply identifiers during evidence gathering. Paginate beyond 100 threads.

```bash
gh api graphql --paginate -f query='
  query($owner: String!, $repo: String!, $pr: Int!, $endCursor: String) {
    repository(owner: $owner, name: $repo) {
      pullRequest(number: $pr) {
        reviewThreads(first: 100, after: $endCursor) {
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
                replyTo { databaseId }
              }
            }
          }
          pageInfo { hasNextPage endCursor }
        }
      }
    }
  }
' -F owner="$owner" -F repo="$repo" -F pr="$pr"
```

Keep the thread `id`, root comment `databaseId` (`replyTo: null`), relevant comment `url`, and resolution state. The REST reply endpoint rejects replies to replies. PR-context gathering supplies top-level comment bodies and URLs.

## Choose one channel

| Feedback source | Response |
| --- | --- |
| review thread or line comment | inline reply using the root comment `databaseId` |
| top-level PR comment | top-level quote reply with the source URL |
| CI only | no reply |

A CI item merged with review feedback uses that feedback's channel.

## Reply bodies

For `[FIX]`, use the exact body below. Link the pushed commit and list only checks actually run.

<template>

## FIXED

- Fixed [specific concern] in [commit](https://github.com/OWNER/REPO/commit/SHA).
- [Observable result or regression coverage.]

Verified:
- `[command]`

</template>

For `[EXPLAIN]`, use:

<template>

## EXPLANATION

- [Concise explanation of the behavior, scope, or decision.]
- [Relevant issue, PR, or specification link when useful.]

</template>

Wrap a top-level response with the relevant original excerpt:

<template>

> [Relevant feedback excerpt.]
>
> Source: ORIGINAL_COMMENT_URL

[FIXED or EXPLANATION body]

</template>

## Post replies

Review-thread reply:

```bash
gh api --method POST \
  "repos/$owner/$repo/pulls/$pr/comments/$comment_id/replies" \
  -f body="$body"
```

Top-level quote reply:

```bash
gh pr comment "$pr" --repo "$owner/$repo" --body "$body"
```

If an inline reply fails, report it; use a top-level quote reply only when it still helps the reviewer.

## Resolve threads

Resolve a thread only after its selected `[FIX]` or `[EXPLAIN]` reply succeeds. Leave `Unsure`, skipped, already-addressed, already-resolved, and failed-reply threads unchanged.

```bash
gh api graphql -f query='
  mutation($threadId: ID!) {
    resolveReviewThread(input: { threadId: $threadId }) {
      thread { id isResolved }
    }
  }
' -F threadId="$thread_id"
```

Report permission failures and continue. Re-run the capture query after mutations; every unexpected unresolved thread is a missed reply, failed resolution, or reported blocker.
