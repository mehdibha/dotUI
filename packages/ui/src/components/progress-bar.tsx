"use client";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  ProgressBar as _ProgressBar,
  ProgressBarIndicator as _ProgressBarIndicator,
  ProgressBarRoot as _ProgressBarRoot,
  ProgressBarValueLabel as _ProgressBarValueLabel,
} from "../registry/components/progress-bar/basic";
import type {
  ProgressBarIndicatorProps,
  ProgressBarProps,
  ProgressBarRootProps,
  ProgressBarValueLabelProps,
} from "../registry/components/progress-bar/basic";

export const ProgressBar = createDynamicComponent<ProgressBarProps>(
  "progress-bar",
  "ProgressBar",
  _ProgressBar,
  {},
);

export const ProgressBarRoot = createDynamicComponent<ProgressBarRootProps>(
  "progress-bar",
  "ProgressBarRoot",
  _ProgressBarRoot,
  {},
);

export const ProgressBarIndicator =
  createDynamicComponent<ProgressBarIndicatorProps>(
    "progress-bar",
    "ProgressBarIndicator",
    _ProgressBarIndicator,
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
  ProgressBarRootProps,
  ProgressBarIndicatorProps,
  ProgressBarValueLabelProps,
};
