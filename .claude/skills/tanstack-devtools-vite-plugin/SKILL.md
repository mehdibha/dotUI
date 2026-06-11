---
name: devtools-vite-plugin
description: >
  Configure @tanstack/devtools-vite for source inspection (data-tsd-source,
  inspectHotkey, ignore patterns), console piping (client-to-server,
  server-to-client, levels), enhanced logging, server event bus (port, host,
  HTTPS), production stripping (removeDevtoolsOnBuild), editor integration
  (launch-editor, custom editor.open). Must be FIRST plugin in Vite config.
  Vite ^6 || ^7 only.
type: core
library: tanstack-devtools
library_version: '0.10.12'
sources:
  - 'TanStack/devtools:docs/vite-plugin.md'
  - 'TanStack/devtools:docs/source-inspector.md'
  - 'TanStack/devtools:packages/devtools-vite/src/plugin.ts'
---

Configure @tanstack/devtools-vite -- the Vite plugin that enhances TanStack Devtools with source inspection, console piping, enhanced logging, a server event bus, production stripping, editor integration, and a plugin marketplace. The plugin returns an array of sub-plugins, all using `enforce: 'pre'`, so it must be the FIRST plugin in the Vite config.

## Installation and Basic Setup

```ts
// vite.config.ts
import { devtools } from '@tanstack/devtools-vite'

export default {
  plugins: [
    devtools(),
    // ... other plugins AFTER devtools
  ],
}
```

Install as a dev dependency:

```sh
pnpm add -D @tanstack/devtools-vite
```

There is also a `defineDevtoolsConfig` helper for type-safe config objects:

```ts
import { devtools, defineDevtoolsConfig } from '@tanstack/devtools-vite'

const config = defineDevtoolsConfig({
  // fully typed options
})

export default {
  plugins: [devtools(config)],
}
```

## Exports

From `packages/devtools-vite/src/index.ts`:

- `devtools` -- main plugin factory, returns `Array<Plugin>`
- `defineDevtoolsConfig` -- identity function for type-safe config
- `TanStackDevtoolsViteConfig` -- config type (re-exported)
- `ConsoleLevel` -- `'log' | 'warn' | 'error' | 'info' | 'debug'`

## Architecture: Sub-Plugins

`devtools()` returns an array of Vite plugins. Each has `enforce: 'pre'` and only activates when its conditions are met (dev mode, serve command, etc.).

| Sub-plugin name                               | What it does                                                                                                       | When active                                                |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| `@tanstack/devtools:inject-source`            | Babel transform adding `data-tsd-source` attrs to JSX                                                              | dev mode + `injectSource.enabled`                          |
| `@tanstack/devtools:config`                   | Reserved for future config modifications                                                                           | serve command only                                         |
| `@tanstack/devtools:custom-server`            | Starts ServerEventBus, registers middleware for open-source/console-pipe endpoints                                 | dev mode                                                   |
| `@tanstack/devtools:remove-devtools-on-build` | Strips devtools imports/JSX from production bundles                                                                | build command or production mode + `removeDevtoolsOnBuild` |
| `@tanstack/devtools:event-client-setup`       | Marketplace: listens for install/add-plugin events via devtoolsEventClient                                         | dev mode + serve + not CI                                  |
| `@tanstack/devtools:console-pipe-transform`   | Injects runtime console-pipe code into entry files                                                                 | dev mode + serve + `consolePiping.enabled`                 |
| `@tanstack/devtools:better-console-logs`      | Babel transform prepending source location to `console.log`/`console.error`                                        | dev mode + `enhancedLogs.enabled`                          |
| `@tanstack/devtools:inject-plugin`            | Detects which file imports TanStackDevtools (for marketplace injection)                                            | dev mode + serve                                           |
| `@tanstack/devtools:connection-injection`     | Replaces `__TANSTACK_DEVTOOLS_PORT__`, `__TANSTACK_DEVTOOLS_HOST__`, `__TANSTACK_DEVTOOLS_PROTOCOL__` placeholders | dev mode + serve                                           |

## Subsystem Details

### Source Injection

Adds `data-tsd-source="<relative-path>:<line>:<column>"` attributes to every JSX opening element via Babel. This powers the "Go to Source" feature -- hold the inspect hotkey (default: Shift+Alt+Ctrl/Meta), hover over elements, click to open in editor.

**Key behaviors:**

- Skips `<Fragment>` and `<React.Fragment>`
- Skips elements where the component's props parameter is spread (`{...props}`) -- this is because injecting the attribute would be overwritten by the spread
- Skips files matching `injectSource.ignore.files` patterns
- Skips components matching `injectSource.ignore.components` patterns
- Patterns can be strings (matched via picomatch) or RegExp
- Transform filter excludes `node_modules`, `?raw` imports, `/dist/`, `/build/`

**Source files:** `packages/devtools-vite/src/inject-source.ts`, `packages/devtools-vite/src/matcher.ts`

```ts
devtools({
  injectSource: {
    enabled: true,
    ignore: {
      files: ['node_modules', /.*\.test\.(js|ts|jsx|tsx)$/],
      components: ['InternalComponent', /.*Provider$/],
    },
  },
})
```

### Console Piping

Bidirectional console piping between client and server. Injects runtime code (IIFE) into entry files that:

**Client side:**

1. Wraps `console[level]` to batch and POST entries to `/__tsd/console-pipe`
2. Opens an EventSource on `/__tsd/console-pipe/sse` to receive server logs
3. Server logs appear in browser console with a purple `[Server]` prefix
4. Client logs appear in terminal with a cyan `[Client]` prefix

**Server side (SSR/Nitro):**

1. Wraps `console[level]` to batch and POST entries to `<viteServerUrl>/__tsd/console-pipe/server`
2. These are then broadcast to all SSE clients

**Entry file detection:** looks for `<html` tag, `StartClient`, `hydrateRoot`, `createRoot`, or `solid-js/web` + `render(` in code.

**Source files:** `packages/devtools-vite/src/virtual-console.ts`, `packages/devtools-vite/src/utils.ts` (middleware handlers)

```ts
devtools({
  consolePiping: {
    enabled: true,
    levels: ['log', 'warn', 'error', 'info', 'debug'],
  },
})
```

### Enhanced Logging

Babel transform that prepends source location info to `console.log()` and `console.error()` calls. In the browser, this renders as a clickable "Go to Source" link. On the server, it shows `LOG <path>:<line>:<column>` in chalk colors.

The transform inserts a spread of a conditional expression: `...(typeof window === 'undefined' ? serverLogMessage : browserLogMessage)` as the first argument of the console call.

**Source file:** `packages/devtools-vite/src/enhance-logs.ts`

```ts
devtools({
  enhancedLogs: {
    enabled: true, // default
  },
})
```

### Production Stripping

Removes all devtools code from production builds. The transform:

1. Finds files importing from these packages: `@tanstack/react-devtools`, `@tanstack/preact-devtools`, `@tanstack/solid-devtools`, `@tanstack/vue-devtools`, `@tanstack/devtools`
2. Removes the import declarations
3. Removes the JSX elements that use the imported components
4. Cleans up leftover imports that were only used inside the removed JSX (e.g., plugin panel components)

Active when: `command !== 'serve'` OR `config.mode === 'production'` (handles hosting providers like Cloudflare/Netlify that may not use `build` command but set mode to production).

**Source file:** `packages/devtools-vite/src/remove-devtools.ts`

```ts
devtools({
  removeDevtoolsOnBuild: true, // default
})
```

### Server Event Bus

A WebSocket + SSE server for devtools-to-client communication. Managed by `@tanstack/devtools-event-bus/server`.

**Key behaviors:**

- Default port: 4206
- On EADDRINUSE: falls back to OS-assigned port (port 0)
- When Vite uses HTTPS: piggybacks on Vite's httpServer instead of creating a standalone one (shares TLS certificate)
- Uses global variables (`__TANSTACK_DEVTOOLS_SERVER__`, etc.) to survive HMR without restarting
- The actual port is injected into client code via `__TANSTACK_DEVTOOLS_PORT__` placeholder replacement

**Source file:** `packages/event-bus/src/server/server.ts`

```ts
devtools({
  eventBusConfig: {
    port: 4206, // default
    enabled: true, // default; set false for storybook/vitest
    debug: false, // default; logs internal bus activity
  },
})
```

### Editor Integration

Uses `launch-editor` to open source files in the editor. Default editor is VS Code. The `editor.open` callback receives `(path, lineNumber, columnNumber)` as strings.

The open-source flow: browser requests `/__tsd/open-source?source=<encoded-path:line:col>` --> Vite middleware parses source param --> calls `editor.open`.

Supported editors via launch-editor: VS Code, WebStorm, Sublime Text, Atom, and more. For unsupported editors, provide a custom `editor.open` function.

**Source file:** `packages/devtools-vite/src/editor.ts`

```ts
devtools({
  editor: {
    name: 'Cursor',
    open: async (path, lineNumber, columnNumber) => {
      // Custom editor open logic
      // path is the absolute file path
      // lineNumber and columnNumber are strings or undefined
    },
  },
})
```

### Plugin Marketplace

When the dev server is running, listens for events via `devtoolsEventClient`:

- `install-devtools` -- runs package manager install, then auto-injects plugin into devtools setup file
- `add-plugin-to-devtools` -- injects plugin import and JSX/function call into the file containing `<TanStackDevtools>`
- `bump-package-version` -- updates a package to a minimum version
- `mounted` -- sends package.json and outdated deps to the UI

Auto-detection of the devtools setup file: the `inject-plugin` sub-plugin scans transforms for files importing from `@tanstack/react-devtools`, `@tanstack/solid-devtools`, `@tanstack/vue-devtools`, etc., and stores the file ID.

**Source files:** `packages/devtools-vite/src/inject-plugin.ts`, `packages/devtools-vite/src/package-manager.ts`

## Common Mistakes

### 1. Not placing devtools() first in Vite plugins (HIGH)

All sub-plugins use `enforce: 'pre'`. They must transform code before framework plugins (React, Vue, Solid, etc.) process it. If devtools is not first, source injection and enhanced logs may silently fail because framework transforms remove the raw JSX before devtools can annotate it.

```ts
// WRONG
export default {
  plugins: [
    react(),
    devtools(), // too late -- react() already transformed JSX
  ],
}

// CORRECT
export default {
  plugins: [devtools(), react()],
}
```

### 2. Using devtools-vite with non-Vite bundlers (HIGH)

`@tanstack/devtools-vite` has a peer dependency on `vite ^6.0.0 || ^7.0.0`. It uses Vite-specific APIs (`configureServer`, `handleHotUpdate`, `transform` with filter objects, `Plugin` type). It will not work with webpack, rspack, esbuild, or other bundlers. For non-Vite setups, use `@tanstack/devtools-event-bus` client directly without the Vite plugin.

### 3. Expecting Vite plugin features in production (MEDIUM)

Source injection, console piping, enhanced logging, the server event bus, and the marketplace only operate during development (`config.mode === 'development'` and `command === 'serve'`). In production builds, the only active sub-plugin is `remove-devtools-on-build` (which strips devtools code). Do not rely on any of these features being available at runtime in production.

### 4. Source injection on spread-props elements (MEDIUM)

The Babel transform in `inject-source.ts` explicitly skips any JSX element that has a `{...props}` spread where `props` is the component's parameter name. This is intentional -- the spread would overwrite the injected `data-tsd-source` attribute. If source inspection doesn't work for a specific component, check if it spreads its props parameter.

```tsx
// data-tsd-source will NOT be injected on <div> here
const MyComponent = (props) => {
  return <div {...props}>content</div>
}
```

### 5. Event bus port conflict in multi-project setups (MEDIUM)

The default event bus port is 4206. When running multiple Vite dev servers concurrently (monorepo), the second server will hit EADDRINUSE. The event bus handles this by falling back to an OS-assigned port (port 0), and the actual port is injected via placeholder replacement. However, if you need predictable ports (e.g., for firewall rules), set different ports explicitly:

```ts
// Project A
devtools({ eventBusConfig: { port: 4206 } })

// Project B
devtools({ eventBusConfig: { port: 4207 } })
```

## Internal Middleware Endpoints

These are registered on the Vite dev server (not the event bus server):

| Endpoint                                    | Method | Purpose                                                   |
| ------------------------------------------- | ------ | --------------------------------------------------------- |
| `/__tsd/open-source?source=<path:line:col>` | GET    | Opens file in editor, returns HTML that closes the window |
| `/__tsd/console-pipe`                       | POST   | Receives client console entries (batched JSON)            |
| `/__tsd/console-pipe/server`                | POST   | Receives server-side console entries                      |
| `/__tsd/console-pipe/sse`                   | GET    | SSE stream for broadcasting server logs to browser        |

## Cross-References

- **devtools-app-setup** -- How to set up `<TanStackDevtools>` in your app (must be done before the Vite plugin provides value)
- **devtools-production** -- Details on production stripping configuration and keeping devtools in production builds

## Key Source Files

- `packages/devtools-vite/src/plugin.ts` -- Main plugin factory with all sub-plugins and config type
- `packages/devtools-vite/src/inject-source.ts` -- Babel transform for data-tsd-source injection
- `packages/devtools-vite/src/enhance-logs.ts` -- Babel transform for enhanced console logs
- `packages/devtools-vite/src/remove-devtools.ts` -- Production stripping transform
- `packages/devtools-vite/src/virtual-console.ts` -- Console pipe runtime code generator
- `packages/devtools-vite/src/editor.ts` -- Editor config type and launch-editor integration
- `packages/devtools-vite/src/inject-plugin.ts` -- Marketplace plugin injection into devtools setup file
- `packages/devtools-vite/src/utils.ts` -- Middleware request handling and helpers
- `packages/devtools-vite/src/matcher.ts` -- Picomatch/RegExp pattern matcher
- `packages/event-bus/src/server/server.ts` -- ServerEventBus implementation (WebSocket + SSE + EADDRINUSE fallback)
