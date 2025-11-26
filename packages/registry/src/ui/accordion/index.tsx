"use client";

import { createDynamicComponent } from "../../_helpers/create-dynamic-component";
import * as Default from "./basic";
import type { AccordionVariant } from "./meta";
import type {
  AccordionHeadingProps,
  AccordionItemProps,
  AccordionPanelProps,
  AccordionProps,
} from "./types";

export const Accordion = createDynamicComponent<
  AccordionProps,
  AccordionVariant
>("accordion", "Accordion", Default.Accordion, {});

export const AccordionItem = createDynamicComponent<
  AccordionItemProps,
  AccordionVariant
>("accordion", "AccordionItem", Default.AccordionItem, {});

export const AccordionHeading = createDynamicComponent<
  AccordionHeadingProps,
  AccordionVariant
>("accordion", "AccordionHeading", Default.AccordionHeading, {});

export const AccordionPanel = createDynamicComponent<
  AccordionPanelProps,
  AccordionVariant
>("accordion", "AccordionPanel", Default.AccordionPanel, {});

export type {
  AccordionProps,
  AccordionItemProps,
  AccordionHeadingProps,
  AccordionPanelProps,
};
