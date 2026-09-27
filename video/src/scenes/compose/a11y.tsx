import type { Ref } from "react"

import { Kbd } from "@/registry/ui/kbd"

import { clamp01, ease, hold, lerp, progress } from "../../lib/motion"
import { Theme } from "../../lib/theme"

/* What the keyboard and a screen reader get for free: a key pressed on the
   beat, and the announcement read straight off the live DOM (the label and
   description React Aria wired to the input, the button's name). Sized for a
   phone: the keycap's legend and the caption land at 33–34 px. */

const SANS = '"Geist Variable", ui-sans-serif, system-ui, sans-serif'
const KEY_ZOOM = 3
const CAPTION = 34
const PILL_H = 84
const PILL_W = 720

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
  const blur = (1 - inT) * 10 + outT * 10
  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: "50%",
        display: shown > 0 ? "flex" : "none",
        alignItems: "center",
        gap: 26,
        opacity: shown,
        filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        transform: `translateX(-50%) translateY(${(1 - inT) * 14}px)`,
      }}
    >
      <div
        style={{
          transform: `translateY(${down * 2}px) scale(${1 - down * 0.04})`,
          zoom: KEY_ZOOM,
          width: 44,
          height: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Theme mode="light" state={{ kbdTreatment: "keycap" }}>
          <Kbd className="h-7 w-11 justify-center px-0 text-[0.6875rem]">
            {label}
          </Kbd>
        </Theme>
      </div>
      <div
        style={{
          position: "relative",
          height: PILL_H,
          width: PILL_W,
          padding: "0 30px 0 26px",
          display: "flex",
          alignItems: "center",
          gap: 18,
          borderRadius: 22,
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
        <div style={{ position: "relative", flex: 1, height: PILL_H }}>
          {lines.map((at, i) => {
            const next = lines[i + 1] ?? Infinity
            const t = progress(frame, at + (i ? 5 : 0), 16, ease.out)
            const gone = progress(frame, next, 8, ease.in)
            const o = t * (1 - gone)
            return (
              <span
                key={at}
                ref={refs[i]}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  lineHeight: `${PILL_H}px`,
                  whiteSpace: "nowrap",
                  opacity: o,
                  filter:
                    o < 0.99
                      ? `blur(${lerp(8, 0, t) + gone * 8}px)`
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
