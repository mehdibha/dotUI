/* Layout readings for the synthetic cursor. Offsets walk the offsetParent
   chain, so they ignore the camera's 3D transform and read the set's own
   untransformed px. */

export interface Box {
  x: number
  y: number
  w: number
  h: number
}

export const ZERO: Box = { x: 0, y: 0, w: 0, h: 0 }

export function boxWithin(el: HTMLElement, root: HTMLElement): Box {
  let x = 0
  let y = 0
  let node: HTMLElement | null = el
  while (node && node !== root) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight }
}

/** A panel row by its label: the h-9 dial row that holds the label text. */
export function findRow(section: Element, label: string) {
  const span = [...section.querySelectorAll("span")].find(
    (s) => s.textContent === label && s.children.length === 0,
  )
  return (span?.closest(".h-9") as HTMLElement | null) ?? null
}
