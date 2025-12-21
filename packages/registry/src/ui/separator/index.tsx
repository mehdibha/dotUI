"use client";

import { createDynamicComponent } from "@dotui/core/react/dynamic-component";

import * as Default from "./basic";
import type { SeparatorProps } from "./types";

export const Separator = createDynamicComponent<SeparatorProps>("separator", "Separator", Default.Separator, {});

export type { SeparatorProps };
