#!/bin/bash

# Bundle Size Analysis Script
# Creates separate builds for each component library and measures sizes

LIBRARIES=("mui" "headless-ui" "tailwind-only" "mantine" "chakra-ui")
RESULTS_FILE="component-library-evaluation/bundle-results.md"

echo "# Bundle Size Analysis Results" > $RESULTS_FILE
echo "" >> $RESULTS_FILE
echo "Generated: $(date)" >> $RESULTS_FILE
echo "" >> $RESULTS_FILE

# Create temporary build configs for each library
for lib in "${LIBRARIES[@]}"; do
    echo "📦 Analyzing $lib..."
    
    # Create a temporary app file that only imports the specific library
    cat > "src/App-${lib}.tsx" << EOF
import React from 'react';
import Demo from '../component-library-evaluation/${lib}/demo';
import { useDemoData } from '../component-library-evaluation/shared';

export default function App() {
  const { data, onLabelChange } = useDemoData();
  return <Demo data={data} onLabelChange={onLabelChange} />;
}
EOF

    # Create temporary index file
    cat > "src/index-${lib}.tsx" << EOF
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App-${lib}';
import '../component-library-evaluation/styles.css';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
EOF

    # Create temporary rsbuild config
    cat > "rsbuild-${lib}.config.ts" << EOF
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  source: {
    entry: {
      index: './src/index-${lib}.tsx',
    },
  },
  output: {
    distPath: {
      root: 'dist-${lib}',
    },
  },
  plugins: [pluginReact()],
  tools: {
    postcss: {
      postcssOptions: {
        plugins: [
          require('tailwindcss')('./component-library-evaluation/tailwind.config.js'),
          require('autoprefixer'),
        ],
      },
    },
  },
});
EOF

    # Build the specific library version
    npx rsbuild build --config "rsbuild-${lib}.config.ts"
    
    # Analyze the results
    if [ -d "dist-${lib}" ]; then
        echo "## ${lib}" >> $RESULTS_FILE
        echo "" >> $RESULTS_FILE
        
        # Get JS file sizes
        js_files=$(find "dist-${lib}/static/js" -name "*.js" 2>/dev/null)
        total_raw=0
        total_gzipped=0
        
        echo "| File | Raw Size | Gzipped |" >> $RESULTS_FILE
        echo "|------|----------|---------|" >> $RESULTS_FILE
        
        for file in $js_files; do
            if [ -f "$file" ]; then
                raw_size=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file" 2>/dev/null || echo "0")
                gzipped_size=$(gzip -c "$file" | wc -c)
                total_raw=$((total_raw + raw_size))
                total_gzipped=$((total_gzipped + gzipped_size))
                
                filename=$(basename "$file")
                raw_kb=$((raw_size / 1024))
                gzipped_kb=$((gzipped_size / 1024))
                
                echo "| $filename | ${raw_kb} KB | ${gzipped_kb} KB |" >> $RESULTS_FILE
            fi
        done
        
        total_raw_kb=$((total_raw / 1024))
        total_gzipped_kb=$((total_gzipped / 1024))
        
        echo "" >> $RESULTS_FILE
        echo "**Total: ${total_raw_kb} KB raw, ${total_gzipped_kb} KB gzipped**" >> $RESULTS_FILE
        echo "" >> $RESULTS_FILE
        
        echo "✅ $lib: ${total_gzipped_kb} KB gzipped"
    else
        echo "❌ Failed to build $lib"
        echo "**Build failed**" >> $RESULTS_FILE
        echo "" >> $RESULTS_FILE
    fi
    
    # Clean up temporary files
    rm -f "src/App-${lib}.tsx" "src/index-${lib}.tsx" "rsbuild-${lib}.config.ts"
    rm -rf "dist-${lib}"
done

echo ""
echo "📊 Analysis complete! Results saved to $RESULTS_FILE"