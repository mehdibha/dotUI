/**
 * Assemble the "Open in v0" registry item.
 *
 * v0's open endpoint (`v0.dev/chat/api/open?url=…`) accepts a single registry
 * item but strips its structured `css` / `cssVars` fields and doesn't reliably
 * resolve `registryDependencies`. So the theme ships as a real
 * `app/globals.css` and every component ships inline in `files[]` — the same
 * shape ui.shadcn.com's /create uses for its v0 payload.
 *
 * Everything is assembled per request from the same publisher output the CLI
 * path serves (`publish()` + `mergePresetCssFields`), so there's no build-time
 * bundle artifact and nothing to hand-sync when the registry evolves.
 *
 * Pure JS — no `ts-morph`, no React. Safe to import in route handlers.
 */

import type { RegistryItem, RegistryItemFile } from '@/registry/types'

import { DEFAULT_DEPENDENCIES } from './emit-theme'

type CssRecord = { [key: string]: string | CssRecord }
type RegistryCssFields = Pick<RegistryItem, 'css' | 'cssVars'>

/** Packages the target's framework scaffold provides — never pin or install. */
const FRAMEWORK_PROVIDED = new Set([
  'react',
  'react-dom',
  'next',
  'tailwindcss',
])

/** Font packages referenced from the generated globals.css `@import`s. */
const FONT_DEPENDENCIES = [
  '@fontsource-variable/geist',
  '@fontsource/geist-mono',
]

/* ------------------------------ css rendering ------------------------------ */

function renderCssEntries(record: CssRecord, indent: string): string[] {
  const lines: string[] = []
  for (const [key, value] of Object.entries(record)) {
    if (typeof value === 'string') {
      lines.push(`${indent}${key}: ${value};`)
    } else if (Object.keys(value).length === 0) {
      lines.push(`${indent}${key};`)
    } else {
      lines.push(`${indent}${key} {`)
      lines.push(...renderCssEntries(value, `${indent}  `))
      lines.push(`${indent}}`)
    }
  }
  return lines
}

/**
 * Render the init item's structured CSS fields — plus every shipped
 * component's `css` block merged in — into a single real `globals.css`.
 * `@import`s (ours + the record's) are hoisted to the top, as CSS requires.
 */
export function renderGlobalsCss(fields: RegistryCssFields): string {
  const css = (fields.css ?? {}) as CssRecord
  const importKeys = Object.keys(css).filter((k) => k.startsWith('@import'))
  const rest = Object.entries(css).filter(([k]) => !k.startsWith('@import'))

  const lines: string[] = [
    '@import "tailwindcss";',
    '@import "@fontsource-variable/geist";',
    '@import "@fontsource/geist-mono";',
    ...importKeys.map((k) => `${k};`),
    '',
    // The base theme aliases --font-sans to these; the faces come from the
    // @fontsource imports above.
    '@theme {',
    '  --font-geist-sans: "Geist Variable", ui-sans-serif, system-ui, sans-serif;',
    '  --font-geist-mono: "Geist Mono", ui-monospace, monospace;',
    '}',
  ]

  const theme = fields.cssVars?.theme
  if (theme && Object.keys(theme).length > 0) {
    lines.push('', '@theme inline {')
    for (const [name, value] of Object.entries(theme)) {
      lines.push(`  ${name.startsWith('--') ? name : `--${name}`}: ${value};`)
    }
    lines.push('}')
  }

  for (const [key, value] of rest) {
    lines.push('')
    lines.push(...renderCssEntries({ [key]: value } as CssRecord, ''))
  }

  return `${lines.join('\n')}\n`
}

/** Deep-merge one component's `css` block into the accumulated record. */
export function mergeComponentCss(
  target: NonNullable<RegistryCssFields['css']>,
  source: RegistryItem['css'],
): void {
  if (!source) return
  const dst = target as CssRecord
  for (const [key, value] of Object.entries(source as CssRecord)) {
    const existing = dst[key]
    if (
      typeof value === 'object' &&
      typeof existing === 'object' &&
      existing !== null
    ) {
      mergeComponentCss(existing as never, value as never)
    } else {
      dst[key] = value
    }
  }
}

/* ------------------------------- source files ------------------------------ */

/**
 * Registry-internal import prefixes → the consumer aliases published files
 * use. Support files shipped straight from registry source (`?raw`) get the
 * same rewrite the build-time publisher applies to component templates.
 */
export function rewriteRegistryImports(content: string): string {
  return content
    .replaceAll('@/registry/ui/', '@/components/ui/')
    .replaceAll('@/registry/hooks/', '@/hooks/')
    .replaceAll('@/registry/lib/', '@/lib/')
}

/** `ui/button.tsx` → `components/ui/button.tsx`; lib/hooks pass through. */
function projectTarget(target: string): string {
  return target.startsWith('ui/') ? `components/${target}` : target
}

/* -------------------------------- assembly -------------------------------- */

export interface V0File {
  type: string
  path: string
  target: string
  content: string
}

function v0File(type: string, target: string, content: string): V0File {
  return { type, path: target, target, content }
}

export interface BuildV0ItemInput {
  /** Preset-published items, one per publishable component. */
  items: RegistryItem[]
  /** Init CSS fields already merged with the preset (`mergePresetCssFields`). */
  cssFields: RegistryCssFields
  /** Support sources shipped verbatim (already import-rewritten), by target. */
  supportFiles: Record<string, string>
}

/**
 * Drop items whose published files import a `@/components/ui/*` module no
 * shipped item provides (a few components aren't publishable yet), iterating
 * so dependents of dropped items are dropped too.
 */
function satisfiableItems(items: RegistryItem[]): RegistryItem[] {
  const available = new Map(items.map((item) => [item.name, item]))
  for (;;) {
    let dropped = false
    for (const [name, item] of available) {
      const contents = (item.files ?? []).map((f) => f.content ?? '')
      const missing = contents.some((content) =>
        [...content.matchAll(/@\/components\/ui\/([a-z0-9-]+)/g)].some(
          (m) => !available.has(m[1]!),
        ),
      )
      if (missing) {
        available.delete(name)
        dropped = true
      }
    }
    if (!dropped) return [...available.values()]
  }
}

export function buildV0Item(input: BuildV0ItemInput): Record<string, unknown> {
  const items = satisfiableItems(input.items)

  // Merge every shipped component's css block (`--btn-radius` etc.) into the
  // theme fields before rendering — v0 would strip them as structured fields.
  const cssFields: RegistryCssFields = {
    css: { ...(input.cssFields.css ?? {}) },
    ...(input.cssFields.cssVars ? { cssVars: input.cssFields.cssVars } : {}),
  }
  for (const item of items) {
    mergeComponentCss(cssFields.css!, item.css)
  }

  const filesByTarget = new Map<string, V0File>()
  const add = (file: V0File) => {
    if (!filesByTarget.has(file.target)) filesByTarget.set(file.target, file)
  }

  add(v0File('registry:file', 'app/globals.css', renderGlobalsCss(cssFields)))
  add(v0File('registry:page', 'app/layout.tsx', V0_LAYOUT_TSX))
  add(v0File('registry:page', 'app/page.tsx', V0_PAGE_TSX))
  add(v0File('registry:component', 'components/demo.tsx', V0_DEMO_TSX))

  for (const item of items) {
    for (const file of item.files ?? []) {
      if (!file.content || !file.target) continue
      add(v0File(fileType(file), projectTarget(file.target), file.content))
    }
  }

  // Fill support-module gaps (hooks, lib helpers) not shipped by any item.
  for (const [target, content] of Object.entries(input.supportFiles)) {
    add(v0File('registry:lib', target, content))
  }

  // Same base deps `shadcn init` would install, since there's no init step
  // here — the plugins and utilities globals.css and lib/utils.ts reference.
  const dependencies = new Set<string>([
    ...DEFAULT_DEPENDENCIES,
    ...FONT_DEPENDENCIES,
  ])
  for (const item of items) {
    for (const dep of item.dependencies ?? []) dependencies.add(dep)
  }

  return {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: 'dotui-v0',
    type: 'registry:block',
    title: 'dotUI Design System',
    description:
      'Your dotUI design system with a starter demo, themed to your preset.',
    dependencies: [...dependencies]
      .filter((dep) => !FRAMEWORK_PROVIDED.has(dep))
      .sort(),
    registryDependencies: [],
    files: [...filesByTarget.values()],
  }
}

function fileType(file: RegistryItemFile): string {
  return file.type === 'registry:ui' ? 'registry:ui' : 'registry:lib'
}

/* ------------------------------ project shell ------------------------------ */

const V0_LAYOUT_TSX = `import type { ReactNode } from "react";

import "./globals.css";

export const metadata = {
\ttitle: "dotUI",
\tdescription: "A dotUI design system, generated on dotui.org/create.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
\treturn (
\t\t<html lang="en" suppressHydrationWarning>
\t\t\t<body className="bg-bg font-sans text-fg antialiased">{children}</body>
\t\t</html>
\t);
}
`

// The page imports globals.css too: if v0 keeps its own root layout, the
// theme still loads.
const V0_PAGE_TSX = `import "./globals.css";

import { Demo } from "@/components/demo";

export default function Page() {
\treturn (
\t\t<main className="flex min-h-screen items-center justify-center bg-bg p-6">
\t\t\t<Demo />
\t\t</main>
\t);
}
`

const V0_DEMO_TSX = `"use client";

import { Button } from "@/components/ui/button";
import {
\tCard,
\tCardContent,
\tCardDescription,
\tCardFooter,
\tCardHeader,
\tCardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/field";
import {
\tSelect,
\tSelectContent,
\tSelectItem,
\tSelectTrigger,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch, SwitchControl } from "@/components/ui/switch";

export function Demo() {
\treturn (
\t\t<Card className="w-full max-w-sm">
\t\t\t<CardHeader>
\t\t\t\t<CardTitle>Notifications</CardTitle>
\t\t\t\t<CardDescription>Choose how you want to be notified.</CardDescription>
\t\t\t</CardHeader>
\t\t\t<CardContent className="flex flex-col gap-5">
\t\t\t\t<Select className="w-full">
\t\t\t\t\t<Label>Notify me about</Label>
\t\t\t\t\t<SelectTrigger />
\t\t\t\t\t<SelectContent>
\t\t\t\t\t\t<SelectItem>Everything</SelectItem>
\t\t\t\t\t\t<SelectItem>Mentions only</SelectItem>
\t\t\t\t\t\t<SelectItem>Nothing</SelectItem>
\t\t\t\t\t</SelectContent>
\t\t\t\t</Select>
\t\t\t\t<Separator />
\t\t\t\t<Switch defaultSelected>
\t\t\t\t\t<SwitchControl />
\t\t\t\t\t<Label>Email digest</Label>
\t\t\t\t</Switch>
\t\t\t\t<Switch>
\t\t\t\t\t<SwitchControl />
\t\t\t\t\t<Label>Push notifications</Label>
\t\t\t\t</Switch>
\t\t\t</CardContent>
\t\t\t<CardFooter>
\t\t\t\t<Button variant="primary" className="w-full">
\t\t\t\t\tSave preferences
\t\t\t\t</Button>
\t\t\t</CardFooter>
\t\t</Card>
\t);
}
`
