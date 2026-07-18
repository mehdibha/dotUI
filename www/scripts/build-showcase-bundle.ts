/**
 * Build the "showcase bundle" generated artifact.
 *
 * The "Open in v0" feature hands an external tool (v0) a *whole project* that
 * boots straight into the dotUI showcase (`modules/marketing/cards.tsx`),
 * with every component installed and the user's preset
 * theme written into `globals.css`.
 *
 * v0 strips a registry item's `css` / `cssVars` fields, so the theme can't ride
 * along that way — it must be shipped as a real file. And because v0 doesn't
 * reliably resolve `registryDependencies`, every source file the showcase
 * transitively needs must be shipped inline in the item's `files[]`.
 *
 * This script computes that transitive closure ONCE at build time. Starting
 * from `cards.tsx`, it follows every in-repo import (`@/…` and relative) and
 * collects the reachable `.ts`/`.tsx` source, plus the per-component `styles.css`
 * sidecar files (which are wired through CSS `@import`, not JS imports). The
 * result is emitted to `src/registry/__generated__/showcase-bundle.ts` for the
 * `/r/showcase-bundle` route to assemble per request.
 *
 * Two deliberate substitutions keep the bundle self-contained — i.e. installable
 * in a vanilla Next.js + shadcn project with only published npm deps:
 *   - `@/registry/theme` → a partial stub. The real barrel pulls in the
 *     unpublished `@dotui/colors` workspace package. The semantic layer
 *     (`DEFAULT_SEMANTICS` + `emitCss`) ships REAL — the provider's scoped mode
 *     calls it at runtime — and the default color recipe is serialized in with
 *     its `@dotui/colors` seeds resolved; only the generative ramp path stays
 *     inert (colors travel as resolved CSS vars in globals.css), cutting the
 *     `@dotui/colors` cord with zero edits to the provider.
 *   - `@/registry/types` → a self-contained loose copy. The real file imports
 *     types from the `shadcn` CLI package; the stub drops that dependency. Types
 *     are erased at runtime, so this only matters if the consumer type-checks.
 *
 * Plus one content rewrite: `invite-members.tsx` imports an icon from dotUI's
 * app-only `@/registry/__generated__/icons` barrel; we repoint it at `lucide-react`.
 */

import { existsSync, promises as fs, statSync } from 'node:fs'
import path from 'node:path'
import { format } from 'oxfmt'

import { DEFAULT_COLOR_CONFIG } from '../src/registry/theme/color-config'

// `process.cwd()` is `www/` (the script is run from there via pnpm).
const SRC = path.join(process.cwd(), 'src')
const GENERATED = path.join(SRC, 'registry/__generated__')
const OUT_FILE = path.join(GENERATED, 'showcase-bundle.ts')

/** Entry point of the closure — the component the showcase renders first. */
const ENTRY = 'modules/marketing/cards.tsx'

/**
 * Full-file replacements, keyed by src-relative path. A file in this map is
 * shipped with the given content and is NOT scanned for further imports.
 */
const OVERRIDES: Record<string, string> = {
  'registry/theme/index.ts': themeStub(),
  'registry/types.ts': typesStub(),
}

/** Per-file content rewrites applied after read, before emit and import scan. */
function transformContent(srcRel: string, content: string): string {
  if (srcRel === 'registry/theme/types.ts') {
    // Type-only dependency on the unpublished @dotui/colors — inline it so the
    // package never enters the bundle's dependency list.
    const rewritten = content.replace(
      /import\s+type\s*\{\s*StepName\s*\}\s*from\s*["']@dotui\/colors["'];?/,
      'type StepName = string;',
    )
    if (rewritten === content) {
      throw new Error(
        '[showcase-bundle] expected to rewrite the StepName import in registry/theme/types.ts but found no match',
      )
    }
    return rewritten
  }
  if (srcRel === 'components/showcase/invite-members.tsx') {
    const rewritten = content.replace(
      /import\s*\{\s*ExternalLinkIcon\s*\}\s*from\s*["']@\/registry\/__generated__\/icons["'];?/,
      `import { ExternalLink as ExternalLinkIcon } from "lucide-react";`,
    )
    if (rewritten === content) {
      throw new Error(
        '[showcase-bundle] expected to rewrite the icons import in invite-members.tsx but found no match',
      )
    }
    return rewritten
  }
  return content
}

/**
 * npm packages used through CSS (`@import` / `@plugin`) that won't surface in
 * the JS-import scan, plus the tailwind toolchain the bundle's globals.css needs.
 */
const CSS_DEPENDENCIES = [
  '@fontsource-variable/geist',
  '@fontsource/geist-mono',
  'tw-animate-css',
  'tailwindcss',
  'tailwindcss-react-aria-components',
  'tailwindcss-with',
]

/**
 * Provided by the target's framework scaffold (Next.js + Tailwind v4) — never
 * pin these from dotUI, or we'd fight the tool's own versions.
 */
const FRAMEWORK_PROVIDED = new Set(['react', 'react-dom', 'tailwindcss'])

/**
 * Runtime peer deps of bundled packages that the JS-import scan can't see:
 * `tailwind-variants` imports `tailwind-merge` internally (its `twMerge`), and
 * `cn` no longer pulls it in directly (it uses `cnfast`). Without this the v0
 * bundle would ship `tailwind-variants` with an unmet `tailwind-merge` peer.
 */
const PEER_DEPENDENCIES = ['tailwind-merge']

/**
 * Published versions to pin in the bundle's `dependencies`. `workspace:*` deps in
 * dotUI's package.json (the two tailwind plugins) resolve to these published
 * releases. Bare names left out default to latest; pinning avoids breakage when
 * a transitive peer ships a new major.
 */
const DEP_VERSIONS: Record<string, string> = {
  '@base-ui/react': '^1.4.1',
  '@fontsource-variable/geist': '^5.2.8',
  '@fontsource/geist-mono': '^5.2.7',
  '@internationalized/date': '^3.12.2',
  cnfast: '^0.0.8',
  'lucide-react': '^1.16.0',
  'react-aria': '^3.50.0',
  'react-aria-components': '^1.19.0',
  'react-stately': '^3.48.0',
  'tailwind-merge': '^3.0.2',
  'tailwind-variants': '^3.1.1',
  'tailwindcss-react-aria-components': '^2.2.0',
  'tailwindcss-with': '^0.0.2',
  'tw-animate-css': '^1.3.5',
}

interface BundleFile {
  target: string
  content: string
}

/* ----------------------------- module resolution ----------------------------- */

const EXT_CANDIDATES = ['.tsx', '.ts', '/index.tsx', '/index.ts']

function isFile(srcRel: string): boolean {
  const abs = path.join(SRC, srcRel)
  return existsSync(abs) && statSync(abs).isFile()
}

/** Resolve a src-relative path (no extension) to an existing file, or null. */
function resolveFile(srcRel: string): string | null {
  // Explicit extension already present.
  if (/\.(tsx?|css|js)$/.test(srcRel)) {
    return isFile(srcRel) ? srcRel : null
  }
  for (const ext of EXT_CANDIDATES) {
    const candidate = `${srcRel}${ext}`
    if (isFile(candidate)) return candidate
  }
  return null
}

type Resolved =
  | { kind: 'src'; srcRel: string }
  | { kind: 'npm'; pkg: string }
  | { kind: 'unresolved' }

function resolveSpecifier(spec: string, fromSrcRel: string): Resolved {
  let srcRel: string | null = null
  if (spec.startsWith('@/')) {
    srcRel = resolveFile(spec.slice(2))
  } else if (spec.startsWith('.')) {
    const joined = path.normalize(path.join(path.dirname(fromSrcRel), spec))
    srcRel = resolveFile(joined)
  } else {
    return { kind: 'npm', pkg: packageNameOf(spec) }
  }
  if (srcRel) return { kind: 'src', srcRel }
  return { kind: 'unresolved' }
}

/** `react-aria-components/Button` → `react-aria-components`; `@internationalized/date` → `@internationalized/date`. */
function packageNameOf(spec: string): string {
  const parts = spec.split('/')
  if (spec.startsWith('@')) return parts.slice(0, 2).join('/')
  return parts[0] ?? spec
}

/**
 * Rewrite every in-bundle `@/…` import in a file to a RELATIVE path.
 *
 * v0 applies shadcn's registry alias transform — it rewrites `@/registry/ui/X`
 * → `@/components/ui/X`, `@/registry/lib/utils` → `@/lib/utils`, etc. — then
 * fails to find the files (we ship dotUI's own tree, not the shadcn flat
 * layout). Relative imports have no alias for v0 to touch, so they resolve to
 * wherever we place the files, in any project. npm and already-relative imports
 * pass through untouched.
 */
function rewriteImportsToRelative(srcRel: string, content: string): string {
  let out = content
  for (const spec of extractSpecifiers(content)) {
    if (!spec.startsWith('@/')) continue
    const target = resolveFile(spec.slice(2))
    if (!target) continue
    const rel = toRelativeImport(srcRel, target)
    out = out
      .split(`"${spec}"`)
      .join(`"${rel}"`)
      .split(`'${spec}'`)
      .join(`'${rel}'`)
  }
  return out
}

/** A relative specifier (no extension, leading `./` or `../`) from one src-rel file to another. */
function toRelativeImport(fromSrcRel: string, targetSrcRel: string): string {
  const moduleTarget = /\.css$/.test(targetSrcRel)
    ? targetSrcRel
    : targetSrcRel
        .replace(/\/index\.(tsx?|jsx?)$/, '')
        .replace(/\.(tsx?|jsx?)$/, '')
  let rel = path
    .relative(path.dirname(fromSrcRel), moduleTarget)
    .split(path.sep)
    .join('/')
  if (!rel.startsWith('.')) rel = `./${rel}`
  return rel
}

/* ------------------------------- import scan ------------------------------- */

const IMPORT_PATTERNS = [
  /(?:import|export)\s+(?:type\s+)?[^"';]*?\s+from\s*["']([^"']+)["']/g,
  /import\s*["']([^"']+)["']/g,
  /import\s*\(\s*["']([^"']+)["']\s*\)/g,
]

/** Strip comments so commented-out imports aren't scanned. Lookbehind spares `https://`. */
function stripComments(s: string): string {
  return s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(?<!:)\/\/[^\n]*/g, '')
}

function extractSpecifiers(rawContent: string): string[] {
  const content = stripComments(rawContent)
  const specs = new Set<string>()
  for (const pattern of IMPORT_PATTERNS) {
    pattern.lastIndex = 0
    let match: RegExpExecArray | null
    while ((match = pattern.exec(content)) !== null) {
      if (match[1]) specs.add(match[1])
    }
  }
  return [...specs]
}

/* --------------------------------- closure --------------------------------- */

async function buildShowcaseBundle(): Promise<void> {
  const sourceFiles = new Map<string, string>() // srcRel -> content
  const npmDeps = new Set<string>()
  const unresolved: { from: string; spec: string }[] = []
  const cssSideEffectFiles = new Set<string>() // .css reached via JS import

  const queue: string[] = [ENTRY]
  const visited = new Set<string>()

  while (queue.length > 0) {
    const srcRel = queue.shift()!
    if (visited.has(srcRel)) continue
    visited.add(srcRel)

    if (srcRel.endsWith('.css')) {
      cssSideEffectFiles.add(srcRel)
      continue
    }

    const override = OVERRIDES[srcRel]
    const raw = override ?? (await fs.readFile(path.join(SRC, srcRel), 'utf8'))
    const content = override ?? transformContent(srcRel, raw)
    sourceFiles.set(srcRel, content)

    // Overrides are scanned like any file: the theme stub re-exports the real
    // ./semantics + ./emit-css, which must enter the closure.
    for (const spec of extractSpecifiers(content)) {
      const resolved = resolveSpecifier(spec, srcRel)
      if (resolved.kind === 'npm') {
        npmDeps.add(resolved.pkg)
      } else if (resolved.kind === 'src') {
        if (!visited.has(resolved.srcRel)) queue.push(resolved.srcRel)
      } else {
        unresolved.push({ from: srcRel, spec })
      }
    }
  }

  if (unresolved.length > 0) {
    for (const u of unresolved)
      console.error(`  ✗ unresolved import "${u.spec}" in ${u.from}`)
    throw new Error(
      `[showcase-bundle] ${unresolved.length} unresolved import(s); see above`,
    )
  }

  /* ----- collect per-component styles.css sidecars (wired via CSS @import) ----- */
  const componentDirs = new Set<string>()
  for (const srcRel of sourceFiles.keys()) {
    const m = srcRel.match(/^(registry\/ui\/[^/]+)\//)
    if (m?.[1]) componentDirs.add(m[1])
  }
  const componentStyleImports: string[] = []
  const cssFiles: BundleFile[] = []
  for (const dir of [...componentDirs].sort()) {
    const stylesRel = `${dir}/styles.css`
    if (existsSync(path.join(SRC, stylesRel))) {
      cssFiles.push({
        target: stylesRel,
        content: await fs.readFile(path.join(SRC, stylesRel), 'utf8'),
      })
      componentStyleImports.push(
        `@import "./${stylesRel.replace('registry/', '')}";`,
      )
    }
  }
  // Any .css reached directly via a JS import (rare) ships verbatim too.
  for (const srcRel of cssSideEffectFiles) {
    if (!cssFiles.some((f) => f.target === srcRel)) {
      cssFiles.push({
        target: srcRel,
        content: await fs.readFile(path.join(SRC, srcRel), 'utf8'),
      })
    }
  }

  /* ----- base CSS (theme scaffolding). colors.css is injected per-request. ----- */
  for (const base of ['base.css', 'theme.css', 'fonts.css']) {
    const content = await fs.readFile(
      path.join(SRC, `registry/base/${base}`),
      'utf8',
    )
    cssFiles.unshift({ target: `registry/base/${base}`, content })
  }

  /* ----- the registry CSS aggregator (mirrors src/registry/styles.css) ----- */
  const aggregator = [
    `/* AUTO-GENERATED by the showcase bundle. */`,
    `@import "./base/base.css";`,
    `@import "./base/colors.css";`,
    `@import "./base/theme.css";`,
    `@import "./base/fonts.css";`,
    '',
    ...componentStyleImports,
    '',
  ].join('\n')
  cssFiles.push({ target: 'registry/styles.css', content: aggregator })

  /* --------------------------------- emit --------------------------------- */
  // Targets are project-root-relative; imports are rewritten to RELATIVE paths
  // so v0's `@/registry/* → @/components/ui/*` alias transform has nothing to
  // touch and the files resolve wherever they land.
  const sourceFilesArr: BundleFile[] = [...sourceFiles.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([srcRel, content]) => ({
      target: srcRel,
      content: rewriteImportsToRelative(srcRel, content),
    }))

  const dependencies = [
    ...new Set([...npmDeps, ...CSS_DEPENDENCIES, ...PEER_DEPENDENCIES]),
  ]
    .filter((d) => !d.startsWith('@/') && !FRAMEWORK_PROVIDED.has(d))
    .sort()
    .map((d) => (DEP_VERSIONS[d] ? `${d}@${DEP_VERSIONS[d]}` : d))
  const componentNames = [...componentDirs]
    .map((d) => d.replace('registry/ui/', ''))
    .sort()

  const out = `// AUTO-GENERATED — do not edit. Run \`pnpm build:registry\`.
// Transitive source + CSS closure for the "Open in v0" showcase bundle.
// Generated by scripts/build-showcase-bundle.ts.

export interface BundleFile {
	target: string;
	content: string;
}

export const SHOWCASE_BUNDLE_SOURCE_FILES: BundleFile[] = ${JSON.stringify(sourceFilesArr, null, 2)};

export const SHOWCASE_BUNDLE_CSS_FILES: BundleFile[] = ${JSON.stringify(cssFiles, null, 2)};

export const SHOWCASE_BUNDLE_DEPENDENCIES: string[] = ${JSON.stringify(dependencies, null, 2)};

export const SHOWCASE_BUNDLE_COMPONENTS: string[] = ${JSON.stringify(componentNames, null, 2)};
`

  await fs.mkdir(GENERATED, { recursive: true })
  const { code } = await format(OUT_FILE, out, {
    printWidth: 120,
    useTabs: true,
  })
  await fs.writeFile(OUT_FILE, code, 'utf8')

  console.log(
    `  ✓ showcase-bundle: ${sourceFilesArr.length} source + ${cssFiles.length} css files, ` +
      `${dependencies.length} deps, ${componentNames.length} components`,
  )
}

/* --------------------------------- stubs --------------------------------- */

function themeStub(): string {
  return `// Stub of @/registry/theme for the standalone "Open in v0" bundle.
// The real barrel depends on the unpublished @dotui/colors workspace package.
// What ships real vs inert:
//   - The semantic layer (./semantics + ./emit-css) is re-exported for REAL —
//     the design-system provider's scoped mode calls it at runtime to clone
//     the semantic tokens onto the preview scope.
//   - DEFAULT_COLOR_CONFIG is the real recipe, serialized at bundle build time.
//   - The generative ramp path stays inert — colors ship as resolved CSS vars
//     in globals.css — so emitPrimitivesCss / resolveColorConfig are no-ops and
//     a scoped accent change keeps the baked palette.

export {
\tACCENT_PRIMARY_SEMANTICS,
\tDEFAULT_SEMANTICS,
\tsemanticsWithPrimary,
\tsemanticVocabulary,
} from "./semantics";
export { emitCss, emitDarkOverridesCss, resolveTokenValue } from "./emit-css";
export type { PrimaryColorSource } from "./types";

export interface PaletteSeeds {
\taccent: string;
\tneutral?: string;
\tsuccess?: string;
\twarning?: string;
\tdanger?: string;
\tinfo?: string;
}

export interface ColorConfig {
\tv: 2;
\tseeds: PaletteSeeds;
\tbackground?: { light?: number; dark?: number | "oled" };
\tvividness?: number;
\thueShift?: number;
\tneutralTint?: number;
\tpreserveSeed?: boolean;
\tprimary?: "accent";
}

export const DEFAULT_COLOR_CONFIG: ColorConfig = ${JSON.stringify(DEFAULT_COLOR_CONFIG, null, '\t')};

/** Schema-free shim: a valid v2 config passes through, anything else falls back. */
export function migrateColorConfig(input: unknown): ColorConfig {
\tconst config = input as ColorConfig | null;
\tif (
\t\tconfig &&
\t\ttypeof config === "object" &&
\t\tconfig.v === 2 &&
\t\ttypeof config.seeds?.accent === "string"
\t)
\t\treturn config;
\treturn DEFAULT_COLOR_CONFIG;
}

interface ThemeMode {
\tbackground: string;
\tscales: Record<string, Record<string, string>>;
\talphas: Record<string, Record<string, string>>;
\ton: Record<string, { "700": string; "800": string }>;
}

export interface Theme {
\tlight: ThemeMode;
\tdark: ThemeMode;
\tcharts: { categorical: string[]; sequential: string[]; diverging: string[] };
\treport: { ok: boolean; warnings: string[] };
}

export function emitPrimitivesCss(..._args: unknown[]): string {
\treturn "";
}
export function resolveColorConfig(_config: ColorConfig): Theme {
\tconst mode = (): ThemeMode => ({ background: "", scales: {}, alphas: {}, on: {} });
\treturn {
\t\tlight: mode(),
\t\tdark: mode(),
\t\tcharts: { categorical: [], sequential: [], diverging: [] },
\t\treport: { ok: true, warnings: [] },
\t};
}
`
}

function typesStub(): string {
  return `// Self-contained copy of @/registry/types for the standalone "Open in v0"
// bundle. The real file imports types from the \`shadcn\` CLI package; this drops
// that dependency. Types are erased at runtime, so behavior is identical.
export type Density = "compact" | "default" | "comfortable";
export type ComponentGroup = string;
export type TokenType = "radius" | "color" | "spacing" | "font-size" | "blur" | "opacity" | "cursor" | "shadow";

export interface RegistryItemFile {
\tpath: string;
\ttype: string;
\ttarget?: string;
\tcontent?: string;
}

export type EnumParamDef = {
\tkind: "enum";
\tdefault: string;
\tvalues: readonly string[];
\tfiles?: Record<string, readonly RegistryItemFile[]>;
\tdescription?: string;
};

export type ScalarParamDef = {
\tkind: "scalar";
\ttype: TokenType;
\tcssVar: \`--\${string}\`;
\tdefault: string;
\tminValue?: number;
\tmaxValue?: number;
\tstep?: number;
\tdescription?: string;
};

export type ParamDef = EnumParamDef | ScalarParamDef;

export type RegistryItem = {
\tname: string;
\ttype: string;
\tgroup?: ComponentGroup | null;
\tparams?: Record<string, ParamDef>;
\tfiles?: RegistryItemFile[];
\tregistryDependencies?: string[];
\tdependencies?: string[];
\ttitle?: string;
\tdescription?: string;
\t[key: string]: unknown;
};

export type Registry = {
\titems: RegistryItem[];
\t[key: string]: unknown;
};
`
}

buildShowcaseBundle().catch((err) => {
  console.error('\n❌ Error building showcase bundle:', err)
  process.exit(1)
})
