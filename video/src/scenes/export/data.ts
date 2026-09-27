import { random } from "../../lib/motion"

/* Scene-local frames; discrete events sit on beats (multiples of 30). */

export const T = {
  typeFrom: 12,
  paste: 60,
  enter: 90,
  created: 150,
  fly: 180,
  open: 240,
  headline: 248,
  pill: 300,
} as const

/* github-dark, the palette the site's highlighter paints code with. */
export const C = {
  fg: "#e1e4e8",
  muted: "#8b949e",
  dim: "#6a737d",
  faint: "#484f58",
  green: "#85e89d",
  blue: "#79b8ff",
  string: "#9ecbff",
} as const

export const MONO = '"Geist Mono", ui-monospace, monospace'
export const SANS = '"Geist Variable", ui-sans-serif, system-ui, sans-serif'

export const TERM = {
  w: 1240,
  h: 576,
  bar: 52,
  padX: 36,
  padY: 26,
  font: 24,
  line: 36,
  rows: 13,
} as const

/** Geist Mono's advance: 0.6em. */
export const CH = TERM.font * 0.6

export const PROMPT = "~/my-app"
export const TYPED = "npx shadcn@latest init "
export const PASTED = '"https://dotui.org/r/init?preset=q1YqU7Iy0V"'

/** Frame each typed key lands on: 1–2 frames a key, longer after a space. */
export const KEYS: number[] = (() => {
  let f = T.typeFrom
  return [...TYPED].map((c, i) => {
    const at = f
    f += 1 + (random(i, 17) < 0.5 ? 1 : 0) + (c === " " ? 2 : 0)
    return at
  })
})()

type Seg = readonly [text: string, color?: string]
export type OutLine = {
  at: number
  /** Spinner until this frame, then a check (steps only). */
  done?: number
  kind: "step" | "file" | "text"
  segs: Seg[]
  file?: string
}

const STEPS: Array<[Seg[], number]> = [
  [[["Preflight checks."]], 6],
  [[["Verifying framework. Found "], ["Next.js", C.blue], ["."]], 6],
  [[["Validating Tailwind CSS config. Found "], ["v4", C.blue], ["."]], 7],
  [[["Validating import alias."]], 4],
  [[["Writing components.json."]], 5],
  [[["Checking registry."]], 8],
  [[["Updating CSS variables in "], ["app/globals.css", C.blue]], 6],
  [[["Installing dependencies."]], 13],
]

export const FILES = [
  "avatar.tsx",
  "badge.tsx",
  "button.tsx",
  "calendar.tsx",
  "card.tsx",
  "checkbox.tsx",
  "dialog.tsx",
  "input.tsx",
  "menu.tsx",
  "select.tsx",
  "switch.tsx",
  "tabs.tsx",
] as const

/** Column where a file line's name starts: `  - components/ui/`. */
export const FILE_COL = 18

export const OUTPUT: OutLine[] = (() => {
  const out: OutLine[] = []
  let f = T.enter + 4
  for (const [segs, d] of STEPS) {
    out.push({ at: f, done: f + d, kind: "step", segs })
    f += d
  }
  out.push({
    at: T.created,
    done: T.created,
    kind: "step",
    segs: [[`Created ${FILES.length} files:`]],
  })
  FILES.forEach((file, i) =>
    out.push({
      at: T.created + 3 + i * 2,
      kind: "file",
      file,
      segs: [
        ["  - components/ui/", C.dim],
        [file, C.fg],
      ],
    }),
  )
  const end = T.fly + 34
  out.push({ at: end, kind: "text", segs: [[""]] })
  out.push({
    at: end,
    kind: "text",
    segs: [["Success!", C.green], [" Project initialization completed."]],
  })
  out.push({
    at: end + 4,
    kind: "text",
    segs: [["You may now add components.", C.muted]],
  })
  return out
})()

/** Output line index (1-based, the command is line 0) of each file. */
export const FILE_LINE = FILES.map(
  (file) => OUTPUT.findIndex((l) => l.file === file) + 1,
)

/** Frame each file lifts out of the terminal. */
export const FLY_AT = FILES.map((_, i) => T.fly + i * 3)
export const FLIGHT = 34

export const EDITOR = {
  w: 1080,
  h: 740,
  bar: 44,
  side: 272,
  tabs: 42,
  row: 28,
  treeTop: 116,
  font: 18,
  line: 30,
  gutter: 64,
} as const

/** Tree rows in order; `files` expands into the landed components. */
export type TreeRow =
  | { kind: "folder"; name: string; depth: number; open: boolean }
  | { kind: "file"; name: string; depth: number; lang: "tsx" | "json" }
  | { kind: "files" }

export const TREE: TreeRow[] = [
  { kind: "folder", name: "app", depth: 0, open: false },
  { kind: "folder", name: "components", depth: 0, open: true },
  { kind: "folder", name: "ui", depth: 1, open: true },
  { kind: "files" },
  { kind: "folder", name: "hooks", depth: 0, open: false },
  { kind: "folder", name: "lib", depth: 0, open: false },
  { kind: "file", name: "components.json", depth: 0, lang: "json" },
  { kind: "file", name: "package.json", depth: 0, lang: "json" },
  { kind: "file", name: "tsconfig.json", depth: 0, lang: "json" },
]

/** x of a row's name, editor-local: padding, indent, chevron, icon, gap. */
export const nameX = (depth: number) => 14 + depth * 14 + 16 + 16 + 7
