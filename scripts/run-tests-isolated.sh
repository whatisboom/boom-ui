#!/bin/bash
set -e

# Run each test file in complete isolation
# Each vitest process terminates after running one file

test_files=$(find src -name "*.test.ts" -o -name "*.test.tsx" | sort)

passed=0
failed=0
failed_files=()

for file in $test_files; do
  echo "Running: $file"
  if npx vitest run --no-coverage "$file"; then
    ((passed++))
  else
    ((failed++))
    failed_files+=("$file")
  fi
done

echo ""
echo "================================"
echo "Test Summary:"
echo "Passed: $passed files"
echo "Failed: $failed files"

if [ $failed -gt 0 ]; then
  echo ""
  echo "Failed files:"
  for file in "${failed_files[@]}"; do
    echo "  - $file"
  done
  exit 1
fi

echo "All tests passed!"
