import { random } from "../../lib/motion"

/* Scene-local frames. Discrete events sit on beats (multiples of 30). */
export const T = {
  /** The init command started typing before the cut. */
  typeFrom: -18,
  paste: 30,
  enter: 60,
  addEnter: 150,
  fly: 180,
  open: 240,
  closer: 232,
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
  folder: "#c9a26d",
  json: "#e3b341",
} as const

export const MONO = '"Geist Mono", ui-monospace, monospace'
export const SANS = '"Geist Variable", ui-sans-serif, system-ui, sans-serif'

/* The terminal, in design px. `zoom` is its native render scale: the most it
   is ever magnified on screen, so the 3D layer never upscales. */
export const TERM = {
  cols: 86,
  rows: 18,
  font: 24,
  line: 36,
  padX: 36,
  padY: 24,
  bar: 52,
  zoom: 1.72,
} as const
/** Geist Mono's advance: 0.6em. */
export const CH = TERM.font * 0.6
export const TERM_W = Math.round(TERM.padX * 2 + TERM.cols * CH)
export const TERM_H = TERM.bar + TERM.padY * 2 + TERM.rows * TERM.line

export const PROMPT = "~/my-app"
/** Prompt columns: `~/my-app ❯ `. */
export const PROMPT_COLS = PROMPT.length + 3

/** The Origin preset, encoded — the real token /studio hands out. */
export const TOKEN =
  "q1YqU7Iy0VEqVrKqVkoqSsxLUbJSUjYwMDdKM1XSUUoqLSnJz3POz8kvAoonJien5pUAhZMzUpOzk_IrMCSKElMy8zFEi1NzUpNLMrEYBJcJTk1Ftbk4JzMltQhTQ3lmSXIGmnBtLQA"
export const INIT_TYPED = "npx shadcn@latest init "
export const INIT_PASTED = `"https://dotui.org/r/init?preset=${TOKEN}"`
export const ADD_TYPED =
  "npx shadcn@latest add @dotui/button @dotui/card @dotui/select"

/** Frame each typed key lands on, from `from`; `gap` spaces the keys. */
function keyFrames(
  text: string,
  from: number,
  seed: number,
  gap: (char: string, r: number) => number,
) {
  let f = from
  return [...text].map((c, i) => {
    const at = f
    f += gap(c, random(i, seed))
    return Math.floor(at)
  })
}

export const INIT_KEYS = keyFrames(
  INIT_TYPED,
  T.typeFrom,
  17,
  (c, r) => 1 + (r < 0.45 ? 1 : 0) + (c === " " ? 2 : 0),
)

type Seg = readonly [text: string, color?: string]
export type OutLine = {
  at: number
  /** Spinner until this frame, then a check (steps only). */
  done?: number
  kind: "step" | "file" | "text" | "command"
  segs: Seg[]
  /** File lines: index into FILES. */
  file?: number
}

/* What the add writes — @dotui/button, card and select with their registry
   dependencies, as the CLI lists them. `dir` is the path before the name. */
export const FILES = [
  { name: "button.tsx", dir: "src/components/ui/" },
  { name: "loader.tsx", dir: "src/components/ui/" },
  { name: "card.tsx", dir: "src/components/ui/" },
  { name: "text.tsx", dir: "src/components/ui/" },
  { name: "select.tsx", dir: "src/components/ui/" },
  { name: "field.tsx", dir: "src/components/ui/" },
  { name: "list-box.tsx", dir: "src/components/ui/" },
  { name: "popover.tsx", dir: "src/components/ui/" },
  { name: "focus-styles.ts", dir: "src/lib/" },
] as const

type Step = readonly [segs: Seg[], frames: number]

const INIT_STEPS: Step[] = [
  [[["Preflight checks."]], 3],
  [[["Verifying framework. Found "], ["Next.js", C.blue], ["."]], 3],
  [[["Validating Tailwind CSS config. Found "], ["v4", C.blue], ["."]], 4],
  [[["Validating import alias."]], 3],
  [[["Writing components.json."]], 3],
  [[["Checking registry."]], 5],
  [[["Updating CSS variables in "], ["src/app/globals.css", C.blue]], 3],
  [[["Installing dependencies."]], 7],
]

/** Rows the wrapped init command takes. */
export const INIT_ROWS = Math.ceil(
  (PROMPT_COLS + INIT_TYPED.length + INIT_PASTED.length) / TERM.cols,
)

/* Every row after the init command, in order; row = INIT_ROWS + index. */
export const OUTPUT: OutLine[] = (() => {
  const out: OutLine[] = []
  let f = T.enter + 2
  for (const [segs, d] of INIT_STEPS) {
    out.push({ at: f, done: f + d, kind: "step", segs })
    f += d
  }
  out.push({ at: f, done: f, kind: "step", segs: [["Created 1 file:"]] })
  out.push({
    at: f + 2,
    kind: "text",
    segs: [
      ["  - ", C.dim],
      ["src/lib/", C.dim],
      ["utils.ts", C.fg],
    ],
  })
  out.push({ at: f + 4, kind: "text", segs: [] })
  out.push({
    at: f + 4,
    kind: "text",
    segs: [["Success!", C.green], [" Project initialization completed."]],
  })
  out.push({
    at: f + 6,
    kind: "text",
    segs: [["You may now add components.", C.muted]],
  })
  out.push({ at: f + 8, kind: "text", segs: [] })
  out.push({ at: f + 10, kind: "command", segs: [] })
  f = T.addEnter + 1
  out.push({
    at: f,
    done: f + 6,
    kind: "step",
    segs: [["Checking registry."]],
  })
  out.push({
    at: f + 6,
    done: f + 16,
    kind: "step",
    segs: [["Installing dependencies."]],
  })
  f += 16
  out.push({
    at: f,
    done: f,
    kind: "step",
    segs: [[`Created ${FILES.length} files:`]],
  })
  FILES.forEach((file, i) =>
    out.push({
      at: f + 2 + i * 2,
      kind: "file",
      file: i,
      segs: [
        ["  - ", C.dim],
        [file.dir, C.dim],
        [file.name, C.fg],
      ],
    }),
  )
  return out
})()

/** Row of the add command, and the frame its prompt appears. */
export const ADD_ROW =
  INIT_ROWS + OUTPUT.findIndex((line) => line.kind === "command")
export const ADD_PROMPT_AT = OUTPUT.find((l) => l.kind === "command")!.at
export const ADD_KEYS = keyFrames(ADD_TYPED, ADD_PROMPT_AT + 3, 29, (_, r) =>
  r < 0.7 ? 0.5 : 0.75,
)

/** The prompt that comes back when the add is done. */
export const IDLE_AT = OUTPUT[OUTPUT.length - 1]!.at + 8
export const IDLE_ROW = INIT_ROWS + OUTPUT.length

/** Terminal row of each file line. */
export const FILE_ROW = FILES.map(
  (_, i) => INIT_ROWS + OUTPUT.findIndex((l) => l.file === i),
)
/** Column where each file's name starts. */
export const FILE_COL = FILES.map((f) => 4 + f.dir.length)

/** Frame each file lifts out of the terminal, and its flight length. */
export const FLY_AT = FILES.map((_, i) => T.fly + i * 4)
export const FLIGHT = 42

/* The editor, in design px. */
export const EDITOR = {
  w: 1180,
  h: 800,
  bar: 46,
  side: 312,
  tabs: 50,
  row: 32,
  tree: 18,
  treeTop: 112,
  indent: 16,
  font: 22,
  line: 36,
  gutter: 70,
  zoom: 1.25,
} as const

/** Tree rows in order. `after` rows open (slot grows) when file `after` lands. */
export type TreeRow = {
  name: string
  depth: number
  kind: "folder" | "file"
  open?: boolean
  /** A landed file: index into FILES. */
  file?: number
  /** Folder or file that only exists once this file lands. */
  after?: number
}

const UI_FILES = FILES.map((f, i) => ({ ...f, i }))
  .filter((f) => f.dir.endsWith("ui/"))
  .sort((a, b) => a.name.localeCompare(b.name))

export const TREE: TreeRow[] = [
  { name: "src", depth: 0, kind: "folder", open: true },
  { name: "app", depth: 1, kind: "folder" },
  { name: "components", depth: 1, kind: "folder", open: true, after: 0 },
  { name: "ui", depth: 2, kind: "folder", open: true, after: 0 },
  ...UI_FILES.map(
    (f): TreeRow => ({ name: f.name, depth: 3, kind: "file", file: f.i }),
  ),
  { name: "lib", depth: 1, kind: "folder" },
  { name: "public", depth: 0, kind: "folder" },
  { name: "components.json", depth: 0, kind: "file" },
  { name: "next.config.ts", depth: 0, kind: "file" },
  { name: "package.json", depth: 0, kind: "file" },
  { name: "tsconfig.json", depth: 0, kind: "file" },
]

/** Tree row each file lands on: its own row, or its (collapsed) folder. */
export const LAND_ROW = FILES.map((f, i) => {
  const own = TREE.findIndex((r) => r.file === i)
  return own >= 0 ? own : TREE.findIndex((r) => r.name === "lib")
})

/** x of a row's name, editor-local: padding, indent, chevron, icon, gap. */
export const nameX = (depth: number) => 16 + depth * EDITOR.indent + 20 + 22 + 8
