# Component Library Evaluation

This directory contains minimal demo implementations for different React component libraries to evaluate bundle size impact for financial time series labeling applications.

## Libraries Evaluated

1. **Material UI (MUI)** - current baseline
2. **Radix UI + Tailwind CSS**
3. **shadcn-ui**
4. **Headless UI + Tailwind CSS**
5. **Mantine**
6. **Chakra UI**
7. **DaisyUI**
8. **Custom Tailwind-only components**

## Core Components Tested

Each library implementation includes:

- Table (for financial data display)
- Button (for actions)
- Modal/Dialog (for confirmations)
- Dropdown/Menu (for label selection)

## Methodology

1. Create minimal implementations using core components
2. Build production bundles using rsbuild
3. Measure gzipped bundle sizes
4. Compare features, accessibility, and styling flexibility
5. Provide recommendation based on bundle size vs feature trade-offs
