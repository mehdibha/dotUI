import { useEffect, useMemo, useState } from "react"
import { Fragment, jsx, jsxs } from "react/jsx-runtime"
import { createFileRoute } from "@tanstack/react-router"
import type { Element, ElementContent, Root, RootContent } from "hast"
import { toJsxRuntime } from "hast-util-to-jsx-runtime"
import { createHighlighterCoreSync } from "shiki/core"
import { createJavaScriptRegexEngine } from "shiki/engine/javascript"
import tsx from "shiki/langs/tsx.mjs"
import githubDark from "shiki/themes/github-dark.mjs"
import githubLight from "shiki/themes/github-light.mjs"

import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { Pre } from "@/modules/docs/code-block"
import { highlightTsx } from "@/modules/docs/highlight"
import { InternalHeader } from "@/modules/internal/shell"

export const Route = createFileRoute("/internal/highlight-compare")({
  component: HighlightCompare,
  head: () => ({ meta: [{ title: "Highlight compare · Internal · dotUI" }] }),
})

// Every playground source the docs highlight at runtime, old (shiki) vs new
// (sugar-high), with each character whose color differs marked in the new
// column. Temporary — review aid for the sugar-high migration.

const shiki = createHighlighterCoreSync({
  langs: [tsx],
  themes: [githubLight, githubDark],
  engine: createJavaScriptRegexEngine({ forgiving: true }),
})

function highlightShiki(code: string): Root {
  return shiki.codeToHast(code, {
    lang: "tsx",
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  })
}

const sources = import.meta.glob("/src/registry/ui/*/demos/playground.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>

type Mode = "light" | "dark"
type Char = { ch: string; light: string | null; dark: string | null }

function parseColors(style: unknown): [string | null, string | null] {
  const s = typeof style === "string" ? style : ""
  const light = /--shiki-light:\s*([^;]+)/i.exec(s)?.[1]?.trim() ?? null
  const dark = /--shiki-dark:\s*([^;]+)/i.exec(s)?.[1]?.trim() ?? null
  return [light?.toLowerCase() ?? null, dark?.toLowerCase() ?? null]
}

function flatten(root: Root): Char[] {
  const out: Char[] = []
  const walk = (
    node: RootContent,
    light: string | null,
    dark: string | null,
  ) => {
    if (node.type === "text") {
      for (const ch of node.value) out.push({ ch, light, dark })
      return
    }
    if (node.type !== "element") return
    const [l, d] = parseColors(node.properties?.style)
    for (const child of node.children) walk(child, l ?? light, d ?? dark)
  }
  for (const child of root.children) walk(child, null, null)
  return out
}

function mismatches(a: Char[], b: Char[], mode: Mode): boolean[] {
  return b.map((c, i) => {
    if (/\s/.test(c.ch)) return false
    const o = a[i]
    return !o || o.ch !== c.ch || o[mode] !== c[mode]
  })
}

// Split token text nodes so mismatched characters get their own marked span.
function markMismatches(root: Root, flags: boolean[]): Root {
  let i = 0
  const walk = (node: Element) => {
    node.children = node.children.flatMap((child) => {
      if (child.type === "text") {
        const parts: ElementContent[] = []
        let run = ""
        let runFlag: boolean | null = null
        const flush = () => {
          if (!run) return
          parts.push(
            runFlag
              ? {
                  type: "element",
                  tagName: "mark",
                  properties: { className: ["mismatch"] },
                  children: [{ type: "text", value: run }],
                }
              : { type: "text", value: run },
          )
          run = ""
        }
        for (const ch of child.value) {
          const flag = flags[i++] ?? false
          if (runFlag !== null && flag !== runFlag) flush()
          runFlag = flag
          run += ch
        }
        flush()
        return parts
      }
      if (child.type === "element") walk(child)
      return [child]
    })
  }
  for (const child of root.children) if (child.type === "element") walk(child)
  return root
}

function render(root: Root, className?: string) {
  return toJsxRuntime(root, {
    Fragment,
    jsx,
    jsxs,
    components: {
      pre: (props) => (
        <Pre {...props} className={cn(props.className, className)} />
      ),
    },
  })
}

interface Sample {
  name: string
  code: string
  old: Root
  next: Root
  chars: number
  diff: Record<Mode, number>
  marked: Record<Mode, Root>
}

function buildSamples(): Sample[] {
  return Object.entries(sources)
    .map(([file, code]) => {
      const name = file.split("/ui/")[1]?.split("/")[0] ?? file
      const old = highlightShiki(code)
      const next = highlightTsx(code)
      const a = flatten(old)
      const b = flatten(next)
      const chars = b.filter((c) => !/\s/.test(c.ch)).length
      const flags = {
        light: mismatches(a, b, "light"),
        dark: mismatches(a, b, "dark"),
      }
      return {
        name,
        code,
        old,
        next,
        chars,
        diff: {
          light: flags.light.filter(Boolean).length,
          dark: flags.dark.filter(Boolean).length,
        },
        marked: {
          light: markMismatches(structuredClone(next), flags.light),
          dark: markMismatches(structuredClone(next), flags.dark),
        },
      }
    })
    .sort((x, y) => y.diff.light / y.chars - x.diff.light / x.chars)
}

function HighlightCompare() {
  const samples = useMemo(buildSamples, [])
  const [mode, setMode] = useState<Mode>("light")
  useEffect(() => {
    if (window.location.hash === "#dark") setMode("dark")
  }, [])
  const [onlyDiff, setOnlyDiff] = useState(false)
  const total = samples.reduce((n, s) => n + s.chars, 0)
  const diff = samples.reduce((n, s) => n + s.diff[mode], 0)
  const shown = onlyDiff ? samples.filter((s) => s.diff[mode] > 0) : samples

  return (
    <div className="min-h-screen bg-bg text-fg">
      <InternalHeader
        className="px-6 pt-10 pb-6"
        crumbs={[{ label: "Highlight compare" }]}
        title="Highlight compare"
        description="Runtime TSX highlighting: shiki (old, left) vs sugar-high (new, right). Characters whose color differs are marked in the right column."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={mode === "light" ? "primary" : "secondary"}
              onPress={() => setMode("light")}
            >
              Light
            </Button>
            <Button
              size="sm"
              variant={mode === "dark" ? "primary" : "secondary"}
              onPress={() => setMode("dark")}
            >
              Dark
            </Button>
            <Button
              size="sm"
              variant={onlyDiff ? "primary" : "secondary"}
              onPress={() => setOnlyDiff((v) => !v)}
            >
              Only differing
            </Button>
          </div>
        }
      />
      <div className="space-y-10 px-6 pb-24">
        <p className="text-sm text-fg-muted">
          {samples.length} playground files · {total} characters · {diff}{" "}
          colored differently ({((100 * diff) / total).toFixed(1)}%) in {mode}{" "}
          mode.
        </p>
        <table className="text-sm">
          <thead className="text-left text-fg-muted">
            <tr>
              <th className="pr-6 font-medium">file</th>
              <th className="pr-6 font-medium">chars</th>
              <th className="pr-6 font-medium">light</th>
              <th className="pr-6 font-medium">dark</th>
            </tr>
          </thead>
          <tbody className="font-mono text-[0.8125rem]">
            {samples.map((s) => (
              <tr key={s.name}>
                <td className="pr-6">
                  <a href={`#${s.name}`}>{s.name}</a>
                </td>
                <td className="pr-6 tabular-nums">{s.chars}</td>
                <td className="pr-6 tabular-nums">
                  {s.diff.light} ({((100 * s.diff.light) / s.chars).toFixed(1)}
                  %)
                </td>
                <td className="pr-6 tabular-nums">
                  {s.diff.dark} ({((100 * s.diff.dark) / s.chars).toFixed(1)}%)
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          data-mode={mode}
          className="space-y-8 **:[mark.mismatch]:rounded-xs **:[mark.mismatch]:bg-transparent **:[mark.mismatch]:text-inherit **:[mark.mismatch]:outline-1 **:[mark.mismatch]:outline-red-500"
        >
          {shown.map((s) => (
            <section key={s.name} id={s.name} className="space-y-2">
              <h2 className="font-mono text-sm">
                {s.name}/demos/playground.tsx ·{" "}
                <span className="text-fg-muted">
                  {s.diff[mode]} of {s.chars} differ
                </span>
              </h2>
              <div
                className="grid grid-cols-2 gap-4"
                style={{ color: mode === "light" ? "#24292e" : "#e1e4e8" }}
              >
                <figure
                  className="overflow-auto rounded-md border"
                  style={{ background: mode === "light" ? "#fff" : "#24292e" }}
                >
                  {render(s.old)}
                </figure>
                <figure
                  className="overflow-auto rounded-md border"
                  style={{ background: mode === "light" ? "#fff" : "#24292e" }}
                >
                  {render(s.marked[mode])}
                </figure>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
