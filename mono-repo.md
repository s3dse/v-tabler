
# 1. Monorepo Structure
```
v-tabler/
├── packages/
│   └── v-tabler/                    # Main library package
│       ├── src/                     # Library source code
│       │   ├── components/          # Library components
│       │   ├── composables/         # Library composables
│       │   ├── utils/               # Library utilities
│       │   ├── demo/                # Embedded demo app
│       │   │   ├── App.vue          # Demo app main component
│       │   │   ├── main.js          # Demo app entry
│       │   │   ├── index.html       # Demo app HTML
│       │   │   ├── assets/          # Demo assets
│       │   │   └── components/      # Demo-specific components
│       │   ├── index.js             # Library entry point
│       │   └── install.js           # Vue plugin installer
│       ├── package.json             # Library package config
│       ├── vite.config.js           # Library build config (handles demo mode)
│       ├── uno.config.js            # Library UnoCSS config
│       ├── histoire.config.js       # Component stories config
│       ├── histoire.setup.js        # Stories setup
│       ├── vitest.config.js         # Testing config
│       └── README.md                # Library documentation
├── apps/                           # External apps (if needed)
│   └── demo/                        # Legacy demo (can be removed)
├── docs/                           # Documentation (stays at root)
├── package.json                    # Workspace root config
└── README.md                       # Main project README
```

## 2. Build System
Root workspace now provides unified commands:

**Build Commands:**
- `npm run build` - Build everything
- `npm run build:packages` - Build library only

**Development Commands:**
- `npm run dev` - Start embedded demo development (from library)
- `npm run demo:dev` - Start embedded demo development (alias)
- `npm run story:dev` - Start component stories development
- `npm run docs:dev` - Start VitePress documentation development

**Documentation Commands:**
- `npm run docs:dev` - Start documentation development server
- `npm run docs:build` - Build documentation for production
- `npm run docs:preview` - Preview built documentation

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

## 3. Development Workflow

### Hot Reload Development
The embedded demo provides true hot reload for library development:

1. **Start demo development:**
   ```bash
   cd packages/v-tabler
   npm run demo:dev
   ```
   
2. **Make changes to library components:**
   - Edit any file in `src/components/`, `src/composables/`, etc.
   - Changes instantly reflect in the demo at `http://localhost:8080`
   - No build steps or complex alias management needed

3. **Demo-specific changes:**
   - Edit demo components in `src/demo/`
   - Add demo-specific utilities or test data
   - Demo imports library components directly via relative imports

### Benefits of Embedded Demo
- **True hot reload** - Direct file watching without import gymnastics
- **Simplified configuration** - Single vite config handles both library and demo
- **Clean development** - Edit component, see changes immediately
- **No alias conflicts** - Demo uses relative imports to library source
- **Standard pattern** - Used by major Vue libraries like Vuetify, Quasar

### Library Build
The library build excludes demo files automatically:
- Demo files are excluded via `dts` plugin configuration
- Clean production builds with only library code
- Demo and library share the same source tree for development
