"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import {
  Empty as _Empty,
  EmptyContent as _EmptyContent,
  EmptyDescription as _EmptyDescription,
  EmptyHeader as _EmptyHeader,
  EmptyMedia as _EmptyMedia,
  EmptyTitle as _EmptyTitle,
} from "./basic";
import type {
  EmptyContentProps,
  EmptyDescriptionProps,
  EmptyHeaderProps,
  EmptyMediaProps,
  EmptyProps,
  EmptyTitleProps,
} from "./types";

export const Empty = createDynamicComponent<EmptyProps>(
  "empty",
  "Empty",
  _Empty,
  {},
);

export const EmptyHeader = createDynamicComponent<EmptyHeaderProps>(
  "empty",
  "EmptyHeader",
  _EmptyHeader,
  {},
);

export const EmptyTitle = createDynamicComponent<EmptyTitleProps>(
  "empty",
  "EmptyTitle",
  _EmptyTitle,
  {},
);
export const EmptyDescription = createDynamicComponent<EmptyDescriptionProps>(
  "empty",
  "EmptyDescription",
  _EmptyDescription,
  {},
);

export const EmptyContent = createDynamicComponent<EmptyContentProps>(
  "empty",
  "EmptyContent",
  _EmptyContent,
  {},
);
export const EmptyMedia = createDynamicComponent<EmptyMediaProps>(
  "empty",
  "EmptyMedia",
  _EmptyMedia,
  {},
);

export type {
  EmptyProps,
  EmptyHeaderProps,
  EmptyTitleProps,
  EmptyDescriptionProps,
  EmptyContentProps,
  EmptyMediaProps,
};
