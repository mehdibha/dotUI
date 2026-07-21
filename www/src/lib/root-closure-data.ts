import type { RootClosure } from './root-closure'

/**
 * Placeholder swapped by the `dotui-root-closure` plugin (vite.config.ts): in
 * server environments this module's content becomes the root closure parsed
 * from the compiled stylesheet, so scoped themes can render during
 * SSR/prerender. On the client (and under vitest, which resolves the file
 * as-is) it stays null and the provider harvests the live CSSOM instead.
 */
export default null as RootClosure | null
