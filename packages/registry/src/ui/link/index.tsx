"use client";

import { createDynamicComponent } from "@dotui/core/react/dynamic-component";

import * as Default from "./base";
import type { LinkProps } from "./types";

export const Link = createDynamicComponent<LinkProps>("link", "Link", Default.Link, {});

export type { LinkProps };
