"use client";

import { createDynamicComponent } from "@dotui/core/react/dynamic-component";

import * as Default from "./basic";
import type { TextProps } from "./types";

export const Text = createDynamicComponent<TextProps>("text", "Text", Default.Text, {});

export type { TextProps };
