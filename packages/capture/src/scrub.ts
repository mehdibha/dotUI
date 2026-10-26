/* A redacted copy (snapshot.ts) marks each run of visible text instead of
   hiding it. `scrub` keeps the runs the product itself ships, its labels,
   and swaps the rest, what the account wrote or was sent, for fake text of
   the same shape. */
import type { Snapshot } from "./snapshot"

/** Noncharacters, which no page holds: snapshot.ts writes them literally. */
export const MARK = { open: "\uFDD0", close: "\uFDD1" }
const RUN = /\uFDD0([^\uFDD1]*)\uFDD1/g

/** The string literals of a script, and the pieces between their slots:
 *  the words a product ships to every visitor, whitespace collapsed. */
export function literals(js: string): string[] {
  const out: string[] = []
  const LITERAL =
    /"((?:[^"\\\n]|\\.){1,160})"|'((?:[^'\\\n]|\\.){1,160})'|`((?:[^`\\$]|\\.|\$(?!\{)){1,160})`/g
  for (const [, double, single, template] of js.matchAll(LITERAL)) {
    const text = unescapeJs(double ?? single ?? template ?? "")
    // A message with slots shows its pieces apart: "{n} issues", "issues".
    const pieces = text.split(/\{[^{}]*\}|%\d*\$?[sd@]/)
    for (const piece of pieces.length > 1 ? [text, ...pieces] : [text]) {
      const words = normal(piece)
      if (/\p{L}/u.test(words)) out.push(words)
    }
  }
  return out
}

/** The strings that must never show, one per line in the person's file:
 *  folded for matching, and at least 3 characters, or every copy would hit. */
export function privatesOf(text: string): string[] {
  return text
    .split("\n")
    .map((line) => fold(line.trim()))
    .filter((line) => line.length >= 3 && !line.startsWith("#"))
}

/** The copy with each marked run kept or swapped, or null when a private
 *  string survives it: that copy is dropped. */
export function scrub(
  copy: Snapshot,
  words: ReadonlySet<string>,
  privates: readonly string[],
): Snapshot | null {
  // Runs sit escaped: in the HTML, and in the CSS's `content` strings.
  const swap =
    (unescape: (text: string) => string, escape: (text: string) => string) =>
    (_: string, run: string) => {
      const text = unescape(run)
      return escape(keeps(normal(text), words, privates) ? text : fake(text))
    }
  const scrubbed = {
    ...copy,
    html: copy.html.replace(RUN, swap(unescapeHtml, escapeHtml)),
    css: copy.css.replace(RUN, swap(unescapeCss, escapeCss)),
  }
  const plain = fold(
    `${unescapeHtml(scrubbed.html)}\n${unescapeCss(scrubbed.css)}`,
  )
  return privates.some((line) => plain.includes(line)) ? null : scrubbed
}

const keeps = (
  text: string,
  words: ReadonlySet<string>,
  privates: readonly string[],
) =>
  // Punctuation and icon glyphs say nothing.
  !/[\p{L}\p{N}]/u.test(text) ||
  (words.has(text) && !privates.some((line) => fold(text).includes(line)))

const LOREM = (
  "a ad at do et ex id in ut est non qui sed sit amet anim duis elit enim " +
  "esse eu ea quis sint sunt nisi nulla culpa dolor irure ipsum lorem magna " +
  "minim velit aliqua aute cillum dolore fugiat labore mollit tempor veniam " +
  "commodo laboris nostrud officia occaecat pariatur proident deserunt " +
  "eiusmod laborum ullamco consequat cupidatat excepteur incididunt " +
  "voluptate adipiscing consectetur exercitation reprehenderit"
).split(" ")
const NAMES = (
  "Al Bo Ada Ana Eli Kai Max Sam Zoe Alex Ella Finn Jade Leah Luca Mila Noah " +
  "Remy Rosa Theo Avery Blake Casey Ellis Emery Hayes Jules Logan Mason " +
  "Nolan Quinn Reese Riley Rowan Avalon Carter Harper Jordan Morgan Parker " +
  "Taylor Bennett Corbett Everett Hartley Holland Langley Marlowe Sinclair " +
  "Thornton Whitaker Ashworth Pemberton Whitfield Kensington Fairweather"
).split(" ")

/** Each word becomes a word of the same length and case, a name where it is
 *  capitalized; each number, digits of the same count. The same word always
 *  becomes the same one, so a copy still reads as one account's. */
function fake(text: string): string {
  return text
    .replace(/\p{L}+/gu, (word) => {
      const lower = word.toLowerCase()
      const capital = word[0] !== lower[0]
      const pick = pickOf(capital ? NAMES : LOREM, word.length, hash(lower))
      if (word.length > 1 && word === word.toUpperCase() && capital)
        return pick.toUpperCase()
      return capital
        ? pick[0]!.toUpperCase() + pick.slice(1).toLowerCase()
        : pick.toLowerCase()
    })
    .replace(/\p{N}+/gu, (digits) => {
      let seed = hash(digits)
      return [...digits]
        .map((digit, i) => {
          seed = (seed * 31 + 7) >>> 0
          return i === 0 && digits.length > 1 && digit !== "0"
            ? String(1 + (seed % 9))
            : String(seed % 10)
        })
        .join("")
    })
}

function pickOf(list: string[], length: number, seed: number): string {
  const same = list.filter((word) => word.length === length)
  if (same.length) return same[seed % same.length]!
  let out = ""
  for (let i = 0; out.length < length; i++)
    out += LOREM[(seed + i) % LOREM.length]
  return out.slice(0, length)
}

function hash(text: string): number {
  let h = 2166136261
  for (let i = 0; i < text.length; i++)
    h = Math.imul(h ^ text.charCodeAt(i), 16777619)
  return h >>> 0
}

const normal = (text: string) => text.replace(/\s+/g, " ").trim()
const fold = (text: string) =>
  text.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase()

const escapeHtml = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
const unescapeHtml = (text: string) =>
  text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")

const escapeCss = (text: string) =>
  text.replace(/["\\]/g, "\\$&").replace(/\n/g, "\\a ")
const unescapeCss = (text: string) =>
  text.replace(
    /\\(?:([\da-f]{1,6}) ?|(.))/gi,
    (_, code?: string, char?: string) => (code ? point(code) : (char ?? "")),
  )

const unescapeJs = (text: string) =>
  text.replace(
    /\\(?:u\{([\da-f]+)\}|u([\da-f]{4})|x([\da-f]{2})|(.))/gi,
    (_, wide?: string, unit?: string, byte?: string, char?: string) => {
      const code = wide ?? unit ?? byte
      if (code) return point(code)
      return char === "n" || char === "t" ? " " : (char ?? "")
    },
  )

const point = (hex: string) => {
  const code = parseInt(hex, 16)
  return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : "\uFFFD"
}
