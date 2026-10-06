import { resolveColorConfigCached } from "@/lib/resolve-color"
import {
  emitCss,
  emitDarkOverridesCss,
  emitPrimitivesCss,
  scopedSemantics,
  semanticDelta,
} from "@/registry/theme"
import type { ColorConfig } from "@/registry/theme"

/** The global palette stylesheet for `color`: primitives on `:root` and
 *  `.dark`, plus the semantic tokens the config re-points. */
export function themeCss(color: ColorConfig): string {
  const primitives = emitPrimitivesCss(resolveColorConfigCached(color))
  // Re-pointed tokens re-declare on plain `:root`, beating the layered
  // `@theme` declarations.
  const delta = semanticDelta(color)
  const forks = Object.entries(scopedSemantics(color))
    .map(([selector, vocab]) => emitCss(vocab, { selector }))
    .join("")
  if (Object.keys(delta).length === 0) return primitives + forks
  return (
    primitives +
    emitCss(delta, { selector: ":root" }) +
    emitDarkOverridesCss(delta, { selector: ".dark" }) +
    forks
  )
}
