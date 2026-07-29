'use client'

import { createContext, useContext } from 'react'

/**
 * Whether the surrounding component card is "active" — hovered or keyboard
 * focused. The card (component-card.tsx) is the only pointer/focus target: the
 * demo it previews is `inert`, so it can never receive hover/focus itself. The
 * card tracks its own hover/focus and broadcasts it down here, and the demo's
 * autoplay hooks read it to drive their looping interaction animations.
 *
 * Nothing here ever touches real focus — the animations are purely visual state
 * (controlled props, faux focus rings, motion transforms), so simulating a
 * "focused" field or an "open" popover never steals the page's focus.
 */
const CardHoverContext = createContext(false)

export const CardHoverProvider = CardHoverContext.Provider

export function useCardHover(): boolean {
  return useContext(CardHoverContext)
}
