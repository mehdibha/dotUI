import { Suspense } from 'react'

/**
 * Hydration island for a live component demo.
 *
 * Docs pages are prerendered, so a demo that renders runtime-dependent state is
 * baked into static HTML at build time. The clearest case is React Aria's date
 * components: their cells are marked relative to the real `today()`, so the day
 * after a deploy the client renders a different `today()` than the prerender did
 * — a hydration mismatch.
 *
 * React recovers from a mismatch by client-rendering up to the nearest
 * `<Suspense>` boundary. Without one around each demo, that recovery bubbles up
 * to the route and momentarily blanks the prose and the table of contents.
 * Giving every demo its own boundary scopes the recovery to the demo, so the
 * surrounding shell never blanks.
 */
export function DemoIsland({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>
}
