# Graph Report - rad-filemanager  (2026-11-22)

## Corpus Check
- 59 files · ~136,965 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 51 file(s) not represented in the graph (top: .scss 18, (none) 6, .eot 6)

## Summary
- 627 nodes · 1238 edges · 33 communities (25 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e7b351b1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ref_react
- package.json
- devDependencies
- hooks.ts
- MenuTools/index.tsx
- utils/index.tsx
- example/package.json
- PreviewModal/index.tsx
- api.ts
- compilerOptions
- fileDragAndDrop .tsx
- compilerOptions
- devDependencies
- dependencies
- dependencies
- scripts
- webpack.config.js
- manifest.json
- example/webpack.config.js
- scripts
- rad-filemanager
- typings.d.ts
- peerDependencies
- tsconfig.test.json
- browserslist
- eslintConfig
- engines
- rollup-plugin-img

## God Nodes (most connected - your core abstractions)
1. `getBs()` - 33 edges
2. `MenuTools` - 25 edges
3. `Context` - 24 edges
4. `httpRequest()` - 24 edges
5. `compilerOptions` - 20 edges
6. `compilerOptions` - 18 edges
7. `IconBuilder()` - 17 edges
8. `@fortawesome/react-fontawesome` - 16 edges
9. `OperationTypes` - 16 edges
10. `reactstrap` - 15 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `getBs()`  [EXTRACTED]
  src/App.tsx → src/utils/index.tsx
- `Upload()` --calls--> `CheckPermissions()`  [EXTRACTED]
  src/components/upload/index.tsx → src/components/CheckPermissions/index.tsx
- `MenuTools` --calls--> `CheckPermissions()`  [EXTRACTED]
  src/utils/MenuTools/index.tsx → src/components/CheckPermissions/index.tsx
- `App` --calls--> `CheckPermissions()`  [EXTRACTED]
  src/utils/rightClick/index.tsx → src/components/CheckPermissions/index.tsx
- `Index()` --calls--> `Tab()`  [EXTRACTED]
  src/components/FileManager/index.tsx → src/components/Tab/index.tsx

## Import Cycles
- 2-file cycle: `src/utils/index.tsx -> src/utils/loading/index.tsx -> src/utils/index.tsx`

## Communities (33 total, 8 thin omitted)

### Community 0 - "ref_react"
Cohesion: 0.08
Nodes (55): classnames, @fortawesome/free-solid-svg-icons, @fortawesome/react-fontawesome, react-intersection-observer, reactstrap, ArchiveTab(), IProps, index() (+47 more)

### Community 1 - "package.json"
Cohesion: 0.03
Nodes (64): author, description, css-loader, file-loader, react, react-dom, sass, sass-loader (+56 more)

### Community 2 - "devDependencies"
Cohesion: 0.03
Nodes (62): devDependencies, babel-eslint, babel-loader, @babel/plugin-transform-typescript, @babel/preset-env, @babel/preset-react, @babel/preset-typescript, bootstrap (+54 more)

### Community 3 - "hooks.ts"
Cohesion: 0.07
Nodes (43): copy-to-clipboard, @fortawesome/free-regular-svg-icons, moment-jalaali, react-persian-datepicker-rad, react-toastify, IProps, ShareFile(), styleCalendar (+35 more)

### Community 4 - "MenuTools/index.tsx"
Cohesion: 0.09
Nodes (19): file-saver, FullPageLoader(), download(), useArchiveDelete(), useArchiveRestor(), IconBuilder(), IconCircleInfo(), IconCopy() (+11 more)

### Community 5 - "utils/index.tsx"
Cohesion: 0.08
Nodes (27): App(), axios, bootstrap, react-query, App(), Index(), directMain, directSandbox (+19 more)

### Community 6 - "example/package.json"
Cohesion: 0.06
Nodes (31): homepage, css-loader, file-loader, react, react-dom, sass, sass-loader, style-loader (+23 more)

### Community 7 - "PreviewModal/index.tsx"
Cohesion: 0.07
Nodes (28): yet-another-react-lightbox, FileItem, IProps, PreviewModal(), SidebarItem(), SidebarItemProps, useGetFileDetails(), AudioTypes (+20 more)

### Community 8 - "api.ts"
Cohesion: 0.13
Nodes (23): addPublic(), addShare(), archiveDelete(), archiveRestore(), copy(), copyMulti(), createNewFolder(), cut() (+15 more)

### Community 9 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, esModuleInterop, ignoreDeprecations, jsx, lib (+15 more)

### Community 10 - "fileDragAndDrop .tsx"
Cohesion: 0.15
Nodes (17): react-circular-progressbar, Checkbox(), fileListInterface, FilesDragAndDrop(), ProgressItemType, Props, Radio(), Upload() (+9 more)

### Community 11 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, allowSyntheticDefaultImports, declaration, esModuleInterop, jsx, lib, module, moduleResolution (+12 more)

### Community 12 - "devDependencies"
Cohesion: 0.11
Nodes (19): devDependencies, @babel/plugin-syntax-object-rest-spread, css-loader, file-loader, path, sass, sass-loader, style-loader (+11 more)

### Community 13 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, axios, classnames, copy-to-clipboard, file-saver, @fortawesome/fontawesome-svg-core, @fortawesome/free-regular-svg-icons, @fortawesome/free-solid-svg-icons (+9 more)

### Community 14 - "dependencies"
Cohesion: 0.20
Nodes (10): dependencies, rad-filemanager, react, react-dom, @testing-library/jest-dom, @testing-library/react, @testing-library/user-event, @types/react (+2 more)

### Community 15 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, deploy, predeploy, prepare, serve, start, test (+2 more)

### Community 16 - "webpack.config.js"
Cohesion: 0.20
Nodes (8): html-webpack-plugin, mini-css-extract-plugin, webpack-bundle-analyzer, HtmlWebPackPlugin, MiniCssExtractPlugin, path, TerserPlugin, webpack

### Community 17 - "manifest.json"
Cohesion: 0.25
Nodes (7): background_color, display, icons, name, short_name, start_url, theme_color

### Community 18 - "example/webpack.config.js"
Cohesion: 0.29
Nodes (5): path, TerserPlugin, path, path, TerserPlugin

### Community 19 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build-old, eject, serve, start, start-old, test

### Community 20 - "rad-filemanager"
Cohesion: 0.29
Nodes (6): Development, Install, License, Props, rad-filemanager, Usage

### Community 21 - "typings.d.ts"
Cohesion: 0.33
Nodes (5): *.css, *.png, *.scss, *.svg, SvgrComponent

### Community 22 - "peerDependencies"
Cohesion: 0.40
Nodes (5): peerDependencies, bootstrap, react, react-dom, reactstrap

### Community 23 - "tsconfig.test.json"
Cohesion: 0.40
Nodes (4): ./tsconfig.json, compilerOptions, module, extends

### Community 24 - "browserslist"
Cohesion: 0.67
Nodes (3): browserslist, development, production

## Knowledge Gaps
- **120 isolated node(s):** `@testing-library/jest-dom`, `@testing-library/react`, `@testing-library/user-event`, `@types/react`, `@types/react-dom` (+115 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 396 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `path` connect `example/webpack.config.js` to `webpack.config.js`, `example/package.json`?**
  _High betweenness centrality (0.184) - this node is a cross-community bridge._
- **What connects `@testing-library/jest-dom`, `@testing-library/react`, `@testing-library/user-event` to the rest of the system?**
  _120 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ref_react` be split into smaller, more focused modules?**
  _Cohesion score 0.07885592087677092 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.161) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.03076923076923077 - nodes in this community are weakly interconnected._
- **Why does `html-webpack-plugin` connect `webpack.config.js` to `package.json`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.03225806451612903 - nodes in this community are weakly interconnected._