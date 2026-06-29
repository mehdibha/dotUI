/** Package managers offered in install snippets, in display order. */
export const PACKAGE_MANAGERS = ['npm', 'pnpm', 'yarn', 'bun'] as const

export type PackageManager = (typeof PACKAGE_MANAGERS)[number]

/**
 * The shadcn install command per package manager for a set of registry items
 * (e.g. `["button", "input"]` → `npx shadcn@latest add @dotui/button @dotui/input`).
 */
export function buildInstallCommands(
  items: string[],
): Record<PackageManager, string> {
  const arg = `shadcn@latest add ${items.map((item) => `@dotui/${item}`).join(' ')}`
  return {
    npm: `npx ${arg}`,
    pnpm: `pnpm dlx ${arg}`,
    yarn: `yarn dlx ${arg}`,
    bun: `bunx ${arg}`,
  }
}
