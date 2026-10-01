/* The panel's `tint-*` surfaces are a site utility (www/src/styles.css), not
   a registry one, so the film's stylesheet never generates them. Rest and
   selected states are all a still frame needs; `data-hovered` is set by the
   set where the synthetic cursor rests. */

const tint = (pct: number) =>
  `background-color: color-mix(in oklab, var(--color-fg) ${pct}%, var(--panel-surface, var(--color-card)));`

export const PANEL_CSS = `
.tint-5 { ${tint(5)} }
.tint-10,
.selected\\:tint-10[data-selected],
.hover\\:tint-10[data-hovered],
.hover\\:tint-5[data-hovered] { ${tint(10)} }
.pressed\\:tint-10[data-pressed] { ${tint(14)} }
.selected\\:tint-15[data-selected],
.group[data-active] .group-data-active\\:tint-15 { ${tint(15)} }
`
