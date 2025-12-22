"use client";

import { createLink } from "@tanstack/react-router";

import { createDynamicComponent } from "@dotui/core/react/dynamic-component";

import * as Default from "./basic";
import type { LinkProps } from "./types";

const BaseLink = createDynamicComponent<LinkProps>("link", "Link", Default.Link, {});

export const Link = createLink(BaseLink);

export type { LinkProps };
