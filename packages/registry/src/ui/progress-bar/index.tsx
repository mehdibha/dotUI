"use client";

import { createDynamicComponent } from "@dotui/registry/ui/create-dynamic-component";

import * as Default from "./basic";
import type {
  ProgressBarControlProps,
  ProgressBarProps,
  ProgressBarValueLabelProps,
} from "./types";

export const ProgressBar = createDynamicComponent<ProgressBarProps>(
  "progress-bar",
  "ProgressBar",
  Default.ProgressBar,
  {},
);

export const ProgressBarControl =
  createDynamicComponent<ProgressBarControlProps>(
    "progress-bar",
    "ProgressBarControl",
    Default.ProgressBarControl,
    {},
  );

export const ProgressBarValueLabel =
  createDynamicComponent<ProgressBarValueLabelProps>(
    "progress-bar",
    "ProgressBarValueLabel",
    Default.ProgressBarValueLabel,
    {},
  );

export type {
  ProgressBarProps,
  ProgressBarControlProps,
  ProgressBarValueLabelProps,
};
