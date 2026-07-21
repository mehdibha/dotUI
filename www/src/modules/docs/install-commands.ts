import { createPersistedStore, enumCodec } from '@/lib/persisted-store'

/** Package managers offered in install snippets, in display order. */
export const PACKAGE_MANAGERS = ['npm', 'pnpm', 'yarn', 'bun'] as const

export type PackageManager = (typeof PACKAGE_MANAGERS)[number]

/**
 * The user's package manager, shared across every install surface (docs code
 * tabs, the /create export dialog) so one choice follows them everywhere.
 */
export const packageManagerStore = createPersistedStore<PackageManager>(
  'dotui-package-manager',
  'pnpm',
  enumCodec(PACKAGE_MANAGERS, 'pnpm'),
)

/** `shadcn@latest <arg>` under each package manager's runner. */
function runnerCommands(arg: string): Record<PackageManager, string> {
  return {
    npm: `npx ${arg}`,
    pnpm: `pnpm dlx ${arg}`,
    yarn: `yarn dlx ${arg}`,
    bun: `bunx ${arg}`,
  }
}

/**
 * The shadcn install command per package manager for a set of registry items
 * (e.g. `["button", "input"]` → `npx shadcn@latest add @dotui/button @dotui/input`).
 */
export function buildInstallCommands(
  items: string[],
): Record<PackageManager, string> {
  return runnerCommands(
    `shadcn@latest add ${items.map((item) => `@dotui/${item}`).join(' ')}`,
  )
}

/**
 * The `shadcn init <url>` command per package manager. `init` (not `add`): it
 * is the only command that merges the item's `config.registries` into the
 * consumer's components.json, so a later `shadcn add @dotui/<name>` resolves
 * with the same preset baked in. `add` on an existing components.json silently
 * drops `config.registries`.
 */
export function buildInitCommands(url: string): Record<PackageManager, string> {
  return runnerCommands(`shadcn@latest init ${url}`)
}
