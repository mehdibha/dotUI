// Animates a code block's expand/collapse as a height tween. Deliberately not
// a view transition: snapshotting pauses input document-wide (long for a big
// highlighted file) and participating elements skip hit-testing, so even a
// transition scoped to the block reads as a frozen page.
export function toggleCodeBlock(target: Element, update: () => void) {
  const block = target.closest('figure')
  if (!block || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    update()
    return
  }
  const from = block.getBoundingClientRect().height
  update()
  // The re-render can land after the current task (DynamicPre defers
  // re-highlighting), so tween on the resulting height change instead of
  // measuring synchronously.
  const ro = new ResizeObserver(() => {
    const to = block.getBoundingClientRect().height
    if (to === from) return
    ro.disconnect()
    clearTimeout(bail)
    for (const animation of block.getAnimations()) animation.cancel()
    block.style.overflow = 'hidden'
    block
      .animate([{ height: `${from}px` }, { height: `${to}px` }], {
        duration: 250,
        easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      })
      .finished.finally(() => {
        block.style.overflow = ''
      })
  })
  ro.observe(block)
  // A no-op toggle (same height) would leave the observer running forever.
  const bail = setTimeout(() => ro.disconnect(), 500)
}
