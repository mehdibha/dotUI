/**
 * Customizer-facing helpers derived from the semantic vocabulary.
 *
 * Replaces the editing affordances that the retired `base/tokens.ts` carried:
 * the customizer reads these to populate its color pickers.
 */

import { SITE_SEMANTICS } from "./semantics"
import type { SemanticCategory } from "./types"

/** Semantic token names (e.g. `"color-bg"`) in the given category, in vocabulary order. */
export function colorTokenNames(category: SemanticCategory): string[] {
  return Object.entries(SITE_SEMANTICS)
    .filter(([, token]) => token.category === category)
    .map(([name]) => name)
}
