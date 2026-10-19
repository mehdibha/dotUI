/**
 * Compile smoke test — the load-bearing guard for the #477 bug class.
 *
 * Publishes EVERY publishable at the Origin preset (mimicking
 * `/r/<name>.json`), lays the emitted files out as a shadcn consumer would receive them,
 * and runs ONE `tsc --noEmit` over the whole set. Cross-component imports
 * (`@/components/ui/field`) resolve to OTHER emitted files, so the check proves
 * the shipped code actually type-checks together — e.g. that every slot a base
 * file destructures and calls exists in the emitted tv config (the
 * field `fieldset`/`legend` regression). npm deps resolve from www/node_modules.
 */

import { execFileSync } from "node:child_process"
import { mkdirSync, rmSync, writeFileSync } from "node:fs"
import path from "node:path"
import { test } from "vitest"

import {
  publishables,
  PUBLISHABLE_NAMES,
} from "@/registry/__generated__/publishables"
import { ORIGIN, resolvePreset } from "@/modules/presets"

import { CN_UTILS_TS } from "./emit-theme"
import { publish, selectPublishable } from "./publish"
import { consumerPath } from "./serve"

// www/ — the fixture lives inside it so bare imports resolve via www/node_modules
// and path aliases can reach registry source with plain relative specifiers.
const WWW_DIR = path.resolve(import.meta.dirname, "../..")
const FIXTURE_DIR = path.join(WWW_DIR, ".smoke-fixture")
const TSC_BIN = path.join(WWW_DIR, "node_modules", "typescript", "bin", "tsc")

function writeFixtureFile(relPath: string, content: string): void {
  const abs = path.join(FIXTURE_DIR, relPath)
  mkdirSync(path.dirname(abs), { recursive: true })
  writeFileSync(abs, content, "utf8")
}

async function buildFixture(): Promise<void> {
  rmSync(FIXTURE_DIR, { recursive: true, force: true })
  mkdirSync(FIXTURE_DIR, { recursive: true })

  const preset = resolvePreset(ORIGIN.id)

  for (const name of PUBLISHABLE_NAMES) {
    const loader = publishables[name]
    if (!loader) continue
    const mod = await loader()
    const { item } = publish({
      publishable: selectPublishable(mod, preset),
      preset,
    })
    for (const file of item.files ?? []) {
      if (file.content == null) continue
      writeFixtureFile(consumerPath(file.path), file.content)
    }
  }

  // Init-bundled cn helper (ships in the registry:base item, not per-component).
  writeFixtureFile("src/lib/utils.ts", CN_UTILS_TS)

  // Aliases mirror the consumer's components.json. `@/components/ui/*` MUST hit
  // the emitted fixture files (cross-component type-checking); lib/hook deps not
  // shipped inline fall back to registry source for real types.
  const toRegistry = (sub: string) =>
    path.relative(FIXTURE_DIR, path.join(WWW_DIR, "src/registry", sub))
  const tsconfig = {
    extends: "@dotui/ts-config/base.json",
    compilerOptions: {
      lib: ["ES2022", "DOM", "DOM.Iterable"],
      jsx: "react-jsx",
      module: "ESNext",
      moduleResolution: "Bundler",
      noEmit: true,
      skipLibCheck: true,
      incremental: false,
      checkJs: false,
      types: [],
      paths: {
        "@/components/ui/*": ["./src/components/ui/*"],
        "@/lib/*": ["./src/lib/*", `${toRegistry("lib")}/*`],
        "@/hooks/*": ["./src/hooks/*", `${toRegistry("hooks")}/*`],
        "@/registry/*": [`${toRegistry("")}/*`],
      },
    },
    include: ["src/**/*.ts", "src/**/*.tsx"],
  }
  writeFixtureFile("tsconfig.json", JSON.stringify(tsconfig, null, 2))
}

const DIAGNOSTIC_RE = /^(src\/.+?)\((\d+),\d+\): error TS/

/** Run tsc over the fixture; returns diagnostic lines (only `path(line,col): error …`). */
function runTsc(): string[] {
  let output = ""
  try {
    execFileSync(process.execPath, [TSC_BIN, "--noEmit", "--pretty", "false"], {
      cwd: FIXTURE_DIR,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    })
  } catch (err) {
    const e = err as { stdout?: string; stderr?: string }
    output = `${e.stdout ?? ""}${e.stderr ?? ""}`
  }
  return output.split("\n").filter((l) => DIAGNOSTIC_RE.test(l))
}

test(
  "every publishable emits code that type-checks together (default preset)",
  { timeout: 180_000 },
  async () => {
    await buildFixture()
    const diagnostics = runTsc()

    if (diagnostics.length > 0) {
      const shown = diagnostics.slice(0, 40).join("\n")
      throw new Error(
        `Emitted publishable code failed to type-check (${diagnostics.length} error(s)). ` +
          `A component ships broken code — e.g. a base file destructures a tv slot the ` +
          `emitted config dropped (the #477 field-slot regression). First errors:\n\n${shown}`,
      )
    }
    if (!process.env.KEEP_SMOKE_FIXTURE) {
      rmSync(FIXTURE_DIR, { recursive: true, force: true })
    }
  },
)
