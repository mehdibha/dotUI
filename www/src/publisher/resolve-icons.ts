/**
 * Request-time icon-library resolution.
 *
 * Registry source imports icons from `@/registry/icons`, which the build-time
 * transform rewrites to the `@/components/icons` marker (see transform-base).
 * This step replaces that marker import with direct imports from the preset's
 * icon library, so shipped code carries no dotui indirection:
 *
 *   lucide (default)  import { ChevronDownIcon } from "lucide-react";
 *   component sets    import { RiArrowDownSLine as ChevronDownIcon } from "@remixicon/react";
 *   (remix, tabler, phosphor, material-symbols, octicons)
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
import {
  iconLibraries,
  phosphorWeights,
  registryIcons,
} from "../registry/icons/icon-map"
import type {
  IconLibraryName,
  PhosphorWeight,
} from "../registry/icons/icon-map"

const ICONS_IMPORT_RE =
  /import\s*\{([^}]*)\}\s*from\s*(['"])@\/components\/icons\2;?/g

/** A top-level import statement (no quotes appear before the specifier). */
const IMPORT_STATEMENT_RE = /^import[^'"]*(['"])[^'"]+\1;?/gm

/** Libraries that ship one plain component per icon. */
type ComponentLibrary = Exclude<IconLibraryName, "lucide" | "hugeicons">

const LIBRARY_IMPORTS = Object.fromEntries(
  iconLibraries.map((library) => [library.name, library.import]),
) as Record<IconLibraryName, string>

interface ResolveIconOptions {
  /** Phosphor weight; anything not in `phosphorWeights` (or 'regular') is the default. */
  weight?: string
}

/** One `{ … }` entry: `ChevronDownIcon` or `ChevronDownIcon as Chevron`. */
interface ImportedIcon {
  /** Registry icon name (the key into `registryIcons`). */
  name: string
  /** Local binding the file's JSX uses. */
  local: string
}

function parseNamedImports(inner: string): ImportedIcon[] {
  return inner
    .split(",")
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
  return `import { ${specs.join(", ")} } from "lucide-react";`
}

function componentLibraryImport(
  icons: ImportedIcon[],
  library: ComponentLibrary,
): string {
  const mapped: string[] = []
  const unmapped: ImportedIcon[] = []
  for (const icon of icons) {
    const target = registryIcons[icon.name]?.[library]
    if (target)
      mapped.push(target === icon.local ? target : `${target} as ${icon.local}`)
    else unmapped.push(icon)
  }
  const lines: string[] = []
  if (mapped.length > 0)
    lines.push(
      `import { ${mapped.join(", ")} } from "${LIBRARY_IMPORTS[library]}";`,
    )
  if (unmapped.length > 0) lines.push(lucideImport(unmapped))
  return lines.join("\n")
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

interface WrappedLibrary {
  library: "hugeicons" | "phosphor"
  /** Imports emitted once, before the first mapped icon import. */
  setup: string[]
  importIcons: (icons: Array<ImportedIcon & { target: string }>) => string
  /** The component named `local` that the file's JSX keeps using. */
  wrapper: (local: string) => string
}

/**
 * Import each mapped icon under an alias and emit a wrapper component per icon
 * after the import block, so JSX usages stay untouched.
 */
function resolveWrapped(
  content: string,
  { library, setup, importIcons, wrapper }: WrappedLibrary,
): string {
  const wrapped: ImportedIcon[] = []

  const out = content.replace(ICONS_IMPORT_RE, (_match, inner: string) => {
    const mapped: Array<ImportedIcon & { target: string }> = []
    const unmapped: ImportedIcon[] = []
    for (const icon of parseNamedImports(inner)) {
      const target = registryIcons[icon.name]?.[library]
      if (target) mapped.push({ ...icon, target })
      else unmapped.push(icon)
    }
    const lines: string[] = []
    if (mapped.length > 0) {
      if (wrapped.length === 0) lines.push(...setup)
      lines.push(importIcons(mapped))
    }
    wrapped.push(...mapped)
    if (unmapped.length > 0) lines.push(lucideImport(unmapped))
    return lines.join("\n")
  })

  if (wrapped.length === 0) return out
  return insertAfterImports(
    out,
    wrapped.map(({ local }) => wrapper(local)).join("\n\n"),
  )
}

function resolveHugeicons(content: string): string {
  return resolveWrapped(content, {
    library: "hugeicons",
    setup: [
      'import { HugeiconsIcon } from "@hugeicons/react";',
      'import type { HugeiconsIconProps } from "@hugeicons/react";',
    ],
    importIcons: (icons) =>
      `import { ${icons
        .map(({ target, local }) => `${target} as ${local}Data`)
        .join(", ")} } from "@hugeicons/core-free-icons";`,
    // The `hugeicon` marker class hooks the stroke-width axis rule in base.css
    // (hugeicons paths carry their own stroke-width attribute).
    wrapper: (local) =>
      `function ${local}({ className, ...props }: Omit<HugeiconsIconProps, "icon">) {\n\treturn <HugeiconsIcon icon={${local}Data} className={className ? \`hugeicon \${className}\` : "hugeicon"} {...props} />;\n}`,
  })
}

/** Phosphor with a non-default weight: each wrapper pins the weight. */
function resolvePhosphorWeighted(
  content: string,
  weight: PhosphorWeight,
): string {
  return resolveWrapped(content, {
    library: "phosphor",
    setup: ['import type { IconProps } from "@phosphor-icons/react";'],
    importIcons: (icons) =>
      `import { ${icons
        .map(({ target, local }) => `${target} as Phosphor${local}`)
        .join(", ")} } from "@phosphor-icons/react";`,
    wrapper: (local) =>
      `function ${local}(props: IconProps) {\n\treturn <Phosphor${local} weight="${weight}" {...props} />;\n}`,
  })
}

/**
 * Rewrite every `@/components/icons` import in `content` for `library`.
 * Always runs — with no library (or lucide) the marker resolves to
 * `lucide-react`, since consumers have no `@/components/icons` module.
 */
export function resolveIconImports(
  content: string,
  library: IconLibraryName = "lucide",
  options: ResolveIconOptions = {},
): string {
  if (library === "hugeicons") return resolveHugeicons(content)
  if (library === "phosphor") {
    // The weight token comes from the URL — validate before splicing into code.
    const weight = phosphorWeights.find(
      (w) => w === options.weight && w !== "regular",
    )
    if (weight) return resolvePhosphorWeighted(content, weight)
  }
  return content.replace(ICONS_IMPORT_RE, (_match, inner: string) => {
    const icons = parseNamedImports(inner)
    if (icons.length === 0) return ""
    if (library === "lucide") return lucideImport(icons)
    return componentLibraryImport(icons, library)
  })
}
