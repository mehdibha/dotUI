// TEMPORARY (PR #587): shiki vs @tanstack/highlight comparison lab — delete after merge decision.

/* The dataset (~1.1 MB) is loaded through import.meta.glob rather than a plain
   dynamic import: it keeps the JSON out of every bundle but the lazy chunk,
   and stops TypeScript from inferring a literal type for a megabyte of data. */

export type Seg = [text: string, light: string, dark: string, diff: 0 | 1]

export type PaneKey = 'shiki' | 'refined' | 'raw'

export interface Snippet {
  /** 1-based first line of this snippet inside the original block. */
  line: number
  shiki: Seg[]
  refined: Seg[]
  raw: Seg[]
}

export interface Block {
  id: string
  lang: string
  mismatchChars: number
  totalLines: number
  /** Indexes into `LabData.buckets`. */
  buckets: number[]
  snippets: Snippet[]
}

export interface Bucket {
  /** `shiki #24292E|#E1E4E8 → tanstack #005CC5|#79B8FF` */
  label: string
  count: number
  blocks: number
}

export interface Stats {
  corpusBlocks: number
  comparedChars: number
  refinedMismatch: number
  rawMismatch: number
  refinedPct: number
  rawPct: number
  mismatchingBlocks: number
  shownBlocks: number
  droppedBlocks: number
}

export interface LabData {
  stats: Stats
  buckets: Bucket[]
  blocks: Block[]
}

export function loadLabData(): Promise<LabData> {
  const modules = import.meta.glob<LabData>('./data.json', {
    import: 'default',
  })
  const load = modules['./data.json']
  if (!load) {
    throw new Error('highlight-lab: data.json is missing')
  }
  return load()
}

const HEX_PAIR = /#([0-9A-Fa-f]{6})\|#([0-9A-Fa-f]{6})/g

/** Pulls the shiki and tanstack light/dark hex pairs out of a bucket label. */
export function parseBucketColors(label: string) {
  const pairs = [...label.matchAll(HEX_PAIR)].map((match) => ({
    light: `#${match[1]}`,
    dark: `#${match[2]}`,
  }))
  return { from: pairs[0], to: pairs[1] }
}
