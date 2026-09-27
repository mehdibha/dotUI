/* The wall as a grid map: one character per cell, a tile spans every cell
   that carries its character. `.` leaves a hole. */

export const CELL_W = 232
export const CELL_H = 144
export const GAP = 16
export const PITCH_X = CELL_W + GAP
export const PITCH_Y = CELL_H + GAP

const MAP = [
  "7788!!@@##%%",
  "aabccdeeffgh",
  "iCCjkklmnnoo",
  "iCCqrrstNNuv",
  "wxxyzRABNNDE",
  "FGGHIRJJKKLL",
  "OPPQSSTUVVWX",
  "YZZ12234456~",
  "&&**==??<<>>",
]

const LEGEND: Record<string, string> = {
  a: "view",
  b: "kbd",
  c: "timezone",
  d: "like",
  e: "range",
  f: "status",
  g: "icons",
  h: "loader",
  i: "list",
  C: "calendar",
  j: "checkbox2",
  k: "tabs",
  l: "primary",
  m: "kbd2",
  n: "subscribe",
  o: "tags",
  q: "switch2",
  r: "email",
  s: "toggle",
  t: "danger",
  N: "card",
  u: "avatar",
  v: "badges",
  w: "upload",
  x: "number",
  y: "switch",
  z: "secondary",
  R: "radio",
  A: "checkbox",
  B: "format",
  D: "quiet",
  E: "ai",
  F: "avatars",
  G: "search",
  H: "badges",
  I: "primary",
  J: "select",
  K: "slider",
  L: "subscribe",
  O: "kbd",
  P: "segmented",
  Q: "like",
  S: "progress",
  T: "share",
  U: "danger",
  V: "password",
  W: "switch",
  X: "status",
  Y: "loader",
  Z: "timezone",
  "1": "toggle",
  "2": "tags",
  "3": "checkbox",
  "4": "range",
  "5": "view",
  "6": "notify",
  "7": "alert",
  "8": "date",
  "!": "otp",
  "@": "secondary",
  "#": "breadcrumbs",
  "%": "avatar",
  "~": "kbd2",
  "&": "search",
  "*": "number",
  "=": "email",
  "?": "range",
  "<": "segmented",
  ">": "tags",
}

export type Tile = {
  id: string
  kind: string
  /** Top-left in wall px. */
  x: number
  y: number
  w: number
  h: number
}

function parse(): Tile[] {
  const seen = new Map<
    string,
    { c0: number; r0: number; c1: number; r1: number }
  >()
  MAP.forEach((row, r) => {
    ;[...row].forEach((ch, c) => {
      if (ch === ".") return
      const box = seen.get(ch)
      if (!box) seen.set(ch, { c0: c, r0: r, c1: c, r1: r })
      else {
        box.c1 = Math.max(box.c1, c)
        box.r1 = Math.max(box.r1, r)
      }
    })
  })
  return [...seen].map(([ch, { c0, r0, c1, r1 }]) => ({
    id: ch,
    kind: LEGEND[ch]!,
    x: c0 * PITCH_X,
    y: r0 * PITCH_Y,
    w: (c1 - c0 + 1) * PITCH_X - GAP,
    h: (r1 - r0 + 1) * PITCH_Y - GAP,
  }))
}

export const TILES_LAYOUT = parse()
export const WALL_W = MAP[0]!.length * PITCH_X - GAP
export const WALL_H = MAP.length * PITCH_Y - GAP
