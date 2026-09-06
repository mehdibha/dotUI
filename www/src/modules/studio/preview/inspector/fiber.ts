/**
 * Minimal React fiber access for the preview inspector — enough to resolve
 * which dotUI component owns a DOM element and read that instance's props.
 * Relies on React internals (the `__reactFiber$*` expando react-dom puts on
 * host nodes), which is the same mechanism React DevTools and react-grab use.
 */

export interface FiberLike {
  tag: number
  type: unknown
  return: FiberLike | null
  child: FiberLike | null
  sibling: FiberLike | null
  alternate: FiberLike | null
  stateNode: unknown
  memoizedProps: Record<string, unknown> | null
}

const HOST_COMPONENT = 5
const PORTAL = 4

export function getFiberFromDom(el: Element): FiberLike | null {
  for (const key of Object.keys(el)) {
    if (key.startsWith("__reactFiber$")) {
      return (el as unknown as Record<string, FiberLike>)[key] ?? null
    }
  }
  return null
}

// The DOM expando can point at the previous commit's fiber (React double-
// buffers trees); if the chain no longer tops out at the mounted root, the
// alternate is the live one.
function getLatestFiber(fiber: FiberLike): FiberLike {
  let top = fiber
  while (top.return) top = top.return
  const root = top.stateNode as { current?: FiberLike } | null
  if (root?.current && root.current !== top) return fiber.alternate ?? fiber
  return fiber
}

/**
 * Walk up from a DOM element to the nearest fiber whose type is a known
 * component. `lookup` maps component identities (functions, memo/forwardRef
 * wrappers) to arbitrary entries.
 */
export function findOwner<T>(
  el: Element,
  lookup: Map<unknown, T>,
): { fiber: FiberLike; entry: T } | null {
  const domFiber = getFiberFromDom(el)
  if (!domFiber) return null
  let fiber: FiberLike | null = getLatestFiber(domFiber)
  while (fiber) {
    const entry = lookup.get(fiber.type)
    if (entry !== undefined) return { fiber, entry }
    fiber = fiber.return
  }
  return null
}

/**
 * The component's top-level host elements, for drawing its bounding box.
 * Descends past nested components until it hits DOM, skipping portals —
 * portaled content lives elsewhere on screen and would wreck the union rect.
 */
export function getHostElements(fiber: FiberLike, limit = 40): Element[] {
  const hosts: Element[] = []
  const walk = (node: FiberLike | null) => {
    while (node && hosts.length < limit) {
      if (node.tag === HOST_COMPONENT && node.stateNode instanceof Element) {
        hosts.push(node.stateNode)
      } else if (node.tag !== PORTAL && node.child) {
        walk(node.child)
      }
      node = node.sibling
    }
  }
  walk(fiber.child)
  return hosts
}
