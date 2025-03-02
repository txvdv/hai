#!/bin/sh
set -euo pipefail
# This script pulls in the latest changes, replacing `git pull`

# Perform a "git pull" with rebase
git pull --rebase || { printf "Failed to pull and rebase changes.\n"; exit 1; }

# Install dependencies with npm
npm ci || { printf "Failed to install npm dependencies with 'npm ci'.\n"; exit 1; }

# Run the env check script to validate environment
tools/env-check.sh || { printf "Environment check script detected issues.\n"; exit 1; }
