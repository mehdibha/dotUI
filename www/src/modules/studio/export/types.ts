/**
 * Builds a preset-encoded registry URL for a given path, resolved against the
 * right host — e.g. `presetUrl('/r/init')` → `https://host/r/init?preset=origin@1&d=v5.…`.
 * Produced by `useExportUrl()`.
 */
export type PresetUrl = (path: string) => string
