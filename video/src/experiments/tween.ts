import type { StudioState } from "@/modules/studio/axes"

import type { State } from "../lib/theme"

/* Tweens studio state itself: numbers glide, hex colors glide through OKLab,
   and every other axis (density, fonts, variants) comes from one side.
   Each frame is then a real design system the engine resolves, so colors keep
   their generated pairings (text stays legible on its fill). Values are
   quantized: every distinct state adds a stylesheet. */

const HEX = /^#[0-9a-f]{6}$/i

const srgbToLinear = (c: number) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
const linearToSrgb = (c: number) =>
  c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055

function toOklab(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) =>
    srgbToLinear(Number.parseInt(hex.slice(i, i + 2), 16) / 255),
  ) as [number, number, number]
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ] as const
}

function toHex([L, A, B]: readonly number[]) {
  const l = (L! + 0.3963377774 * A! + 0.2158037573 * B!) ** 3
  const m = (L! - 0.1055613458 * A! - 0.0638541728 * B!) ** 3
  const s = (L! - 0.0894841775 * A! - 1.291485548 * B!) ** 3
  const rgb = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
  return `#${rgb
    .map((c) =>
      Math.round(Math.min(1, Math.max(0, linearToSrgb(c))) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`
}

/** `discrete` picks the side the non-numeric axes come from; by default they
 *  switch at the midpoint. */
export function tweenState(
  a: StudioState,
  b: StudioState,
  t: number,
  discrete: "a" | "b" | "mid" = "mid",
): State {
  if (t <= 0 && discrete !== "b") return a
  if (t >= 1 && discrete !== "a") return b
  const out: Record<string, unknown> = {}
  for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const x = (a as Record<string, unknown>)[key]
    const y = (b as Record<string, unknown>)[key]
    if (typeof x === "number" && typeof y === "number") {
      out[key] = Math.round((x + (y - x) * t) * 100) / 100
    } else if (
      typeof x === "string" &&
      typeof y === "string" &&
      HEX.test(x) &&
      HEX.test(y)
    ) {
      const p = toOklab(x)
      const q = toOklab(y)
      out[key] = toHex(p.map((v, i) => v + (q[i]! - v) * t))
    } else {
      const side = discrete === "mid" ? (t < 0.5 ? "a" : "b") : discrete
      out[key] = side === "a" ? x : y
    }
  }
  return out as State
}
