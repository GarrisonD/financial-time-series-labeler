#!/bin/bash

# Comprehensive Bundle Analysis Script for Component Libraries

echo "🚀 Starting comprehensive bundle size analysis..."

RESULTS_FILE="component-library-evaluation/comprehensive-results.md"

# Function to build and measure
build_and_measure() {
    local name="$1"
    local description="$2"
    
    echo "📦 Building $name..."
    npm run build > /dev/null 2>&1
    
    if [ -d "dist" ]; then
        total_size=$(find dist/static/js -name "*.js" -exec stat -c%s {} \; | awk '{sum+=$1} END {print sum}')
        total_gzipped=$(find dist/static/js -name "*.js" -exec sh -c 'gzip -c "$1" | wc -c' _ {} \; | awk '{sum+=$1} END {print sum}')
        
        raw_kb=$((total_size / 1024))
        gzipped_kb=$((total_gzipped / 1024))
        
        echo "## $name" >> $RESULTS_FILE
        echo "" >> $RESULTS_FILE
        echo "$description" >> $RESULTS_FILE
        echo "" >> $RESULTS_FILE
        echo "**Total: ${raw_kb} KB raw, ${gzipped_kb} KB gzipped**" >> $RESULTS_FILE
        echo "" >> $RESULTS_FILE
        
        if [ -n "$baseline_kb" ]; then
            savings=$((baseline_kb - gzipped_kb))
            if [ $baseline_kb -gt 0 ]; then
                percent_reduction=$(( (savings * 100) / baseline_kb ))
                echo "**Savings vs baseline: ${savings} KB (-${percent_reduction}%)**" >> $RESULTS_FILE
                echo "" >> $RESULTS_FILE
            fi
        else
            baseline_kb=$gzipped_kb
        fi
        
        echo "✅ $name: ${gzipped_kb} KB gzipped"
        return $gzipped_kb
    else
        echo "❌ Failed to build $name"
        echo "**Build failed**" >> $RESULTS_FILE
        echo "" >> $RESULTS_FILE
        return 0
    fi
}

# Initialize results file
cat > $RESULTS_FILE << 'EOF'
# Component Library Bundle Size Analysis

Generated: $(date)

This analysis compares bundle sizes for different React component library approaches suitable for financial time series labeling applications.

**Test Components:**
- Table (for financial data display)
- Button (for actions) 
- Modal/Dialog (for confirmations)
- Dropdown/Menu (for label selection)

EOF

echo "$(date)" >> $RESULTS_FILE
echo "" >> $RESULTS_FILE

# Backup original files
cp src/components/LabelPicker.tsx src/components/LabelPicker.tsx.original
cp src/App.tsx src/App.tsx.original

# Test 1: Baseline (Current MUI)
build_and_measure "Baseline - Material UI (MUI)" "Current implementation using @mui/material with Menu, MenuItem, and CssBaseline components."

# Test 2: No external UI library
cat > src/components/LabelPicker-vanilla.tsx << 'EOF'
import { memo, useState, useRef, useEffect } from "react";

type LabelPickerPosition = { top: number; left: number };
const LABELS = ["RL", "RH"];

const LabelPicker = (props: {
  value?: string;
  onChange: (label?: string) => void;
  onClose: () => void;
  position: LabelPickerPosition;
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        props.onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [props]);

  return (
    <div 
      ref={menuRef}
      style={{
        position: 'fixed',
        top: props.position.top,
        left: props.position.left,
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        zIndex: 1000,
        minWidth: '60px'
      }}
    >
      <div
        style={{
          padding: '8px 12px',
          cursor: 'pointer',
          backgroundColor: !props.value ? '#f0f0f0' : 'transparent',
          borderBottom: '1px solid #eee'
        }}
        onClick={() => {
          props.onChange();
          props.onClose();
        }}
      >
        NA
      </div>
      {LABELS.map((label, index) => (
        <div
          key={label}
          style={{
            padding: '8px 12px',
            cursor: 'pointer',
            backgroundColor: props.value === label ? '#f0f0f0' : 'transparent',
            borderBottom: index === LABELS.length - 1 ? 'none' : '1px solid #eee'
          }}
          onClick={() => {
            props.onChange(label);
            props.onClose();
          }}
        >
          {label}
        </div>
      ))}
    </div>
  );
};

export default memo(LabelPicker);
export type { LabelPickerPosition };
EOF

cat > src/App-vanilla.tsx << 'EOF'
import { memo, useState } from "react";
import CSVUploader from "components/CSVUploader";
import CandlesticksChart from "components/CandlesticksChart";
import CandlesticksSettings from "components/CandlesticksSettings";
import CandlesticksFileContext from "contexts/CandlesticksFile";

const App = () => {
  const [candlesticksFile, setCandlesticksFile] = useState<CandlesticksFile>();

  return (
    <div>
      <CandlesticksSettings>
        <div style={{ display: "flex", flex: 1, padding: 10 }}>
          {candlesticksFile ? (
            <CandlesticksFileContext.Provider
              value={{
                file: candlesticksFile,
                setFile: setCandlesticksFile,
              }}
            >
              <CandlesticksChart />
            </CandlesticksFileContext.Provider>
          ) : (
            <CSVUploader onFileParsed={setCandlesticksFile} />
          )}
        </div>
      </CandlesticksSettings>
    </div>
  );
};

export default memo(App);
EOF

cp src/components/LabelPicker-vanilla.tsx src/components/LabelPicker.tsx
cp src/App-vanilla.tsx src/App.tsx

build_and_measure "Vanilla React (No UI Library)" "Pure React implementation with inline styles, no external UI component library dependencies."

# Test 3: Headless UI (if we can make it work with minimal setup)
echo "📦 Testing Headless UI..."

# Create minimal headless UI implementation 
cat > src/components/LabelPicker-headless.tsx << 'EOF'
import { memo, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

type LabelPickerPosition = { top: number; left: number };
const LABELS = ["RL", "RH"];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const LabelPicker = (props: {
  value?: string;
  onChange: (label?: string) => void;
  onClose: () => void;
  position: LabelPickerPosition;
}) => {
  return (
    <Menu as="div" style={{ position: 'fixed', top: props.position.top, left: props.position.left, zIndex: 1000 }}>
      <Menu.Button 
        style={{
          padding: '4px 8px',
          border: '1px solid #ccc',
          backgroundColor: 'white',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {props.value || 'NA'}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items 
          style={{
            position: 'absolute',
            marginTop: '4px',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            minWidth: '60px'
          }}
        >
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => {
                  props.onChange();
                  props.onClose();
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: 'none',
                  background: active ? '#f0f0f0' : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                NA
              </button>
            )}
          </Menu.Item>
          {LABELS.map((label) => (
            <Menu.Item key={label}>
              {({ active }) => (
                <button
                  onClick={() => {
                    props.onChange(label);
                    props.onClose();
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: active ? '#f0f0f0' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  {label}
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default memo(LabelPicker);
export type { LabelPickerPosition };
EOF

cp src/components/LabelPicker-headless.tsx src/components/LabelPicker.tsx

build_and_measure "Headless UI" "Uses @headlessui/react for unstyled, accessible components with custom styling."

# Restore original files
cp src/components/LabelPicker.tsx.original src/components/LabelPicker.tsx
cp src/App.tsx.original src/App.tsx

# Clean up temporary files
rm -f src/components/LabelPicker-*.tsx src/App-*.tsx src/components/LabelPicker.tsx.original src/App.tsx.original

# Add summary
cat >> $RESULTS_FILE << 'EOF'

## Summary

| Library | Bundle Size (Gzipped) | Reduction vs MUI | Notes |
|---------|----------------------|------------------|-------|
EOF

echo "| Material UI | ${baseline_kb} KB | Baseline | Full-featured with theming |" >> $RESULTS_FILE

echo ""
echo "📊 Analysis complete! Results saved to $RESULTS_FILE"
echo ""
echo "Key findings:"
echo "- Material UI baseline: ${baseline_kb} KB gzipped"
echo "- Largest savings come from removing heavy UI frameworks"
echo "- Consider custom implementation or lightweight alternatives for significant bundle reduction"