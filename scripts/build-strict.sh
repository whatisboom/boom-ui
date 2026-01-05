#!/bin/bash
set -e

# Create temp file and ensure cleanup on exit
output_file=$(mktemp)
trap 'rm -f "$output_file"' EXIT ERR INT TERM

exit_code=0

npm run build:base 2>&1 | tee "$output_file" || exit_code=$?

# Check for TypeScript warnings
if grep -iE "(warning TS|⚠)" "$output_file" > /dev/null; then
  echo ""
  echo "❌ FAILED: Build warnings detected"
  echo ""
  grep -iE "(warning TS|⚠)" "$output_file" || true
  exit 1
fi

if [ $exit_code -ne 0 ]; then
  echo "❌ FAILED: Build failed"
  exit $exit_code
fi

echo "✅ Build completed with no warnings"
exit 0
