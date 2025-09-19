#!/usr/bin/env node

/**
 * Bundle analyzer script for component library evaluation
 * Measures and compares bundle sizes across different implementations
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { gzipSync } from 'zlib';

const DEMO_IMPLEMENTATIONS = [
  'mui',
  'radix-tailwind', 
  'shadcn-ui',
  'headless-ui',
  'mantine',
  'chakra-ui',
  'daisyui',
  'tailwind-only'
];

function getFileSize(filePath) {
  try {
    const content = readFileSync(filePath);
    const gzipped = gzipSync(content);
    return {
      raw: content.length,
      gzipped: gzipped.length
    };
  } catch (error) {
    return { raw: 0, gzipped: 0 };
  }
}

function buildAndAnalyze(implementation) {
  console.log(`\nBuilding ${implementation}...`);
  
  try {
    // Build the specific implementation
    execSync(`npm run build:${implementation}`, { stdio: 'inherit' });
    
    // Analyze bundle sizes
    const distPath = `dist/${implementation}`;
    const jsFiles = execSync(`find ${distPath}/static/js -name "*.js"`)
      .toString()
      .split('\n')
      .filter(Boolean);
    
    let totalRaw = 0;
    let totalGzipped = 0;
    
    const fileDetails = jsFiles.map(filePath => {
      const size = getFileSize(filePath);
      totalRaw += size.raw;
      totalGzipped += size.gzipped;
      
      return {
        file: filePath.split('/').pop(),
        raw: size.raw,
        gzipped: size.gzipped
      };
    });
    
    return {
      implementation,
      totalRaw,
      totalGzipped,
      files: fileDetails
    };
  } catch (error) {
    console.error(`Failed to build ${implementation}:`, error.message);
    return null;
  }
}

function generateReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    baseline: results.find(r => r.implementation === 'mui'),
    results: results.sort((a, b) => a.totalGzipped - b.totalGzipped)
  };
  
  // Generate markdown report
  let markdown = '# Bundle Size Analysis Report\n\n';
  markdown += `Generated: ${report.timestamp}\n\n`;
  markdown += '## Summary\n\n';
  markdown += '| Library | Total (Raw) | Total (Gzipped) | vs MUI | Reduction |\n';
  markdown += '|---------|-------------|-----------------|--------|----------|\n';
  
  const baseline = report.baseline?.totalGzipped || 0;
  
  results.forEach(result => {
    const reduction = baseline > 0 ? ((baseline - result.totalGzipped) / baseline * 100).toFixed(1) : '0';
    const vs = baseline > 0 ? `${(result.totalGzipped / baseline * 100).toFixed(0)}%` : 'N/A';
    
    markdown += `| ${result.implementation} | ${(result.totalRaw / 1024).toFixed(1)} KB | ${(result.totalGzipped / 1024).toFixed(1)} KB | ${vs} | ${reduction}% |\n`;
  });
  
  markdown += '\n## Detailed Breakdown\n\n';
  results.forEach(result => {
    markdown += `### ${result.implementation}\n\n`;
    markdown += '| File | Raw Size | Gzipped |\n';
    markdown += '|------|----------|--------|\n';
    result.files.forEach(file => {
      markdown += `| ${file.file} | ${(file.raw / 1024).toFixed(1)} KB | ${(file.gzipped / 1024).toFixed(1)} KB |\n`;
    });
    markdown += '\n';
  });
  
  writeFileSync('component-library-evaluation/bundle-analysis.md', markdown);
  writeFileSync('component-library-evaluation/bundle-analysis.json', JSON.stringify(report, null, 2));
  
  console.log('\n📊 Analysis complete! Reports saved to:');
  console.log('- component-library-evaluation/bundle-analysis.md');
  console.log('- component-library-evaluation/bundle-analysis.json');
}

// Main execution
async function main() {
  console.log('🚀 Starting bundle size analysis...');
  
  const results = [];
  
  for (const implementation of DEMO_IMPLEMENTATIONS) {
    const result = buildAndAnalyze(implementation);
    if (result) {
      results.push(result);
    }
  }
  
  if (results.length > 0) {
    generateReport(results);
  } else {
    console.error('❌ No successful builds to analyze');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}