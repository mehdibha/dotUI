/**
 * Compile smoke test — the load-bearing guard for the #477 bug class.
 *
 * Publishes EVERY publishable at the default preset (mimicking the /r/$name
 * route), lays the emitted files out as a shadcn consumer would receive them,
 * and runs ONE `tsc --noEmit` over the whole set. Cross-component imports
 * (`@/components/ui/field`) resolve to OTHER emitted files, so the check proves
 * the shipped code actually type-checks together — e.g. that every slot a base
 * file destructures and calls exists in the emitted tv config (the
 * field `fieldset`/`legend` regression). npm deps resolve from www/node_modules.
 */

import { execFileSync } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { expect, test } from 'vitest'

import { defaultPreset } from '@/lib/registry-preset'
import {
  publishables,
  PUBLISHABLE_NAMES,
} from '@/registry/__generated__/publishables'

import {
  publish,
  selectPublishable,
  setDotuiDepResolver,
  setKnownDotuiNames,
} from './publish'

// www/ — the fixture lives inside it so bare imports resolve via www/node_modules
// and path aliases can reach registry source with plain relative specifiers.
const WWW_DIR = path.resolve(import.meta.dirname, '../..')
const FIXTURE_DIR = path.join(WWW_DIR, '.smoke-fixture')
const TSC_BIN = path.join(WWW_DIR, 'node_modules', 'typescript', 'bin', 'tsc')

/** Map a shipped `target` to its consumer-alias location under the fixture src. */
function fixtureRelPath(target: string): string {
  if (target.startsWith('ui/')) return `src/components/ui/${target.slice(3)}`
  if (target.startsWith('lib/')) return `src/lib/${target.slice(4)}`
  if (target.startsWith('hooks/')) return `src/hooks/${target.slice(6)}`
  return `src/${target}`
}

function writeFixtureFile(relPath: string, content: string): void {
  const abs = path.join(FIXTURE_DIR, relPath)
  mkdirSync(path.dirname(abs), { recursive: true })
  writeFileSync(abs, content, 'utf8')
}

async function buildFixture(): Promise<void> {
  rmSync(FIXTURE_DIR, { recursive: true, force: true })
  mkdirSync(FIXTURE_DIR, { recursive: true })

  setKnownDotuiNames(PUBLISHABLE_NAMES)
  setDotuiDepResolver('https://dotui.org')
  const preset = defaultPreset()

  for (const name of PUBLISHABLE_NAMES) {
    const loader = publishables[name]
    if (!loader) continue
    const mod = await loader()
    const { item } = publish({
      publishable: selectPublishable(mod, preset),
      preset,
    })
    for (const file of item.files ?? []) {
      if (!file.target || file.content == null) continue
      writeFixtureFile(fixtureRelPath(file.target), file.content)
    }
  }

  // Init-bundled cn helper (ships in the registry:base item, not per-component).
  writeFixtureFile('src/lib/utils.ts', `export { cn } from "cnfast";\n`)
  // `@/components/icons` is resolved to a real library at publish; type it away
  // in case any emitted file still references the marker.
  writeFixtureFile('src/env.d.ts', `declare module "@/components/icons";\n`)

  // Aliases mirror the consumer's components.json. `@/components/ui/*` MUST hit
  // the emitted fixture files (cross-component type-checking); lib/hook deps not
  // shipped inline fall back to registry source for real types.
  const toRegistry = (sub: string) =>
    path.relative(FIXTURE_DIR, path.join(WWW_DIR, 'src/registry', sub))
  const tsconfig = {
    extends: '@dotui/ts-config/base.json',
    compilerOptions: {
      lib: ['ES2022', 'DOM', 'DOM.Iterable'],
      jsx: 'react-jsx',
      module: 'ESNext',
      moduleResolution: 'Bundler',
      noEmit: true,
      skipLibCheck: true,
      incremental: false,
      checkJs: false,
      types: [],
      paths: {
        '@/components/ui/*': ['./src/components/ui/*'],
        '@/lib/*': ['./src/lib/*', `${toRegistry('lib')}/*`],
        '@/hooks/*': ['./src/hooks/*', `${toRegistry('hooks')}/*`],
        '@/registry/*': [`${toRegistry('')}/*`],
      },
    },
    include: ['src/**/*.ts', 'src/**/*.tsx'],
  }
  writeFixtureFile('tsconfig.json', JSON.stringify(tsconfig, null, 2))
}

/**
 * Publishables whose EMITTED code has a known pre-existing type error, name →
 * reason. All are publisher/packaging bugs unrelated to #477's fix; the
 * publisher is queued for a rewrite, so they are tolerated here (never
 * deepened) rather than blocking the guard. A NEW break in any other component
 * fails the test; an allowlisted component that starts compiling is stale and
 * also fails, forcing the entry's removal once the bug is fixed.
 */
const KNOWN_BROKEN = new Map<string, string>([
  [
    'radio-group',
    'transform renames the source `radioGroupStyles` tv to `radioGroupVariants`, colliding with the generated tv (duplicate declaration).',
  ],
  [
    'toggle-button-group',
    'imports `toggleButtonStyles` from toggle-button, but the transform renames that export to `toggleButtonVariants`.',
  ],
  [
    'toast',
    'ships `import type { … } from "./types"` but toast/types.ts is not in meta.files, so the type module is missing.',
  ],
  [
    'time-picker',
    'ships `import type { … } from "./types"` but time-picker/types.ts is not in meta.files, so the type module is missing.',
  ],
])

const DIAGNOSTIC_RE = /^(src\/.+?)\((\d+),\d+\): error TS/

/** Component slug that owns an errored diagnostic line, e.g. `…/time-picker.tsx(9,…)` → `time-picker`. */
function ownerOf(line: string): string | undefined {
  const filePath = line.match(DIAGNOSTIC_RE)?.[1]
  return filePath ? path.basename(filePath).replace(/\.tsx?$/, '') : undefined
}

/** Run tsc over the fixture; returns diagnostic lines (only `path(line,col): error …`). */
function runTsc(): string[] {
  let output = ''
  try {
    execFileSync(process.execPath, [TSC_BIN, '--noEmit', '--pretty', 'false'], {
      cwd: FIXTURE_DIR,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    })
  } catch (err) {
    const e = err as { stdout?: string; stderr?: string }
    output = `${e.stdout ?? ''}${e.stderr ?? ''}`
  }
  return output.split('\n').filter((l) => DIAGNOSTIC_RE.test(l))
}

test(
  'every publishable emits code that type-checks together (default preset)',
  { timeout: 180_000 },
  async () => {
    await buildFixture()
    const diagnostics = runTsc()

    const unexpected: string[] = []
    const brokenSeen = new Set<string>()
    for (const line of diagnostics) {
      const owner = ownerOf(line)
      if (owner && KNOWN_BROKEN.has(owner)) brokenSeen.add(owner)
      else unexpected.push(line)
    }

    const stale = [...KNOWN_BROKEN.keys()].filter((n) => !brokenSeen.has(n))

    if (unexpected.length > 0) {
      const shown = unexpected.slice(0, 40).join('\n')
      throw new Error(
        `Emitted publishable code failed to type-check (${unexpected.length} error(s) in ` +
          `non-allowlisted components). A component ships broken code — e.g. a base file ` +
          `destructures a tv slot the emitted config dropped (the #477 field-slot regression). ` +
          `Fix the component's source/styles, or (only if it is a known publisher-rewrite bug) ` +
          `add it to KNOWN_BROKEN in publish-smoke.test.ts. First errors:\n\n${shown}`,
      )
    }
    if (stale.length > 0) {
      throw new Error(
        `Stale KNOWN_BROKEN entr${stale.length === 1 ? 'y' : 'ies'} — now compiles clean: ` +
          `${stale.join(', ')}. Remove from KNOWN_BROKEN in publish-smoke.test.ts.`,
      )
    }

    expect(unexpected).toEqual([])
    if (!process.env.KEEP_SMOKE_FIXTURE) {
      rmSync(FIXTURE_DIR, { recursive: true, force: true })
    }
  },
)
