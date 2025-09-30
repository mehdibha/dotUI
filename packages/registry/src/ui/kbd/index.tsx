"use client";

import { createDynamicComponent } from "@dotui/registry/__internal__/helpers/create-dynamic-component";

import { Kbd as _Kbd, KbdStyles } from "./basic";
import type { KbdProps } from "./basic";

export const Kbd = createDynamicComponent<KbdProps>("kbd", "Kbd", _Kbd, {});

export { KbdStyles };
export type { KbdProps };
