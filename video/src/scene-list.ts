/* The edit, as data: scene ids, their files in src/scenes/, and lengths in
   bars. Kept import-free so scripts can read it without bundling. */
export const SCENE_LIST = [
  { id: "Open", file: "open", bars: 2 },
  { id: "Studio", file: "studio", bars: 4 },
  { id: "End", file: "end", bars: 2 },
] as const

export type SceneId = (typeof SCENE_LIST)[number]["id"]
