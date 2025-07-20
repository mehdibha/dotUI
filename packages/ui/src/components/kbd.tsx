"use client";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import { Kbd as _Kbd, KbdStyles } from "../registry/components/kbd/basic";
import type { KbdProps } from "../registry/components/kbd/basic";

export const Kbd = createDynamicComponent<KbdProps>("kbd", "Kbd", _Kbd, {});

export { KbdStyles };
export type { KbdProps };
