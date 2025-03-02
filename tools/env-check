#!/bin/sh
set -euo pipefail
# Guards against environment drift

. "$HOME/.nvm/nvm.sh" || { printf "Failed to load nvm\n"; exit 1; }
nvm use || { printf "Failed to switch Node.js version with nvm\n"; exit 1; }

# Check if the output indicates packages would be changed
output=$(npm install --dry-run 2>&1)
if printf "%s" "$output" | grep -q 'added\|removed\|updated'; then
    printf "error: run npm install.\n"
    exit 1
fi
