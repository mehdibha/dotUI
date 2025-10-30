"use client";

import { createDynamicComponent } from "../../_helpers/create-dynamic-component";
import type {
  AccordionHeadingProps,
  AccordionItemProps,
  AccordionPanelProps,
  AccordionProps,
} from "./basic";
import {
  Accordion as _Accordion,
  AccordionHeading as _AccordionHeading,
  AccordionItem as _AccordionItem,
  AccordionPanel as _AccordionPanel,
} from "./basic";
import type { AccordionVariant } from "./meta";

export const Accordion = createDynamicComponent<
  AccordionProps,
  AccordionVariant
>("accordion", "Accordion", _Accordion, {});

export const AccordionItem = createDynamicComponent<
  AccordionItemProps,
  AccordionVariant
>("accordion", "AccordionItem", _AccordionItem, {});

export const AccordionHeading = createDynamicComponent<
  AccordionHeadingProps,
  AccordionVariant
>("accordion", "AccordionHeading", _AccordionHeading, {});

export const AccordionPanel = createDynamicComponent<
  AccordionPanelProps,
  AccordionVariant
>("accordion", "AccordionPanel", _AccordionPanel, {});

export type {
  AccordionProps,
  AccordionItemProps,
  AccordionHeadingProps,
  AccordionPanelProps,
};
