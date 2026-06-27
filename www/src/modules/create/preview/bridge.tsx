'use client'

import type { DesignSystem } from '../preset'
import {
  BACKDROP_BLUR_VAR,
  BORDER_WIDTH_VAR,
  FONT_BODY_VAR,
  FONT_HEADING_VAR,
  ICON_STROKE_VAR,
  LETTER_SPACING_VAR,
  MOTION_DURATION_VAR,
  MOTION_ENABLED_VAR,
  SHADOW_INTENSITY_VAR,
  STYLE_FAMILY_VAR,
  TYPE_BASE_VAR,
} from '../studio/tokens'

/* ----------------------------------------------------------------------------
 * Preview live bridge
 *
 * The builder writes its axes as `--ds-*` custom properties, which the
 * DesignSystemProvider sets on the preview document's `:root`. On their own
 * those vars do nothing — this stylesheet is the *consumer* that turns each one
 * into a real, visible change inside the preview iframe. It only ships in the
 * preview, never in the exported system; the publisher resolves these axes into
 * concrete CSS at export time. This is the project's "switchable at runtime,
 * live the moment a consumer reads it" rule, made literal.
 *
 * Scope discipline: these rules target low-specificity utility classes and
 * inherited properties (fonts, border weight, transition tempo, shadow
 * utilities) — never component backgrounds, which carry higher-specificity
 * rules. Color stays the color recipe's job (it re-emits the whole ramp set).
 * -------------------------------------------------------------------------- */

const BRIDGE_CSS = `
/* Base font size — scales rem-based sizing. */
:root { font-size: calc(var(${TYPE_BASE_VAR}, 16) * 1px); }

/* Fonts — body cascades from the document root; headings opt in. A bare token
   value (e.g. "Inter") keeps the Geist stack as fallback so unloaded fonts
   degrade gracefully. */
html, body {
  font-family: var(${FONT_BODY_VAR}, Geist), var(--font-sans);
  letter-spacing: calc(var(${LETTER_SPACING_VAR}, 0) * 1em);
}
h1, h2, h3, h4, h5, h6,
[data-slot$="title"], [data-slot$="heading"] {
  font-family: var(${FONT_HEADING_VAR}, Geist), var(--font-sans);
}

/* Border weight — only the plain border utility (1px); border-0 and directional
   borders are untouched. */
[class~="border"] { border-width: calc(var(${BORDER_WIDTH_VAR}, 1) * 1px); }

/* Icon stroke — CSS wins over lucide's stroke-width presentation attribute. */
svg.lucide { stroke-width: var(${ICON_STROKE_VAR}, 2); }

/* Motion tempo — one global transition speed, plus a hard off switch. */
*, *::before, *::after {
  transition-duration: calc(var(${MOTION_DURATION_VAR}, 150) * 1ms);
}
[data-ds-motion="off"] *,
[data-ds-motion="off"] *::before,
[data-ds-motion="off"] *::after {
  transition-duration: 0s !important;
  animation-duration: 0s !important;
  animation-iteration-count: 1 !important;
}

/* Style family — a wrapper data-attr toggles the elevation language across every
   shadowed surface (cards, popovers, menus) at once. */
[data-ds-style="flat"] [class*="shadow-"]:not([class*="shadow-shine"]) {
  box-shadow: none !important;
}
[data-ds-style="depth"] [class*="shadow-xs"],
[data-ds-style="depth"] [class*="shadow-sm"],
[data-ds-style="depth"] [class*="shadow-md"],
[data-ds-style="depth"] [class*="shadow-lg"] {
  box-shadow:
    0 1px 1px rgb(0 0 0 / 0.12),
    0 10px 30px -8px rgb(0 0 0 / calc(0.3 + var(${SHADOW_INTENSITY_VAR}, 0.5) * 0.4)) !important;
}
[data-ds-style="glass"] :is([data-slot="dialog-content"], [data-slot="popover-content"], [data-slot="menu-content"]) {
  backdrop-filter: blur(calc(max(var(${BACKDROP_BLUR_VAR}, 0), 12) * 1px)) saturate(1.5);
  -webkit-backdrop-filter: blur(calc(max(var(${BACKDROP_BLUR_VAR}, 0), 12) * 1px)) saturate(1.5);
}
`

/** Derive the wrapper data-attributes that conditional CSS keys off. */
export function bridgeAttrs(ds: DesignSystem): Record<string, string> {
  const t = ds.tokens ?? {}
  return {
    'data-ds-style': t[STYLE_FAMILY_VAR] ?? 'soft',
    'data-ds-motion': t[MOTION_ENABLED_VAR] === 'false' ? 'off' : 'on',
  }
}

/** Construct a Google Fonts stylesheet URL for a family name (best-effort). */
function googleFontHref(family: string): string {
  const name = family.trim().replace(/\s+/g, '+')
  return `https://fonts.googleapis.com/css2?family=${name}:wght@400;500;600;700&display=swap`
}

/**
 * The bridge stylesheet plus on-demand web-font loading. Rendered inside the
 * preview so font choices actually display (most of dotUI's font list are Google
 * families); unknown families simply fail to load and fall back to Geist.
 */
export function PreviewBridge({ tokens }: { tokens: Record<string, string> }) {
  const fonts = Array.from(
    new Set(
      [tokens[FONT_HEADING_VAR], tokens[FONT_BODY_VAR]].filter(
        (f): f is string => !!f && f !== 'Geist',
      ),
    ),
  )
  return (
    <>
      {fonts.length > 0 && (
        <>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          {fonts.map((family) => (
            <link key={family} rel="stylesheet" href={googleFontHref(family)} />
          ))}
        </>
      )}
      <style data-dotui-bridge>{BRIDGE_CSS}</style>
    </>
  )
}
