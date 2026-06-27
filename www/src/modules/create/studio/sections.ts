import { SECTIONS } from '../panel/schema'
import type { Section } from '../panel/types'
import { STUDIO_EXTRA_SECTIONS } from './tweaks'

/* ----------------------------------------------------------------------------
 * The studio's domain set = the panel-lab schema's sections + the experimental
 * extras, re-ordered so related axes sit next to each other in the dock. The
 * lab keeps its own untouched `SECTIONS`; this ordering is studio-only.
 * -------------------------------------------------------------------------- */

const ORDER = [
  'color',
  'brand',
  'typography',
  'icons',
  'shape',
  'spacing',
  'surface',
  'elevation',
  'motion',
  'states',
  'interaction',
  'a11y',
  'components',
  'mode',
]

/** Sections authored only as experiments (drawn apart in the dock). */
export const EXPERIMENTAL_IDS = new Set(STUDIO_EXTRA_SECTIONS.map((s) => s.id))

export const STUDIO_SECTIONS: Section[] = [
  ...SECTIONS,
  ...STUDIO_EXTRA_SECTIONS,
].sort((a, b) => {
  const ai = ORDER.indexOf(a.id)
  const bi = ORDER.indexOf(b.id)
  return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
})

export function sectionById(id: string | null): Section | undefined {
  if (!id) return undefined
  return STUDIO_SECTIONS.find((s) => s.id === id)
}
