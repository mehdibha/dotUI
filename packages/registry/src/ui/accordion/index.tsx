"use client";

import { createDynamicComponent } from "@dotui/core/utils/create-dynamic-component";

import * as Default from "./basic";
import type { AccordionVariant } from "./meta";
import type { AccordionProps } from "./types";

export const Accordion = createDynamicComponent<AccordionProps, AccordionVariant>(
	"accordion",
	"Accordion",
	Default.Accordion,
	{},
);

export type { AccordionProps };
