import type { Ref } from "react"

import { Kbd } from "@/registry/ui/kbd"

import { clamp01, ease, hold, lerp, progress } from "../../lib/motion"
import { Theme } from "../../lib/theme"
import { TYPE } from "../../lib/type"
import { LOOK, LOOK_MODE } from "./steps"

/* What the keyboard and a screen reader get for free: a key pressed on the
   beat, and the announcement read straight off the live DOM (the label and
   description React Aria wired to the input, the button's name). Proof, so
   it lands at the film's CTA size: legend and caption at TYPE.cta. */

const SANS = '"Geist Variable", ui-sans-serif, system-ui, sans-serif'
const KEY_ZOOM = 3
const CAPTION = TYPE.cta
const ROW_H = 120
const PILL_PAD = { left: 30, right: 38 }
const ICON_GAP = 20

/** Sizes the caption pill to its longest announcement (set imperatively). */
export function fitRow(row: HTMLElement) {
  const pill = row.querySelector<HTMLElement>("[data-pill]")
  if (!pill) return
  const widest = Math.max(
    0,
    ...[...row.querySelectorAll<HTMLElement>("[data-said]")].map(
      (el) => el.offsetWidth,
    ),
  )
  pill.style.width = `${PILL_PAD.left + CAPTION + ICON_GAP + widest + PILL_PAD.right}px`
}

export function A11yRow({
  ref,
  frame,
  keys,
  lines,
  from,
  to,
  refs,
}: {
  /** The row's `top` (px) is set on this node by the caller. */
  ref?: Ref<HTMLDivElement>
  frame: number
  /** Beat frames a key goes down on, and which key. */
  keys: ReadonlyArray<readonly [number, string]>
  /** When each announcement takes over. */
  lines: readonly number[]
  from: number
  to: number
  refs: ReadonlyArray<Ref<HTMLSpanElement>>
}) {
  const inT = progress(frame, from, 22, ease.out)
  const outT = progress(frame, to, 14, ease.in)
  const shown = inT * (1 - outT)
  const label = hold(frame, [[-Infinity, keys[0]![1]], ...keys])
  const down = keys.reduce((acc, [p]) => {
    const d = frame - p
    return d >= -2 && d < 12
      ? Math.max(acc, d < 2 ? clamp01((d + 2) / 4) : 1 - ease.out((d - 2) / 10))
      : acc
  }, 0)
  const blur = (1 - inT) * 8 + outT * 8
  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: "50%",
        display: shown > 0 ? "flex" : "none",
        alignItems: "center",
        gap: 28,
        opacity: shown,
        filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        transform: `translateX(-50%) translateY(${(1 - inT) * 14}px)`,
      }}
    >
      <div
        style={{
          transform: `translateY(${down * 2}px) scale(${1 - down * 0.04})`,
          zoom: KEY_ZOOM,
          height: ROW_H / KEY_ZOOM,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Theme mode={LOOK_MODE} state={{ ...LOOK, kbdTreatment: "keycap" }}>
          <Kbd className="h-10 min-w-16 justify-center px-3 font-sans text-base text-fg">
            {label}
          </Kbd>
        </Theme>
      </div>
      <div
        data-pill=""
        style={{
          position: "relative",
          // The key comes first; the reader's line opens as it's pressed.
          opacity: progress(frame, lines[0]! - 4, 14, ease.out),
          height: ROW_H,
          padding: `0 ${PILL_PAD.right}px 0 ${PILL_PAD.left}px`,
          display: "flex",
          alignItems: "center",
          gap: ICON_GAP,
          borderRadius: 30,
          background: "rgba(255,255,255,0.07)",
          boxShadow:
            "inset 0 0 0 1px rgba(255,255,255,0.1), 0 24px 60px -24px rgba(0,0,0,0.8)",
          fontFamily: SANS,
          fontSize: CAPTION,
          letterSpacing: "-0.02em",
          color: "#fafafa",
        }}
      >
        <Speaker />
        <div style={{ position: "relative", flex: 1, height: ROW_H }}>
          {lines.map((at, i) => {
            const next = lines[i + 1] ?? Infinity
            const t = progress(frame, at + (i ? 5 : 0), 16, ease.out)
            const gone = progress(frame, next, 8, ease.in)
            const o = t * (1 - gone)
            return (
              <span
                key={at}
                ref={refs[i]}
                data-said=""
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  lineHeight: `${ROW_H}px`,
                  whiteSpace: "nowrap",
                  opacity: o,
                  filter:
                    o < 0.99
                      ? `blur(${Math.min(8, lerp(8, 0, t) + gone * 8)}px)`
                      : undefined,
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

function Speaker() {
  return (
    <svg
      width={CAPTION}
      height={CAPTION}
      viewBox="0 0 24 24"
      fill="none"
      stroke="rgba(250,250,250,0.55)"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flex: "none" }}
    >
      <path d="M11 4.7a.7.7 0 0 0-1.2-.5L6.4 7.6A1.4 1.4 0 0 1 5.4 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.4a1.4 1.4 0 0 1 1 .4l3.4 3.4a.7.7 0 0 0 1.2-.5z" />
      <path d="M16 9a5 5 0 0 1 0 6" />
      <path d="M19.4 18.4a9 9 0 0 0 0-12.8" />
    </svg>
  )
}

/** "Email, edit text, No spam, ever." — the input's accessible name, role and description. */
export function announce(el: HTMLElement): string {
  const byIds = (attr: string) =>
    (el.getAttribute(attr) ?? "")
      .split(" ")
      .map((id) => el.ownerDocument.getElementById(id)?.textContent ?? "")
      .filter(Boolean)
      .join(" ")
  const name =
    el.getAttribute("aria-label") ??
    (byIds("aria-labelledby") ||
      (el as HTMLInputElement).labels?.[0]?.textContent ||
      el.textContent ||
      "")
  const role = el.tagName === "INPUT" ? "edit text" : "button"
  const description = byIds("aria-describedby")
  return [name.trim(), role, description].filter(Boolean).join(", ")
}
