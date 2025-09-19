#!/bin/bash

# Simple Bundle Analysis Script - measures bundle sizes for each component library

echo "Starting bundle size analysis..."

# Get baseline (current MUI build)
echo "Building baseline (current app)..."
npm run build > /dev/null 2>&1

if [ -d "dist" ]; then
    echo "## Baseline (Current MUI Implementation)" > component-library-evaluation/results.md
    echo "" >> component-library-evaluation/results.md
    
    total_size=$(find dist/static/js -name "*.js" -exec stat -c%s {} \; | awk '{sum+=$1} END {print sum}')
    total_gzipped=$(find dist/static/js -name "*.js" -exec sh -c 'gzip -c "$1" | wc -c' _ {} \; | awk '{sum+=$1} END {print sum}')
    
    baseline_kb=$((total_gzipped / 1024))
    echo "**Total: $((total_size / 1024)) KB raw, ${baseline_kb} KB gzipped**" >> component-library-evaluation/results.md
    echo "" >> component-library-evaluation/results.md
    
    echo "✅ Baseline: ${baseline_kb} KB gzipped"
else
    echo "❌ Failed to build baseline"
    exit 1
fi

# Create comparison test by modifying the main app temporarily
echo "Creating comparison tests..."

# Test 1: Replace MUI with simple HTML table (no external UI library)
echo "## Custom HTML/CSS Only Implementation" >> component-library-evaluation/results.md
echo "" >> component-library-evaluation/results.md

# Create a simple HTML-only version of the LabelPicker
cat > src/components/LabelPicker-simple.tsx << 'EOF'
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

  const menuStyle: React.CSSProperties = {
    position: 'fixed',
    top: props.position.top,
    left: props.position.left,
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    zIndex: 1000,
    minWidth: '60px'
  };

  const itemStyle: React.CSSProperties = {
    padding: '8px 12px',
    cursor: 'pointer',
    borderBottom: '1px solid #eee'
  };

  return (
    <div ref={menuRef} style={menuStyle}>
      <div
        style={{
          ...itemStyle,
          backgroundColor: !props.value ? '#f0f0f0' : 'transparent'
        }}
        onClick={() => {
          props.onChange();
          props.onClose();
        }}
      >
        NA
      </div>
      {LABELS.map((label) => (
        <div
          key={label}
          style={{
            ...itemStyle,
            backgroundColor: props.value === label ? '#f0f0f0' : 'transparent',
            borderBottom: label === LABELS[LABELS.length - 1] ? 'none' : '1px solid #eee'
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

# Create a simple version of App without MUI CssBaseline
cat > src/App-simple.tsx << 'EOF'
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

# Backup original files
cp src/components/LabelPicker.tsx src/components/LabelPicker.tsx.bak
cp src/App.tsx src/App.tsx.bak

# Replace with simple versions
cp src/components/LabelPicker-simple.tsx src/components/LabelPicker.tsx
cp src/App-simple.tsx src/App.tsx

# Build without MUI
echo "Building without MUI dependencies..."
npm run build > /dev/null 2>&1

if [ -d "dist" ]; then
    total_size=$(find dist/static/js -name "*.js" -exec stat -c%s {} \; | awk '{sum+=$1} END {print sum}')
    total_gzipped=$(find dist/static/js -name "*.js" -exec sh -c 'gzip -c "$1" | wc -c' _ {} \; | awk '{sum+=$1} END {print sum}')
    
    no_mui_kb=$((total_gzipped / 1024))
    savings=$((baseline_kb - no_mui_kb))
    percent_reduction=$(( (savings * 100) / baseline_kb ))
    
    echo "**Total: $((total_size / 1024)) KB raw, ${no_mui_kb} KB gzipped**" >> component-library-evaluation/results.md
    echo "**Savings vs baseline: ${savings} KB (-${percent_reduction}%)**" >> component-library-evaluation/results.md
    echo "" >> component-library-evaluation/results.md
    
    echo "✅ No MUI: ${no_mui_kb} KB gzipped (saved ${savings} KB, -${percent_reduction}%)"
else
    echo "❌ Failed to build without MUI"
fi

# Restore original files
cp src/components/LabelPicker.tsx.bak src/components/LabelPicker.tsx
cp src/App.tsx.bak src/App.tsx
rm src/components/LabelPicker-simple.tsx src/App-simple.tsx src/components/LabelPicker.tsx.bak src/App.tsx.bak

echo ""
echo "📊 Analysis complete! Results saved to component-library-evaluation/results.md"