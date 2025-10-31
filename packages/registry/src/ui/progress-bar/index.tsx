"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type {
  ProgressBarControlProps,
  ProgressBarProps,
  ProgressBarValueLabelProps,
} from "./basic";
import {
  ProgressBar as _ProgressBar,
  ProgressBarControl as _ProgressBarControl,
  ProgressBarValueLabel as _ProgressBarValueLabel,
} from "./basic";

export const ProgressBar = createDynamicComponent<ProgressBarProps>(
  "progress-bar",
  "ProgressBar",
  _ProgressBar,
  {},
);

export const ProgressBarControl =
  createDynamicComponent<ProgressBarControlProps>(
    "progress-bar",
    "ProgressBarControl",
    _ProgressBarControl,
    {},
  );

export const ProgressBarValueLabel =
  createDynamicComponent<ProgressBarValueLabelProps>(
    "progress-bar",
    "ProgressBarValueLabel",
    _ProgressBarValueLabel,
    {},
  );

export type {
  ProgressBarProps,
  ProgressBarControlProps,
  ProgressBarValueLabelProps,
};
