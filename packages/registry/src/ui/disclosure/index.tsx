"use client";

import { createDynamicComponent } from "../../_helpers/create-dynamic-component";
import * as Default from "./basic";
import type { DisclosureVariant } from "./meta";
import type {
  DisclosureHeadingProps,
  DisclosurePanelProps,
  DisclosureProps,
} from "./types";

export const Disclosure = createDynamicComponent<
  DisclosureProps,
  DisclosureVariant
>("disclosure", "Disclosure", Default.Disclosure, {});

export const DisclosureHeading = createDynamicComponent<
  DisclosureHeadingProps,
  DisclosureVariant
>("disclosure", "DisclosureHeading", Default.DisclosureHeading, {});

export const DisclosurePanel = createDynamicComponent<
  DisclosurePanelProps,
  DisclosureVariant
>("disclosure", "DisclosurePanel", Default.DisclosurePanel, {});

export type { DisclosureProps, DisclosureHeadingProps, DisclosurePanelProps };
