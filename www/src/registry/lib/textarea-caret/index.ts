// Box + text metrics copied from the textarea onto the measuring mirror so its
// text wraps and lays out identically.
const CARET_MIRROR_PROPS = [
  'box-sizing',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'border-top-width',
  'border-right-width',
  'border-bottom-width',
  'border-left-width',
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'font-variant',
  'font-stretch',
  'line-height',
  'letter-spacing',
  'word-spacing',
  'text-align',
  'text-indent',
  'text-transform',
  'tab-size',
  'word-break',
  'overflow-wrap',
]

/**
 * Measure where the caret sits inside a textarea, relative to the textarea's
 * border box. A textarea exposes no caret geometry, so we render an off-screen
 * mirror `<div>` that copies the textarea's box + text metrics, place a marker
 * span at the caret offset, and read the marker's position.
 *
 * Returns the caret's `top`/`left` offset (px, relative to the textarea's border
 * box, accounting for scroll) and the line `height`.
 */
export function getCaretRect(
  input: HTMLTextAreaElement | HTMLInputElement,
  index: number,
) {
  const doc = input.ownerDocument
  const win = doc.defaultView ?? window
  const computed = win.getComputedStyle(input)
  const isInput = input.nodeName === 'INPUT'

  const mirror = doc.createElement('div')
  const { style } = mirror
  style.position = 'absolute'
  style.top = '0'
  style.left = '-9999px'
  style.visibility = 'hidden'
  // A textarea wraps; an input is a single non-wrapping line.
  style.whiteSpace = isInput ? 'pre' : 'pre-wrap'
  style.overflowWrap = 'break-word'
  for (const prop of CARET_MIRROR_PROPS) {
    style.setProperty(prop, computed.getPropertyValue(prop))
  }
  // Match the textarea's content-box width so line breaks fall in the same
  // places; an input never wraps, so let the mirror size to its content.
  style.width = isInput ? 'auto' : `${input.clientWidth}px`
  style.height = 'auto'

  mirror.textContent = input.value.slice(0, index)
  const marker = doc.createElement('span')
  // A non-empty marker keeps a measurable box even at the start of a line.
  marker.textContent = input.value.slice(index) || '.'
  mirror.appendChild(marker)
  doc.body.appendChild(mirror)

  const top =
    marker.offsetTop + parseInt(computed.borderTopWidth, 10) - input.scrollTop
  const left =
    marker.offsetLeft +
    parseInt(computed.borderLeftWidth, 10) -
    input.scrollLeft
  const height = parseInt(computed.lineHeight, 10) || marker.offsetHeight

  doc.body.removeChild(mirror)
  return { top, left, height }
}
