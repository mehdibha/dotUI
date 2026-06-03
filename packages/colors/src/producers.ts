/**
 * Registers the built-in producers. `registerBuiltins()` is idempotent and is
 * called by `createTheme` (and `verify` consumers) — tree-shake-safe, no
 * import-for-side-effect global.
 */

import { type ColorProducer, hasProducer, registerProducer } from "./producer";
import { contrastProducer } from "./producers/contrast";
import { fixedProducer } from "./producers/fixed";
import { materialProducer } from "./producers/material";
import { oklchProducer } from "./producers/oklch";
import { tailwindProducer } from "./producers/presets";

let done = false;

export function registerBuiltins(): void {
	if (done) return;
	done = true;
	// Only fill ids that are free, so a consumer's pre-registered override wins regardless of call order.
	const add = <O>(p: ColorProducer<O>): void => {
		if (!hasProducer(p.id)) registerProducer(p);
	};
	add(oklchProducer);
	add(contrastProducer);
	add(materialProducer);
	add(fixedProducer);
	add(tailwindProducer);
}
