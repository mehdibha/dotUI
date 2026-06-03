/**
 * Registers the built-in producers. `registerBuiltins()` is idempotent and is
 * called by `createTheme` (and `verify` consumers) — tree-shake-safe, no
 * import-for-side-effect global.
 */

import { registerProducer } from "./producer";
import { contrastProducer } from "./producers/contrast";
import { fixedProducer } from "./producers/fixed";
import { materialProducer } from "./producers/material";
import { oklchProducer } from "./producers/oklch";
import { tailwindProducer } from "./producers/presets";

let done = false;

export function registerBuiltins(): void {
	if (done) return;
	done = true;
	registerProducer(oklchProducer);
	registerProducer(contrastProducer);
	registerProducer(materialProducer);
	registerProducer(fixedProducer);
	registerProducer(tailwindProducer);
}
