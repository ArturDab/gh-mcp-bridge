#!/usr/bin/env bash
# Zdejmuje draft z PR przez GraphQL markPullRequestReadyForReview.
# REST pulls.update({draft:false}) = 405; GitHub nie wspiera zmiany draft przez REST.
#
# Użycie: mark-pr-ready.sh OWNER REPO PR_NUMBER
# Wymaga: GITHUB_TOKEN w env, curl, jq

set -euo pipefail

OWNER="${1:?brak OWNER}"
REPO="${2:?brak REPO}"
PR_NUM="${3:?brak PR_NUMBER}"

NODE_ID=$(curl -sf \
  -H "Authorization: bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$OWNER/$REPO/pulls/$PR_NUM" | jq -r .node_id)

[ -z "$NODE_ID" ] || [ "$NODE_ID" = "null" ] && { echo "ERROR: nie udalo sie pobrac node_id PR #$PR_NUM" >&2; exit 1; }

RESULT=$(curl -sf -X POST https://api.github.com/graphql \
  -H "Authorization: bearer $GITHUB_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"query\":\"mutation{markPullRequestReadyForReview(input:{pullRequestId:\\\"$NODE_ID\\\"}){pullRequest{isDraft number}}}\"}")

echo "$RESULT" | jq .
IS_DRAFT=$(echo "$RESULT" | jq -r '.data.markPullRequestReadyForReview.pullRequest.isDraft')
[ "$IS_DRAFT" = "false" ] && echo "OK: PR #$PR_NUM jest teraz ready for review" || { echo "ERROR: PR nadal draft" >&2; exit 1; }
