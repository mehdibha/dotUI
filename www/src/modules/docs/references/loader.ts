/**
 * API Reference loader
 * Loads pre-generated JSON files at build time
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { ComponentApiReference } from './types'

// Resolved from this module (not cwd) so callers outside `www` (vitest at the
// repo root) hit the same files as the vite build.
const GENERATED_DIR = fileURLToPath(new URL('generated', import.meta.url))

/**
 * Load API reference data for a component
 * @param name - Component name in kebab-case (e.g., "button", "date-picker")
 */
export async function loadApiReference(
  name: string,
): Promise<ComponentApiReference | null> {
  try {
    const filePath = path.join(GENERATED_DIR, `${name}.json`)
    const content = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(content) as ComponentApiReference
  } catch (error) {
    console.error(
      `[references] Failed to load API reference for "${name}":`,
      error,
    )
    return null
  }
}
