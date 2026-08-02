/* Drafts — the open PRs exploring a panel section, none of them landed yet.
   Several are competing takes on the SAME section rather than a sequence
   (three at Color + Surfaces, two at Type), so this is a menu to choose
   from, not a changelog.

   A hand-kept snapshot: the lab is a static internal page and doesn't call
   the GitHub API. Prune an entry once its PR merges or closes. */

export interface Draft {
  pr: number
  title: string
  /** What this draft explores, and how it differs from its siblings. */
  summary: string
  /** The section it reworks — drafts on the same section are alternatives. */
  section: string
}

export const DRAFTS: Draft[] = [
  {
    pr: 560,
    title: 'Color v2 and Surfaces frames',
    section: 'Color',
    summary:
      'The first working-frame experiment: an enhanced Color body read against the frozen v1, with surfaces pulled out alongside it.',
  },
  {
    pr: 561,
    title: 'Reworked color section, surfaces frame',
    section: 'Color',
    summary:
      'A simpler, more flexible take on the same ground — fewer decisions up front, with surfaces given their own frame.',
  },
  {
    pr: 562,
    title: 'Enhanced Color section, Surfaces split out',
    section: 'Color',
    summary:
      'Keeps the Color body focused on the palette and moves every canvas decision into a dedicated Surfaces frame.',
  },
  {
    pr: 563,
    title: 'Ideal Type section',
    section: 'Type',
    summary:
      'Replaces the Type body following the lab convention, with v1 keeping the old one as the reference.',
  },
  {
    pr: 565,
    title: 'Ideal Type section',
    section: 'Type',
    summary:
      'The other Type take: a live hero, absent-means-default state, and depth behind DetailRows — the blueprint the Color section set.',
  },
  {
    pr: 564,
    title: 'Ideal Icons section',
    section: 'Icons',
    summary: 'The Icons frame rebuilt for real previews and a fuller axis set.',
  },
]

export function draftUrl(pr: number): string {
  return `https://github.com/mehdibha/dotUI/pull/${pr}`
}
