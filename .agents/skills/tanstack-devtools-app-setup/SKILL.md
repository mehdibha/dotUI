---
name: devtools-app-setup
description: >
  Install TanStack Devtools, pick framework adapter (React/Vue/Solid/Preact),
  register plugins via plugins prop, configure shell (position, hotkeys, theme,
  hideUntilHover, requireUrlFlag, eventBusConfig). TanStackDevtools component,
  defaultOpen, localStorage persistence.
type: core
library: '@tanstack/devtools'
library_version: '0.10.12'
sources:
  - docs/quick-start.md
  - docs/installation.md
  - docs/configuration.md
  - docs/overview.md
  - packages/devtools/src/context/devtools-store.ts
  - packages/vue-devtools/src/types.ts
  - packages/react-devtools/src/devtools.tsx
---

# TanStack Devtools App Setup

## Setup

### React (primary)

Install as dev dependencies:

```bash
npm install -D @tanstack/react-devtools @tanstack/devtools-vite
```

Mount `TanStackDevtools` at the root of your application:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TanStackDevtools } from '@tanstack/react-devtools'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <TanStackDevtools />
  </StrictMode>,
)
```

Add plugins via the `plugins` prop. Each plugin needs `name` (string) and `render` (JSX element or render function):

```tsx
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
;<TanStackDevtools
  plugins={[
    {
      name: 'TanStack Query',
      render: <ReactQueryDevtoolsPanel />,
    },
    {
      name: 'TanStack Router',
      render: <TanStackRouterDevtoolsPanel />,
    },
  ]}
/>
```

### Vue

```bash
npm install -D @tanstack/vue-devtools
```

Vue uses `component` (not `render`) in plugin definitions. This is the `TanStackDevtoolsVuePlugin` type:

```vue
<script setup lang="ts">
import { TanStackDevtools } from '@tanstack/vue-devtools'
import type { TanStackDevtoolsVuePlugin } from '@tanstack/vue-devtools'
import { VueQueryDevtoolsPanel } from '@tanstack/vue-query-devtools'

const plugins: TanStackDevtoolsVuePlugin[] = [
  { name: 'Vue Query', component: VueQueryDevtoolsPanel },
]
</script>

<template>
  <App />
  <TanStackDevtools :plugins="plugins" />
</template>
```

The Vite plugin (`@tanstack/devtools-vite`) is optional for Vue but recommended for enhanced console logs and go-to-source.

### Solid

```bash
npm install -D @tanstack/solid-devtools @tanstack/devtools-vite
```

```tsx
import { render } from 'solid-js/web'
import { TanStackDevtools } from '@tanstack/solid-devtools'
import { SolidQueryDevtoolsPanel } from '@tanstack/solid-query-devtools'
import App from './App'

render(
  () => (
    <>
      <App />
      <TanStackDevtools
        plugins={[
          {
            name: 'TanStack Query',
            render: <SolidQueryDevtoolsPanel />,
          },
        ]}
      />
    </>
  ),
  document.getElementById('root')!,
)
```

### Preact

```bash
npm install -D @tanstack/preact-devtools @tanstack/devtools-vite
```

```tsx
import { render } from 'preact'
import { TanStackDevtools } from '@tanstack/preact-devtools'
import App from './App'

render(
  <>
    <App />
    <TanStackDevtools
      plugins={[
        {
          name: 'Your Plugin',
          render: <YourPluginComponent />,
        },
      ]}
    />
  </>,
  document.getElementById('root')!,
)
```

## Core Patterns

### Shell Configuration

Pass a `config` prop to `TanStackDevtools` to set initial shell behavior. These values are persisted to `localStorage` after first load and can be changed through the settings panel at runtime.

Storage keys used internally:

- `tanstack_devtools_settings` -- persisted settings
- `tanstack_devtools_state` -- persisted UI state (active tab, panel height, active plugins, persistOpen)

All config properties are optional. Defaults shown below:

```tsx
<TanStackDevtools
  config={{
    defaultOpen: false, // open panel on mount
    hideUntilHover: false, // hide trigger until mouse hover
    position: 'bottom-right', // trigger position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'middle-left' | 'middle-right'
    panelLocation: 'bottom', // panel position: 'top' | 'bottom'
    openHotkey: ['Control', '~'],
    inspectHotkey: ['Shift', 'Alt', 'CtrlOrMeta'],
    requireUrlFlag: false, // require URL param to show devtools
    urlFlag: 'tanstack-devtools', // the URL param name when requireUrlFlag is true
    theme: 'dark', // 'light' | 'dark' (defaults to system preference)
    triggerHidden: false, // completely hide trigger (hotkey still works)
  }}
/>
```

### Event Bus Configuration

The `eventBusConfig` prop configures the client-side event bus that plugins use for communication:

```tsx
<TanStackDevtools
  eventBusConfig={{
    debug: false, // enable debug logging for the event bus
    connectToServerBus: false, // connect to the Vite plugin server event bus
    port: 3000, // port for server event bus connection
  }}
/>
```

The server event bus requires the `@tanstack/devtools-vite` plugin to be running.

### Plugin Registration with defaultOpen

Each plugin entry can include a `defaultOpen` flag to control whether that plugin tab is active when devtools first opens:

```tsx
import { TanStackDevtools } from '@tanstack/react-devtools'
import { FormDevtools } from '@tanstack/react-form'
;<TanStackDevtools
  config={{ hideUntilHover: true }}
  eventBusConfig={{ debug: true }}
  plugins={[
    {
      name: 'TanStack Form',
      render: <FormDevtools />,
      defaultOpen: true,
    },
  ]}
/>
```

### Conditional Devtools with URL Flag

Use `requireUrlFlag` to hide devtools unless a specific URL parameter is present. This is useful for staging environments or team-internal debugging:

```tsx
<TanStackDevtools
  config={{
    requireUrlFlag: true,
    urlFlag: 'tanstack-devtools', // visit ?tanstack-devtools to enable
  }}
/>
```

## Common Mistakes

### CRITICAL: Vue plugin uses `render` instead of `component`

The Vue adapter uses `component` (a Vue component reference) and optional `props`, not JSX `render`. Using `render` produces a silent failure -- the plugin tab appears but renders nothing.

Wrong:

```vue
<!-- This silently fails - render is ignored in Vue adapter -->
<script setup lang="ts">
const plugins = [{ name: 'My Plugin', render: MyComponent }]
</script>
```

Correct:

```vue
<script setup lang="ts">
import type { TanStackDevtoolsVuePlugin } from '@tanstack/vue-devtools'

const plugins: TanStackDevtoolsVuePlugin[] = [
  { name: 'My Plugin', component: MyComponent },
]
</script>
```

The `TanStackDevtoolsVuePlugin` type enforces this at compile time. Always import and use it.

### HIGH: Vite plugin not placed first in plugins array

The `@tanstack/devtools-vite` plugin performs source injection that must run before framework plugins (React, Vue, Solid, etc.) process the code.

Wrong:

```ts
import { devtools } from '@tanstack/devtools-vite'
import react from '@vitejs/plugin-react'

export default {
  plugins: [react(), devtools()],
}
```

Correct:

```ts
import { devtools } from '@tanstack/devtools-vite'
import react from '@vitejs/plugin-react'

export default {
  plugins: [devtools(), react()],
}
```

### HIGH: Mounting TanStackDevtools in SSR without client guard

The devtools core shell requires DOM APIs (`document`, `window`, `localStorage`). The React adapter includes `'use client'` at its entry point, so standard Next.js/Remix setups work. However, custom SSR setups or frameworks that do not respect the `'use client'` directive need explicit guards.

Wrong:

```tsx
// In a server-rendered component without framework 'use client' support
import { TanStackDevtools } from '@tanstack/react-devtools'

export default function Layout({ children }) {
  return (
    <>
      {children}
      <TanStackDevtools />
    </>
  )
}
```

Correct:

```tsx
import { TanStackDevtools } from '@tanstack/react-devtools'

export default function Layout({ children }) {
  return (
    <>
      {children}
      {typeof window !== 'undefined' && <TanStackDevtools />}
    </>
  )
}
```

Or use dynamic imports / lazy loading to ensure the component only loads on the client.

### MEDIUM: Installing as regular dependency for dev-only use

When using the Vite plugin for production stripping, devtools packages should be dev dependencies. Installing them as regular dependencies increases production bundle size unnecessarily.

Wrong:

```bash
npm install @tanstack/react-devtools
```

Correct:

```bash
npm install -D @tanstack/react-devtools
npm install -D @tanstack/devtools-vite
```

Exception: if you intentionally want devtools in production, install `@tanstack/devtools` (core) as a regular dependency. See the production skill for details.

### MEDIUM: Not keeping devtools packages at latest versions

All `@tanstack/devtools-*` packages share internal protocols (event bus messages, plugin mount lifecycle). Mixing versions can cause silent failures where plugins register but never receive events, or the shell mounts but plugins do not render.

Always update all devtools packages together:

```bash
npm install -D @tanstack/react-devtools@latest @tanstack/devtools-vite@latest
```

When building custom plugins, ensure `@tanstack/devtools-event-client` matches the version of `@tanstack/devtools` used by the shell.

## See Also

- **devtools-vite-plugin** -- Vite plugin configuration: source inspection, console piping, production stripping, server event bus setup
- **devtools-production** -- Production build handling: keeping devtools in prod, tree-shaking, URL flag gating
- **devtools-plugin-panel** -- Building custom plugin panels with the EventClient API
