#!/bin/bash

# Run each test file in complete isolation
# Each vitest process terminates after running one file

# Use explicit parentheses for find OR condition
test_files=$(find src -type f \( -name "*.test.ts" -o -name "*.test.tsx" \) | sort)

if [ -z "$test_files" ]; then
  echo "ERROR: No test files found!"
  exit 1
fi

# Count total test files
total=$(echo "$test_files" | wc -l)
echo "Found $total test files"
echo ""

passed=0
failed=0
failed_files=()

for file in $test_files; do
  echo "[$((passed + failed + 1))/$total] Running: $file"
  if npx vitest run --no-coverage "$file" 2>&1; then
    ((passed++))
  else
    ((failed++))
    failed_files+=("$file")
  fi
  echo ""
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
