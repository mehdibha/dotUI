// AUTO-GENERATED - DO NOT EDIT
// Run "pnpm build" to regenerate

import { base } from "./base";
import { hooks } from "./hooks";
import { lib } from "./lib";
import { ui } from "./ui";

/**
 * Combined registry of all items (UI, base, lib, hooks)
 */
export const registry = [...base, ...ui, ...lib, ...hooks];

export { base } from "./base";
export { hooks } from "./hooks";
export { iconLibraries, icons } from "./icons";
export { lib } from "./lib";
export { ui } from "./ui";
