/* A phone with the overlay where it lands on mobile, for the On mobile rows. */

import type { DialSelectOption } from "../dial"
import { DialGlyph } from "../dial"

/** A phone with the layer drawn where it lands: anchored under a field,
 *  docked at the bottom, floating mid-screen, or filling it. */
function PhoneGlyph({ layer }: { layer: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="6"
        y="2"
        width="12"
        height="20"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity=".45"
      />
      {layer !== "anchored" && (
        <rect
          x="6.75"
          y="2.75"
          width="10.5"
          height="18.5"
          rx="1.75"
          fill="currentColor"
          fillOpacity=".15"
        />
      )}
      {layer === "anchored" && (
        <>
          <path
            d="M8.5 6.5h7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <rect x="8" y="9" width="8" height="6" rx="1" fill="currentColor" />
        </>
      )}
      {(layer === "drawer" || layer === "sheet") && (
        <path
          d="M6.75 15.5a1.5 1.5 0 0 1 1.5-1.5h7.5a1.5 1.5 0 0 1 1.5 1.5v5.75H6.75z"
          fill="currentColor"
        />
      )}
      {layer === "fullscreen" && (
        <rect
          x="6.75"
          y="2.75"
          width="10.5"
          height="18.5"
          rx="1.75"
          fill="currentColor"
        />
      )}
      {layer === "center" && (
        <rect x="8.5" y="9.5" width="7" height="5" rx="1" fill="currentColor" />
      )}
    </svg>
  )
}

export const withPhoneGlyphs = (
  options: { value: string; label: string }[],
): DialSelectOption[] =>
  options.map((o) => ({
    ...o,
    preview: (
      <DialGlyph>
        <PhoneGlyph layer={o.value} />
      </DialGlyph>
    ),
  }))
