/* The version a stored state is stamped with; `migrate` brings older ones
   up to it. Kept apart so the docs never load the upgrade tables. */

import type { StudioState } from "./index"

export const STATE_VERSION = 3

/** The state as stored: stamped with the version it was written at. */
export const stamp = (state: StudioState) => ({
  version: STATE_VERSION,
  ...state,
})
