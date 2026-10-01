/* The edit, as data: scene ids, their files in src/scenes/, and lengths in
   bars. Kept import-free so scripts can read it without bundling. */
export const SCENE_LIST = [
  { id: "Open", file: "open", bars: 2 },
  { id: "Wall", file: "wall", bars: 3 },
  { id: "Presets", file: "presets", bars: 3 },
  { id: "Axes", file: "axes", bars: 9 },
  { id: "Compose", file: "compose", bars: 4 },
  { id: "Patterns", file: "patterns", bars: 4 },
  { id: "Export", file: "export", bars: 3 },
  { id: "End", file: "end", bars: 3 },
] as const

export type SceneId = (typeof SCENE_LIST)[number]["id"]
