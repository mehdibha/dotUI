/**
 * Request-time icon-library resolution.
 *
 * Registry source imports icons from `@/registry/icons`, which the build-time
 * transform rewrites to the `@/components/icons` marker (see transform-base).
 * This step replaces that marker import with direct imports from the preset's
 * icon library, so shipped code carries no dotui indirection:
 *
 *   lucide (default)  import { ChevronDownIcon } from "lucide-react";
 *   remix / tabler    import { RiArrowDownSLine as ChevronDownIcon } from "@remixicon/react";
 *   hugeicons         import { HugeiconsIcon } from "@hugeicons/react";
 *                     + data imports + a small component wrapper per icon,
 *                     emitted after the import block (hugeicons ships data
 *                     arrays, not components)
 *
 * Icons with no mapping for the chosen library fall back to lucide, so the
 * output always compiles. Pure string transform — no ts-morph, route-safe.
 */

// Relative import: this module is reachable from `vite.config.ts` (via
// source-overlay → transform-base → publish), which node loads without the
// `@/` alias — a value import through the alias would break config loading.
import { registryIcons } from '../registry/icons/icon-map'
import type { IconLibraryName } from '../registry/icons/icon-map'

const ICONS_IMPORT_RE =
  /import\s*\{([^}]*)\}\s*from\s*(['"])@\/components\/icons\2;?/g

/** A top-level import statement (no quotes appear before the specifier). */
const IMPORT_STATEMENT_RE = /^import[^'"]*(['"])[^'"]+\1;?/gm

const LIBRARY_PACKAGES = {
  remix: '@remixicon/react',
  tabler: '@tabler/icons-react',
} as const

/** One `{ … }` entry: `ChevronDownIcon` or `ChevronDownIcon as Chevron`. */
interface ImportedIcon {
  /** Registry icon name (the key into `registryIcons`). */
  name: string
  /** Local binding the file's JSX uses. */
  local: string
}

function parseNamedImports(inner: string): ImportedIcon[] {
  return inner
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [name, , alias] = entry.split(/\s+/)
      return { name: name ?? entry, local: alias ?? name ?? entry }
    })
}

function lucideImport(icons: ImportedIcon[]): string {
  const specs = icons.map(({ name, local }) => {
    const lucideName = registryIcons[name]?.lucide ?? name
    return lucideName === local ? lucideName : `${lucideName} as ${local}`
  })
  return `import { ${specs.join(', ')} } from "lucide-react";`
}

function componentLibraryImport(
  icons: ImportedIcon[],
  library: 'remix' | 'tabler',
): string {
  const mapped: string[] = []
  const unmapped: ImportedIcon[] = []
  for (const icon of icons) {
    const target = registryIcons[icon.name]?.[library]
    if (target) mapped.push(`${target} as ${icon.local}`)
    else unmapped.push(icon)
  }
  const lines: string[] = []
  if (mapped.length > 0)
    lines.push(
      `import { ${mapped.join(', ')} } from "${LIBRARY_PACKAGES[library]}";`,
    )
  if (unmapped.length > 0) lines.push(lucideImport(unmapped))
  return lines.join('\n')
}

/** Insert `block` on its own paragraph after the file's last import statement. */
function insertAfterImports(content: string, block: string): string {
  let end = -1
  for (const match of content.matchAll(IMPORT_STATEMENT_RE)) {
    end = match.index + match[0].length
  }
  if (end === -1) return `${block}\n\n${content}`
  return `${content.slice(0, end)}\n\n${block}${content.slice(end)}`
}

function resolveHugeicons(content: string): string {
  const wrapped: Array<ImportedIcon & { target: string }> = []
  let usesHugeicons = false

  let out = content.replace(ICONS_IMPORT_RE, (_match, inner: string) => {
    const icons = parseNamedImports(inner)
    const mapped: Array<ImportedIcon & { target: string }> = []
    const unmapped: ImportedIcon[] = []
    for (const icon of icons) {
      const target = registryIcons[icon.name]?.hugeicons
      if (target) mapped.push({ ...icon, target })
      else unmapped.push(icon)
    }
    wrapped.push(...mapped)
    const lines: string[] = []
    if (mapped.length > 0) {
      if (!usesHugeicons) {
        usesHugeicons = true
        lines.push(
          'import { HugeiconsIcon } from "@hugeicons/react";',
          'import type { HugeiconsIconProps } from "@hugeicons/react";',
        )
      }
      lines.push(
        `import { ${mapped
          .map(({ target, local }) => `${target} as ${local}Data`)
          .join(', ')} } from "@hugeicons/core-free-icons";`,
      )
    }
    if (unmapped.length > 0) lines.push(lucideImport(unmapped))
    return lines.join('\n')
  })

  if (wrapped.length > 0) {
    const wrappers = wrapped
      .map(
        ({ local }) =>
          `function ${local}(props: Omit<HugeiconsIconProps, "icon">) {\n\treturn <HugeiconsIcon icon={${local}Data} {...props} />;\n}`,
      )
      .join('\n\n')
    out = insertAfterImports(out, wrappers)
  }
  return out
}

/**
 * Rewrite every `@/components/icons` import in `content` for `library`.
 * Always runs — with no library (or lucide) the marker resolves to
 * `lucide-react`, since consumers have no `@/components/icons` module.
 */
export function resolveIconImports(
  content: string,
  library: IconLibraryName = 'lucide',
): string {
  if (library === 'hugeicons') return resolveHugeicons(content)
  return content.replace(ICONS_IMPORT_RE, (_match, inner: string) => {
    const icons = parseNamedImports(inner)
    if (icons.length === 0) return ''
    if (library === 'remix' || library === 'tabler')
      return componentLibraryImport(icons, library)
    return lucideImport(icons)
  })
}
