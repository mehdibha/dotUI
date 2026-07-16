import { flushSync } from 'react-dom'

// Expand/collapse morph scoped to one code block. :root is opted out of view
// transitions globally (see styles.css) so the page never loses hit-testing;
// only the block itself morphs. It's named just for the transition's duration —
// a static name would duplicate across a page's demos and abort the transition.
export function toggleCodeBlock(target: Element, update: () => void) {
  const block = target.closest('figure')
  if (!block || !document.startViewTransition) {
    update()
    return
  }
  block.style.viewTransitionName = 'docs-code-block'
  document
    .startViewTransition(() => {
      flushSync(update)
    })
    .finished.finally(() => {
      block.style.viewTransitionName = ''
    })
}
