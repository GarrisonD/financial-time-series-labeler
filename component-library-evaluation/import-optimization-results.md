# Import Optimization Impact Analysis

This analysis directly measures the bundle size impact of different import patterns for component libraries.

Generated: Fri Sep 19 22:55:51 UTC 2025

## Material-UI (Barrel Imports)

Import Pattern: Barrel import from @mui/material

**Total: 353 KB raw, 112 KB gzipped**

## Material-UI (Individual Imports)

Import Pattern: Individual component imports from @mui/material/\*

**Total: 353 KB raw, 112 KB gzipped**

## Headless UI

Import Pattern: Tree-shaking friendly (already optimized)

**Total: 294 KB raw, 95 KB gzipped**

## Tailwind Only

Import Pattern: No external library imports

**Total: 185 KB raw, 58 KB gzipped**
