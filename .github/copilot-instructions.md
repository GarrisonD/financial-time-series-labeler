# Financial Time Series Labeler

Financial Time Series Labeler is a React TypeScript web application for visualizing and labeling financial candlestick data. The application allows users to upload CSV files containing financial time series data and displays interactive candlestick charts using uPlot library and Material-UI components.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap and Setup

- Use Node.js LTS (project uses Node 22+ as specified in .nvmrc)
- Install dependencies: `npm ci` -- takes 17 seconds, includes husky git hooks setup. NEVER CANCEL.
- Set timeout to 30+ minutes for initial install commands.

### Build and Compile

- TypeScript compilation: `npm run build:ts` -- takes 3 seconds. NEVER CANCEL. Set timeout to 10+ minutes.
- Production build: `npm run build` -- takes under 1 second. NEVER CANCEL. Set timeout to 10+ minutes.
- Development server: `npm start` -- starts rsbuild dev server on http://localhost:3000/

### Testing and Quality Assurance

- Run tests: `npm test` -- takes under 1 second. Currently no tests exist (Jest setup is configured but no test files present).
- ESLint validation: `npx eslint` -- takes 2 seconds. NEVER CANCEL. Set timeout to 10+ minutes.
- Prettier format check: `npx prettier --check .` -- takes under 1 second.
- IMPORTANT: Always run `rm -rf dist` before ESLint to avoid linting build artifacts.

### Git Hooks and Pre-commit

- Husky is configured with pre-commit hooks that run `npx lint-staged`
- lint-staged runs prettier on `*.{css,json,md,ts,tsx,yml}` files
- Pre-commit hooks are automatically installed during `npm ci`

## Validation

### Manual Application Testing

- ALWAYS test the complete user workflow after making changes:
  1. Start dev server: `npm start`
  2. Navigate to http://localhost:3000/
  3. Upload a CSV file by clicking the drop zone and selecting `data/tiny.csv` or `data/empty.csv`
  4. Verify the candlestick chart displays correctly
  5. Verify chart interactions work (zooming, panning if implemented)

### CSV File Requirements

The application expects CSV files with these columns (order doesn't matter, but rows must be sorted by index):

- `index` (number, starting at 0 and incrementing by 1)
- `timestamp` (string or number, UNIX timestamp or ISO format)
- `open` (number)
- `high` (number)
- `low` (number)
- `close` (number)
- `label` (string, optional)

### CI/CD Validation

- Always run the complete validation workflow before committing:
  ```bash
  npm ci
  npm run build:ts
  npm run build
  npm test
  rm -rf dist && npx eslint
  npx prettier --check .
  ```
- The CI builds are defined in `.github/workflows/`:
  - `build.yml`: Tests build on package-lock.json changes
  - `lint.yml`: Runs ESLint, Prettier, and TypeScript compilation
  - `main.yml`: Runs tests and deploys to GitHub Pages on develop branch

## Codebase Navigation

### Project Structure

```
src/
├── App.tsx                    # Main application component
├── components/               # React components
│   ├── CSVUploader.tsx      # File upload with drag-and-drop
│   ├── CandlesticksChart.tsx # Main chart visualization
│   ├── CandlesticksSettings.tsx # Chart configuration
│   ├── Dropzone.tsx         # File drop zone component
│   └── LabelPicker.tsx      # Data labeling interface
├── contexts/                # React contexts
│   ├── CandlesticksFile.ts  # File data context
│   └── CandlesticksSettings.ts # Chart settings context
├── hooks/                   # Custom React hooks
│   ├── high-level/          # Business logic hooks
│   └── low-level/           # Utility hooks
├── typings/                 # TypeScript type definitions
│   ├── Candlestick.d.ts     # Candlestick data types
│   └── CandlesticksFile.d.ts # File structure types
└── utils/                   # Utility functions
    ├── candlesticks-file/   # File processing utilities
    └── uplot/               # Chart plugin utilities
```

### Key Files to Check When Making Changes

- Always check `src/typings/` after modifying data structures
- Always check `src/contexts/` after changing state management
- Always check `eslint.config.js` for linting rules when adding new imports
- Always check `rsbuild.config.ts` for build configuration changes
- Always check `tsconfig.json` for TypeScript compiler settings

### Development Tools

- Uses rsbuild (Rust-based bundler) instead of Create React App
- Uses TypeScript with strict mode enabled
- Uses ESLint with TypeScript, React, and import ordering rules
- Uses Prettier for code formatting
- Uses Material-UI for component library
- Uses uPlot for high-performance chart rendering
- Uses Papaparse for CSV parsing
- Uses React Dropzone for file uploads

## Common Tasks

### Adding New Components

- Place in `src/components/`
- Follow existing import ordering (React imports first, then Material-UI, then internal)
- Use memo() for performance optimization (see existing components)
- Add proper TypeScript types

### Modifying Chart Functionality

- Chart logic is in `src/components/CandlesticksChart.tsx`
- Chart plugins are in `src/utils/uplot/plugins/`
- Chart settings context in `src/contexts/CandlesticksSettings.ts`

### Adding New Data Processing

- File processing utilities in `src/utils/candlesticks-file/`
- Type definitions in `src/typings/`
- Sample data files in `data/` directory

### Repository Information

```
Repository: GarrisonD/financial-time-series-labeler
Main branch: develop (not main)
Deployment: GitHub Pages from develop branch
Homepage: https://garrisond.github.io/financial-time-series-labeler
```

### Common Command Reference

```bash
# Quick development workflow
npm ci                           # 17 seconds
npm start                        # Start dev server
npm run build                    # Production build
npm run build:ts                 # TypeScript check only

# Quality assurance (run before commits)
rm -rf dist && npx eslint        # 2 seconds
npx prettier --check .           # 1 second

# Development container available
# Uses Node.js 22 with VS Code extensions for React/TypeScript development
```

### Timeout Recommendations

- npm ci: 30+ minutes (usually 17 seconds)
- npm run build: 10+ minutes (usually under 1 second)
- npm run build:ts: 10+ minutes (usually 3 seconds)
- npx eslint: 10+ minutes (usually 2 seconds)
- npm test: 10+ minutes (usually under 1 second)
- npm start: No timeout needed (starts development server)

NEVER CANCEL build or test commands. All operations complete quickly but set generous timeouts to handle system variations.
