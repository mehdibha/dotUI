"use client";

import { createDynamicComponent } from "@dotui/core/components/create-dynamic-component";

import * as Default from "./basic";
import type { OverlayProps } from "./types";

export const Overlay = createDynamicComponent<OverlayProps>("overlay", "Overlay", Default.Overlay, {});

export type { OverlayProps };
