"use client";

import { createDynamicComponent } from "@dotui/core/react/dynamic-component";

import * as Default from "./base";
import type { LoaderProps } from "./types";

export const Loader = createDynamicComponent<LoaderProps>("loader", "Loader", Default.Loader, {});

export type { LoaderProps };
