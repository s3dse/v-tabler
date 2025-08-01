
# 1. Monorepo Structure
```
v-tabler/
├── packages/
│   └── v-tabler/                    # Main library package
│       ├── src/                     # Library source code
│       ├── package.json             # Library package config
│       ├── vite.config.js           # Library build config
│       ├── uno.config.js            # Library UnoCSS config
│       ├── histoire.config.js       # Component stories config
│       ├── histoire.setup.js        # Stories setup
│       ├── vitest.config.js         # Testing config
│       └── README.md                # Library documentation
├── apps/
│   └── demo/                        # Demo/development app
│       ├── src/                     # Demo app source
│       ├── package.json             # Demo app config
│       ├── vite.config.js           # Demo app build config
│       ├── uno.config.js            # Demo app UnoCSS config
│       └── index.html               # Demo app entry
├── docs/                           # Documentation (stays at root)
├── package.json                    # Workspace root config
└── README.md                       # Main project README
```

## 2. Build System
Root workspace now provides unified commands:

**Build Commands:**
- `npm run build` - Build everything
- `npm run build:packages` - Build library only
- `npm run build:demo` - Build demo app only

**Development Commands:**
- `npm run dev` - Start demo app development
- `npm run dev:demo` - Start demo app development (alias)
- `npm run serve` - Serve demo app
- `npm run story:dev` - Start component stories development

**Testing Commands:**
- `npm run test` - Run library tests
- `npm run test:packages` - Run library tests (alias)
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

**Quality Commands:**
- `npm run lint` - Lint all workspaces
- `npm run format` - Format all workspaces

**Publishing Commands:**
- `npm run publish:library` - Build and publish library
- `npm run publish:dry-run` - Build and test publish
- `npm run version:patch/minor/major` - Version library
