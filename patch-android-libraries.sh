#!/bin/bash

# Script to patch React Native library build.gradle files for compatibility with AGP 8.11.0

echo "Patching React Native library build.gradle files..."

# Find all build.gradle files in node_modules
find node_modules -name "build.gradle" -path "*/android/build.gradle" | while read -r file; do
    echo "Processing: $file"

    # Update AGP version from 7.x to 8.11.0
    if grep -q 'classpath "com.android.tools.build:gradle:7\.' "$file"; then
        sed -i.bak 's/classpath "com.android.tools.build:gradle:7\.[0-9.]*"/classpath "com.android.tools.build:gradle:8.11.0"/' "$file"
        echo "  ✓ Updated AGP version"
    fi

    # Replace lintOptions with lint
    if grep -q 'lintOptions {' "$file"; then
        sed -i.bak 's/lintOptions {/lint {/' "$file"
        echo "  ✓ Updated lintOptions to lint"
    fi

    # Remove backup files
    rm -f "${file}.bak"
done

echo "✓ Patching complete!"
