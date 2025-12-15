"use client";

import { createDynamicComponent } from "@dotui/core/utils/create-dynamic-component";

import * as Default from "./basic";
import type { LinkProps } from "./types";

export const Link = createDynamicComponent<LinkProps>("link", "Link", Default.Link, {});

export type { LinkProps };
