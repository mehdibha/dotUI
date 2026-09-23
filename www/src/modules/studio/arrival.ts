/* The studio route's gate: every URL it renders is canonical (see doc.ts).
   Runs in the route's beforeLoad, so a redirect lands before anything
   renders; what the redirect lost waits here for the page to announce. */

import { arrive, storedQuery } from "./doc"
import type { DocSearch, Notice } from "./doc"
import { loadWorking, saveWorking } from "./preset/storage"

let pending: Notice | undefined

/** Where `search` must redirect, if anywhere. */
export function settle(
  search: DocSearch,
  preload: boolean,
): DocSearch | undefined {
  const working = typeof window === "undefined" ? undefined : loadWorking()
  const { redirect, notice } = arrive(search, working)
  if (preload || !redirect) return redirect
  // A bare /studio reopened the working document: store its canonical form,
  // so the tab reads as its owner.
  const bare = !search.preset && !search.d
  if (bare && working && working !== storedQuery(redirect))
    saveWorking(storedQuery(redirect))
  pending = notice
  return redirect
}

/** The last redirect's notice, once. */
export function takeNotice(): Notice | undefined {
  const notice = pending
  pending = undefined
  return notice
}
