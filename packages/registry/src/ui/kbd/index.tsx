"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type { KbdProps } from "./basic";
import { Kbd as _Kbd } from "./basic";

export const Kbd = createDynamicComponent<KbdProps>("kbd", "Kbd", _Kbd, {});

export type { KbdProps };
