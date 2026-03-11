"use client";

import { createDynamicComponent } from "@dotui/core/react/dynamic-component";

import * as Default from "./basic";
import type { DisclosurePanelProps, DisclosureProps, DisclosureTriggerProps } from "./types";

export const Disclosure = createDynamicComponent<DisclosureProps>("disclosure", "Disclosure", Default.Disclosure, {});

export const DisclosurePanel = createDynamicComponent<DisclosurePanelProps>(
	"disclosure",
	"DisclosurePanel",
	Default.DisclosurePanel,
	{},
);

export const DisclosureTrigger = createDynamicComponent<DisclosureTriggerProps>(
	"disclosure",
	"DisclosureTrigger",
	Default.DisclosureTrigger,
	{},
);

export type { DisclosureProps, DisclosureTriggerProps, DisclosurePanelProps };
