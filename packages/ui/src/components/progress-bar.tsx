"use client";

import React from "react";

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
  {
    basic: React.lazy(() =>
      import("../registry/components/progress-bar/basic").then((mod) => ({
        default: mod.ProgressBar,
      })),
    ),
  },
);

export const ProgressBarRoot = createDynamicComponent<ProgressBarRootProps>(
  "progress-bar",
  "ProgressBarRoot",
  _ProgressBarRoot,
  {
    basic: React.lazy(() =>
      import("../registry/components/progress-bar/basic").then((mod) => ({
        default: mod.ProgressBarRoot,
      })),
    ),
  },
);

export const ProgressBarIndicator =
  createDynamicComponent<ProgressBarIndicatorProps>(
    "progress-bar",
    "ProgressBarIndicator",
    _ProgressBarIndicator,
    {
      basic: React.lazy(() =>
        import("../registry/components/progress-bar/basic").then((mod) => ({
          default: mod.ProgressBarIndicator,
        })),
      ),
    },
  );

export const ProgressBarValueLabel =
  createDynamicComponent<ProgressBarValueLabelProps>(
    "progress-bar",
    "ProgressBarValueLabel",
    _ProgressBarValueLabel,
    {
      basic: React.lazy(() =>
        import("../registry/components/progress-bar/basic").then((mod) => ({
          default: mod.ProgressBarValueLabel,
        })),
      ),
    },
  );

export type {
  ProgressBarProps,
  ProgressBarRootProps,
  ProgressBarIndicatorProps,
  ProgressBarValueLabelProps,
};
