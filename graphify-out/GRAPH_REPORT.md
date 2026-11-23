# Graph Report - rad-filemanager  (2026-11-23)

## Corpus Check
- 64 files · ~137,440 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 51 file(s) not represented in the graph (top: .scss 18, (none) 6, .eot 6)

## Summary
- 656 nodes · 1267 edges · 37 communities (25 shown, 12 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bf1ab316`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- utils/index.tsx
- devDependencies
- MenuTools/index.tsx
- package.json
- hooks.ts
- PreviewModal/index.tsx
- example/package.json
- src/index.tsx
- api.ts
- compilerOptions
- compilerOptions
- devDependencies
- webpack.config.js
- dependencies
- scripts
- fileDragAndDrop .tsx
- compilerOptions
- dependencies
- manifest.json
- scripts
- typings.d.ts
- peerDependencies
- browserslist
- engines
- rollup-plugin-img
- example/webpack.config.js
- rad-filemanager
- eslintConfig

## God Nodes (most connected - your core abstractions)
1. `getBs()` - 33 edges
2. `MenuTools` - 25 edges
3. `Context` - 24 edges
4. `httpRequest()` - 24 edges
5. `compilerOptions` - 20 edges
6. `compilerOptions` - 18 edges
7. `IconBuilder()` - 17 edges
8. `@fortawesome/react-fontawesome` - 16 edges
9. `CheckPermissions()` - 16 edges
10. `OperationTypes` - 16 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `getBs()`  [EXTRACTED]
  src/App.tsx → src/utils/index.tsx
- `PreviewModal()` --calls--> `CheckPermissions()`  [EXTRACTED]
  src/components/PreviewModal/index.tsx → src/components/CheckPermissions/index.tsx
- `MenuTools` --calls--> `CheckPermissions()`  [EXTRACTED]
  src/utils/MenuTools/index.tsx → src/components/CheckPermissions/index.tsx
- `App` --calls--> `CheckPermissions()`  [EXTRACTED]
  src/utils/rightClick/index.tsx → src/components/CheckPermissions/index.tsx
- `Index()` --calls--> `Tab()`  [EXTRACTED]
  src/components/FileManager/index.tsx → src/components/Tab/index.tsx

## Import Cycles
- 2-file cycle: `src/utils/index.tsx -> src/utils/loading/index.tsx -> src/utils/index.tsx`

## Communities (37 total, 12 thin omitted)

### Community 0 - "utils/index.tsx"
Cohesion: 0.07
Nodes (61): bootstrap, classnames, @fortawesome/free-solid-svg-icons, @fortawesome/react-fontawesome, moment-jalaali, react-intersection-observer, reactstrap, ArchiveTab() (+53 more)

### Community 1 - "devDependencies"
Cohesion: 0.03
Nodes (66): devDependencies, babel-eslint, babel-loader, @babel/plugin-transform-typescript, @babel/preset-env, @babel/preset-react, @babel/preset-typescript, bootstrap (+58 more)

### Community 2 - "MenuTools/index.tsx"
Cohesion: 0.06
Nodes (32): file-saver, FullPageLoader(), download(), useArchiveDelete(), useArchiveRestor(), FolderTypes, folder, OperationTypes (+24 more)

### Community 3 - "package.json"
Cohesion: 0.03
Nodes (67): author, description, css-loader, file-loader, react, react-dom, sass, sass-loader (+59 more)

### Community 4 - "hooks.ts"
Cohesion: 0.10
Nodes (29): copy-to-clipboard, @fortawesome/free-regular-svg-icons, react-persian-datepicker-rad, IProps, ShareFile(), styleCalendar, IPprops, ListItem() (+21 more)

### Community 5 - "PreviewModal/index.tsx"
Cohesion: 0.06
Nodes (36): @fortawesome/fontawesome-svg-core, yet-another-react-lightbox, changeLogLabels, ChangeLogProps, EventTypeProps, FileItem, getChangeLogAction(), IProps (+28 more)

### Community 6 - "example/package.json"
Cohesion: 0.06
Nodes (31): homepage, css-loader, file-loader, react, react-dom, sass, sass-loader, style-loader (+23 more)

### Community 7 - "src/index.tsx"
Cohesion: 0.09
Nodes (22): App(), axios, react-query, react-toastify, App(), Index(), directMain, directSandbox (+14 more)

### Community 8 - "api.ts"
Cohesion: 0.13
Nodes (23): addPublic(), addShare(), archiveDelete(), archiveRestore(), copy(), copyMulti(), createNewFolder(), cut() (+15 more)

### Community 9 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, esModuleInterop, ignoreDeprecations, jsx, lib (+15 more)

### Community 10 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, allowSyntheticDefaultImports, declaration, esModuleInterop, jsx, lib, module, moduleResolution (+12 more)

### Community 11 - "devDependencies"
Cohesion: 0.11
Nodes (19): devDependencies, @babel/plugin-syntax-object-rest-spread, css-loader, file-loader, path, sass, sass-loader, style-loader (+11 more)

### Community 12 - "webpack.config.js"
Cohesion: 0.20
Nodes (8): html-webpack-plugin, mini-css-extract-plugin, webpack-bundle-analyzer, HtmlWebPackPlugin, MiniCssExtractPlugin, path, TerserPlugin, webpack

### Community 13 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, axios, classnames, copy-to-clipboard, file-saver, @fortawesome/fontawesome-svg-core, @fortawesome/free-regular-svg-icons, @fortawesome/free-solid-svg-icons (+9 more)

### Community 14 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, deploy, predeploy, prepare, serve, start, test (+6 more)

### Community 15 - "fileDragAndDrop .tsx"
Cohesion: 0.18
Nodes (15): react-circular-progressbar, Checkbox(), fileListInterface, FilesDragAndDrop(), ProgressItemType, Props, Radio(), audioQualities (+7 more)

### Community 16 - "compilerOptions"
Cohesion: 0.18
Nodes (10): ./tsconfig.json, compilerOptions, declaration, esModuleInterop, jsx, module, skipLibCheck, sourceMap (+2 more)

### Community 17 - "dependencies"
Cohesion: 0.20
Nodes (10): dependencies, rad-filemanager, react, react-dom, @testing-library/jest-dom, @testing-library/react, @testing-library/user-event, @types/react (+2 more)

### Community 18 - "manifest.json"
Cohesion: 0.25
Nodes (7): background_color, display, icons, name, short_name, start_url, theme_color

### Community 19 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build-old, eject, serve, start, start-old, test

### Community 20 - "typings.d.ts"
Cohesion: 0.33
Nodes (5): *.css, *.png, *.scss, *.svg, SvgrComponent

### Community 21 - "peerDependencies"
Cohesion: 0.40
Nodes (5): peerDependencies, bootstrap, react, react-dom, reactstrap

### Community 22 - "browserslist"
Cohesion: 0.67
Nodes (3): browserslist, development, production

### Community 33 - "example/webpack.config.js"
Cohesion: 0.29
Nodes (5): path, TerserPlugin, path, path, TerserPlugin

### Community 34 - "rad-filemanager"
Cohesion: 0.29
Nodes (6): Development, Install, License, Props, rad-filemanager, Usage

## Knowledge Gaps
- **124 isolated node(s):** `@testing-library/jest-dom`, `@testing-library/react`, `@testing-library/user-event`, `@types/react`, `@types/react-dom` (+119 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 423 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `path` connect `example/webpack.config.js` to `webpack.config.js`, `example/package.json`?**
  _High betweenness centrality (0.175) - this node is a cross-community bridge._
- **What connects `@testing-library/jest-dom`, `@testing-library/react`, `@testing-library/user-event` to the rest of the system?**
  _124 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `utils/index.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0731650303880318 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.161) - this node is a cross-community bridge._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.030303030303030304 - nodes in this community are weakly interconnected._
- **Why does `html-webpack-plugin` connect `webpack.config.js` to `package.json`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Should `MenuTools/index.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05858585858585859 - nodes in this community are weakly interconnected._