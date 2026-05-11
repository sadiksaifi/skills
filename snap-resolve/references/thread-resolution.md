# Thread Reply and Resolution

Use this file for reviewer replies and review thread resolution.

## Rules

- Reply inline to the original review comment/thread when possible.
- Do not use a top-level PR comment when a thread reply endpoint is available.
- Resolve a review thread only after its `[FIX]` or `[EXPLAIN]` reply has been posted.
- `[FIX]` — fixed, committed, replied inline → resolve.
- `[EXPLAIN]` — explained inline → resolve.
- `Unsure`, skipped, or already-addressed items → do not resolve.
- Already resolved threads → skip.
- Inline reply failure → report and fall back to top-level PR comment only if useful.
- Permission failure while resolving → report and continue.

## Fetch thread and comment IDs

Run during context gathering. Keep:

- thread `id` for GraphQL resolution
- comment `databaseId` for inline replies
- comment `url` for source links and reporting

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

Use the Markdown inside `<template>` as the review comment/thread reply body. Keep only the section that applies: `## FIXED` for code/docs/test changes, `## EXPLANATION` for explain-only replies.

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

## Post inline reply

Reply to the relevant review comment using its `databaseId`:

```bash
gh api \
  --method POST \
  repos/{owner}/{repo}/pulls/{pr}/comments/{comment_id}/replies \
  -f body="$body"
```

Use a top-level PR comment only when there is no review comment/thread to reply to.

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
