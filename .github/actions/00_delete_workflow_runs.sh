#!/bin/bash

set -e

org="$1"
repo="$2"

if [ -z "$org" ] || [ -z "$repo" ]; then
  echo "Usage: $0 <org> <repo>"
  exit 1
fi

echo "Deleting workflow runs for $org/$repo"

workflows_temp=$(mktemp) # Creates a temporary file to store workflow data.

# Fetch workflows and handle potential errors
if ! gh api repos/$org/$repo/actions/workflows | jq -r '.workflows[] | [.id, .path] | @tsv' > "$workflows_temp"; then
  echo "Failed to fetch workflows for $org/$repo"
  exit 1
fi

cat "$workflows_temp" 

workflows_names=$(awk '{print $2}' "$workflows_temp" | grep -v "main")

if [ -z "$workflows_names" ]; then
  echo "All workflows are either successful or failed. Nothing to remove"
else
  echo "Removing all the workflows that are not successful or failed"
  for workflow_name in $workflows_names; do
    workflow_filename=$(basename "$workflow_name")
    echo "Deleting |$workflow_filename|, please wait..."

    # Fetch and delete workflow runs
    if ! gh run list --limit 500 --workflow "$workflow_filename" --json databaseId | 
       jq -r '.[] | .databaseId' | 
       xargs -I{} gh run delete {}; then
      echo "Failed to delete workflow runs for $workflow_filename"
    fi
  done
fi

rm -rf "$workflows_temp"

echo "Done."

