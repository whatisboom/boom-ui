#!/bin/bash
set -e

# Capture build output
output_file=$(mktemp)
exit_code=0

npm run typecheck && (tsc && vite build) 2>&1 | tee "$output_file" || exit_code=$?

# Check for TypeScript warnings
if grep -iE "(warning TS|⚠)" "$output_file" > /dev/null; then
  echo ""
  echo "❌ FAILED: Build warnings detected"
  echo ""
  grep -iE "(warning TS|⚠)" "$output_file" || true
  rm "$output_file"
  exit 1
fi

rm "$output_file"

if [ $exit_code -ne 0 ]; then
  echo "❌ FAILED: Build failed"
  exit $exit_code
fi

echo "✅ Build completed with no warnings"
exit 0
