#!/bin/bash
set -e

# Run tests and capture both stdout and stderr
output_file=$(mktemp)
exit_code=0

./scripts/run-tests-isolated.sh 2>&1 | tee "$output_file" || exit_code=$?

# Check for common warning patterns
if grep -iE "(warning|not wrapped in act|console\.(warn|error))" "$output_file" > /dev/null; then
  echo ""
  echo "❌ FAILED: Test warnings detected"
  echo ""
  echo "Found warnings in test output:"
  grep -iE "(warning|not wrapped in act|console\.(warn|error))" "$output_file" || true
  rm "$output_file"
  exit 1
fi

rm "$output_file"

if [ $exit_code -ne 0 ]; then
  echo "❌ FAILED: Tests failed"
  exit $exit_code
fi

echo "✅ All tests passed with no warnings"
exit 0
