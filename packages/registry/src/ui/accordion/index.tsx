"use client";

import { createDynamicComponent } from "@dotui/core/react/dynamic-component";

import * as Default from "./basic";
import type { AccordionProps } from "./types";

export const Accordion = createDynamicComponent<AccordionProps>("accordion", "Accordion", Default.Accordion, {});

export type { AccordionProps };
