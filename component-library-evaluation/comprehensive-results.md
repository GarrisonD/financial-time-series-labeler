# Component Library Bundle Size Analysis

Generated: $(date)

This analysis compares bundle sizes for different React component library approaches suitable for financial time series labeling applications.

**Test Components:**

- Table (for financial data display)
- Button (for actions)
- Modal/Dialog (for confirmations)
- Dropdown/Menu (for label selection)

Fri Sep 19 22:38:39 UTC 2025

## Baseline - Material UI (MUI)

Current implementation using @mui/material with Menu, MenuItem, and CssBaseline components.

**Total: 457 KB raw, 151 KB gzipped**

## Vanilla React (No UI Library)

Pure React implementation with inline styles, no external UI component library dependencies.

**Total: 330 KB raw, 109 KB gzipped**

**Savings vs baseline: 42 KB (-27%)**

## Headless UI

Uses @headlessui/react for unstyled, accessible components with custom styling.

**Total: 422 KB raw, 140 KB gzipped**

**Savings vs baseline: 11 KB (-7%)**

## Summary

| Library     | Bundle Size (Gzipped) | Reduction vs MUI | Notes                      |
| ----------- | --------------------- | ---------------- | -------------------------- |
| Material UI | 151 KB                | Baseline         | Full-featured with theming |
