"use client";

import { createDynamicComponent } from "@dotui/core/utils/create-dynamic-component";

import * as Default from "./basic";
import type { DisclosureVariant } from "./meta";
import type { DisclosurePanelProps, DisclosureProps, DisclosureTriggerProps } from "./types";

export const Disclosure = createDynamicComponent<DisclosureProps, DisclosureVariant>(
	"disclosure",
	"Disclosure",
	Default.Disclosure,
	{},
);

export const DisclosurePanel = createDynamicComponent<DisclosurePanelProps, DisclosureVariant>(
	"disclosure",
	"DisclosurePanel",
	Default.DisclosurePanel,
	{},
);

export const DisclosureTrigger = createDynamicComponent<DisclosureTriggerProps, DisclosureVariant>(
	"disclosure",
	"DisclosureTrigger",
	Default.DisclosureTrigger,
	{},
);

export type { DisclosureProps, DisclosureTriggerProps, DisclosurePanelProps };
