// iOS-style progressive blur: each layer adds a larger backdrop blur over an
// overlapping gradient window. Where the windows overlap the blurs compound,
// ramping smoothly from sharp (bottom edge) to heavily blurred (top). The
// `to top` direction puts the strongest blur under the overlaid content. The
// positioned parent must stay mask-free — a mask there establishes a backdrop
// root and kills the cross-layer compounding that makes the ramp smooth.
const BLUR_LAYERS = [
  {
    blur: 0.5,
    mask: 'linear-gradient(to top, transparent 0%, #000 10%, #000 30%, transparent 40%)',
  },
  {
    blur: 1,
    mask: 'linear-gradient(to top, transparent 10%, #000 20%, #000 40%, transparent 50%)',
  },
  {
    blur: 2,
    mask: 'linear-gradient(to top, transparent 15%, #000 30%, #000 50%, transparent 60%)',
  },
  {
    blur: 4,
    mask: 'linear-gradient(to top, transparent 20%, #000 40%, #000 60%, transparent 70%)',
  },
  {
    blur: 8,
    mask: 'linear-gradient(to top, transparent 40%, #000 60%, #000 80%, transparent 90%)',
  },
  { blur: 16, mask: 'linear-gradient(to top, transparent 60%, #000 80%)' },
  { blur: 24, mask: 'linear-gradient(to top, transparent 70%, #000 100%)' },
]

/**
 * The layered blur + `--color-bg` tint stack behind the app header and the
 * create preview toolbar. Fills its positioned parent; strongest at the top,
 * dissolving to sharp at the bottom. Intensity rides `--blur-progress`
 * (registered in styles.css, initial 0): the header animates it with a scroll
 * timeline, always-on overlays pin `[--blur-progress:1]` on their wrapper.
 */
export function ProgressiveBlur() {
  return (
    <>
      {BLUR_LAYERS.map(({ blur, mask }) => (
        <div
          key={blur}
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(calc(var(--blur-progress, 0) * ${blur}px))`,
            WebkitBackdropFilter: `blur(calc(var(--blur-progress, 0) * ${blur}px))`,
            maskImage: mask,
            WebkitMaskImage: mask,
          }}
        />
      ))}
      <div
        className="absolute inset-0"
        style={{
          // Darkness rides this element's opacity (0.9 at full progress) — never the
          // backdrop-filter layers, which would form an opacity group and drop the
          // blur. The gradient peaks at full --color-bg at the top.
          opacity: 'calc(var(--blur-progress, 0) * 0.9)',
          background:
            'linear-gradient(to top, transparent 0%, color-mix(in oklab, var(--color-bg) 76%, transparent) 55%, var(--color-bg) 100%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 progressive-blur-dither"
        style={{
          opacity: 'calc(var(--blur-progress, 0) * 0.035)',
        }}
      />
    </>
  )
}
