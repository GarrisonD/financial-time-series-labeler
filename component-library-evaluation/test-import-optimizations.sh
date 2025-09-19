#!/bin/bash

# Optimized Bundle Test - Direct measurement of component library demos

echo "🔬 Testing import optimizations on demo components..."

RESULTS_FILE="component-library-evaluation/import-optimization-results.md"

# Function to create test app and measure
test_library() {
    local lib="$1"
    local name="$2"
    local optimized="$3"
    
    echo "📦 Testing $name..."
    
    # Create test entry point
    cat > "src/test-${lib}.tsx" << EOF
import React from 'react';
import { createRoot } from 'react-dom/client';
import Demo from '../component-library-evaluation/${lib}/demo';
import { useDemoData } from '../component-library-evaluation/shared';
import '../component-library-evaluation/styles.css';

function App() {
  const { data, onLabelChange } = useDemoData();
  return <Demo data={data} onLabelChange={onLabelChange} />;
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
EOF
    
    # Create test config
    cat > "rsbuild-${lib}.config.ts" << EOF
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  source: {
    entry: {
      index: './src/test-${lib}.tsx',
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
          require('@tailwindcss/postcss'),
          require('autoprefixer'),
        ],
      },
    },
  },
});
EOF

    # Build
    npx rsbuild build --config "rsbuild-${lib}.config.ts" > /dev/null 2>&1
    
    if [ -d "dist-${lib}" ]; then
        total_size=$(find "dist-${lib}/static/js" -name "*.js" -exec stat -c%s {} \; | awk '{sum+=$1} END {print sum}')
        total_gzipped=$(find "dist-${lib}/static/js" -name "*.js" -exec sh -c 'gzip -c "$1" | wc -c' _ {} \; | awk '{sum+=$1} END {print sum}')
        
        raw_kb=$((total_size / 1024))
        gzipped_kb=$((total_gzipped / 1024))
        
        echo "## $name" >> $RESULTS_FILE
        echo "" >> $RESULTS_FILE
        echo "Import Pattern: $optimized" >> $RESULTS_FILE
        echo "" >> $RESULTS_FILE
        echo "**Total: ${raw_kb} KB raw, ${gzipped_kb} KB gzipped**" >> $RESULTS_FILE
        echo "" >> $RESULTS_FILE
        
        echo "✅ $name: ${gzipped_kb} KB gzipped"
        
        # Cleanup
        rm -f "src/test-${lib}.tsx" "rsbuild-${lib}.config.ts"
        rm -rf "dist-${lib}"
        
        return $gzipped_kb
    else
        echo "❌ Failed to build $name"
        rm -f "src/test-${lib}.tsx" "rsbuild-${lib}.config.ts"
        return 0
    fi
}

# Initialize results file
cat > $RESULTS_FILE << 'EOF'
# Import Optimization Impact Analysis

This analysis directly measures the bundle size impact of different import patterns for component libraries.

EOF

echo "Generated: $(date)" >> $RESULTS_FILE
echo "" >> $RESULTS_FILE

# Test original vs optimized MUI imports
echo "Testing Material-UI import optimizations..."

# First, backup the optimized version
cp component-library-evaluation/mui/demo.tsx component-library-evaluation/mui/demo-optimized.tsx

# Create unoptimized version for comparison
cat > component-library-evaluation/mui/demo-unoptimized.tsx << 'EOF'
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";

import { DemoComponentsProps, LABEL_OPTIONS } from "../shared";

const theme = createTheme();

function FinancialTable({ data, onLabelChange }: DemoComponentsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleLabelClick = (
    event: React.MouseEvent<HTMLElement>,
    rowId: number,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowId);
  };

  const handleLabelSelect = (label?: string) => {
    if (selectedRowId !== null) {
      onLabelChange(selectedRowId, label);
    }
    setAnchorEl(null);
    setSelectedRowId(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRowId(null);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell align="right">Open</TableCell>
              <TableCell align="right">High</TableCell>
              <TableCell align="right">Low</TableCell>
              <TableCell align="right">Close</TableCell>
              <TableCell align="center">Label</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  {new Date(row.timestamp).toLocaleTimeString()}
                </TableCell>
                <TableCell align="right">{row.open.toFixed(2)}</TableCell>
                <TableCell align="right">{row.high.toFixed(2)}</TableCell>
                <TableCell align="right">{row.low.toFixed(2)}</TableCell>
                <TableCell align="right">{row.close.toFixed(2)}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={(e) => handleLabelClick(e, row.id)}
                  >
                    {row.label || "NA"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => handleLabelSelect(undefined)}>NA</MenuItem>
        {LABEL_OPTIONS.map((label) => (
          <MenuItem key={label} onClick={() => handleLabelSelect(label)}>
            {label}
          </MenuItem>
        ))}
      </Menu>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setModalOpen(true)}
        style={{ marginTop: 16 }}
      >
        Open Demo Modal
      </Button>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Financial Data Labeling</DialogTitle>
        <DialogContent>
          This is a demo modal showing how dialogs work with Material-UI. In a
          real application, this might contain additional labeling options or
          data visualization.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={() => setModalOpen(false)} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default function MUIDemo({ data, onLabelChange }: DemoComponentsProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ padding: 16 }}>
        <h1>Material-UI Component Demo</h1>
        <FinancialTable data={data} onLabelChange={onLabelChange} />
      </div>
    </ThemeProvider>
  );
}
EOF

# Test unoptimized MUI
cp component-library-evaluation/mui/demo-unoptimized.tsx component-library-evaluation/mui/demo.tsx
mui_unoptimized=$(test_library "mui" "Material-UI (Barrel Imports)" "Barrel import from @mui/material")

# Test optimized MUI  
cp component-library-evaluation/mui/demo-optimized.tsx component-library-evaluation/mui/demo.tsx
mui_optimized=$(test_library "mui" "Material-UI (Individual Imports)" "Individual component imports from @mui/material/*")

# Calculate savings
if [ $mui_unoptimized -gt 0 ] && [ $mui_optimized -gt 0 ]; then
    savings=$((mui_unoptimized - mui_optimized))
    percent_savings=$(( (savings * 100) / mui_unoptimized ))
    echo "" >> $RESULTS_FILE
    echo "### Material-UI Import Optimization Results" >> $RESULTS_FILE
    echo "" >> $RESULTS_FILE
    echo "- **Barrel imports:** ${mui_unoptimized} KB gzipped" >> $RESULTS_FILE
    echo "- **Individual imports:** ${mui_optimized} KB gzipped" >> $RESULTS_FILE
    echo "- **Savings:** ${savings} KB (-${percent_savings}%)" >> $RESULTS_FILE
    echo "" >> $RESULTS_FILE
fi

# Test other libraries  
test_library "headless-ui" "Headless UI" "Tree-shaking friendly (already optimized)"
test_library "tailwind-only" "Tailwind Only" "No external library imports"

# Cleanup
rm -f component-library-evaluation/mui/demo-unoptimized.tsx component-library-evaluation/mui/demo-optimized.tsx

echo ""
echo "📊 Import optimization analysis complete! Results saved to $RESULTS_FILE"
echo ""
if [ $mui_unoptimized -gt 0 ] && [ $mui_optimized -gt 0 ]; then
    echo "Material-UI import optimization savings: ${savings} KB (-${percent_savings}%)"
fi