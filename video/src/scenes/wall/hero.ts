/* The hero radio: the Open's white dot is its inner dot. Before the click the
   selected indicator is drawn as a bare ring around a white dot; on the click
   the selection fill grows out of the dot and the dot turns to the real
   on-selection ink. Driven by vars on the tile: --rest (the other options),
   --label, --ring, --fill, --dot (inner-dot scale), --dark. */
export const HERO_CSS = `
.wall-r [data-field] > :not(.wall-hero) {
  opacity: var(--rest);
}
.wall-r .wall-hero > :not([data-radio-control]) {
  opacity: var(--label);
}
.wall-r .wall-hero [data-radio-indicator] {
  border-color: color-mix(in oklab, var(--color-border-control) calc(var(--ring) * (1 - var(--fill)) * 100%), transparent);
  background: radial-gradient(circle closest-side, var(--color-selection) calc(var(--fill) * 100% - 0.4px), transparent calc(var(--fill) * 100% + 0.4px)) border-box;
}
.wall-r .wall-hero [data-radio-indicator]::before {
  transform: scale(var(--dot));
  background: color-mix(in oklab, var(--color-fg-on-selection) calc(var(--dark) * 100%), #fff);
}
`
