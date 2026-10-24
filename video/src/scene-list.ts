/* The edit, as data: scene ids, their files in src/scenes/, and lengths in
   bars. Kept import-free so scripts can read it without bundling. */
export const SCENE_LIST = [
  { id: "Looks", file: "looks", bars: 4 },
  { id: "Rush", file: "rush", bars: 3 },
  { id: "Reveal", file: "reveal", bars: 2 },
  { id: "Tweak", file: "tweak", bars: 4 },
  { id: "Catalog", file: "catalog", bars: 2 },
  { id: "Mobile", file: "mobile", bars: 2 },
  { id: "Agent", file: "agent", bars: 2 },
  { id: "End", file: "end", bars: 2 },
] as const

export type SceneId = (typeof SCENE_LIST)[number]["id"]
