"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  Dialog as _Dialog,
  DialogBody as _DialogBody,
  DialogContent as _DialogContent,
  DialogDescription as _DialogDescription,
  DialogFooter as _DialogFooter,
  DialogHeader as _DialogHeader,
  DialogHeading as _DialogHeading,
  DialogInset as _DialogInset,
  DialogRoot as _DialogRoot,
} from "../registry/components/dialog/basic";
import type {
  DialogBodyProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogHeaderProps,
  DialogHeadingProps,
  DialogInsetProps,
  DialogProps,
  DialogRootProps,
} from "../registry/components/dialog/basic";

export const DialogRoot = createDynamicComponent<DialogRootProps>(
  "dialog",
  "DialogRoot",
  _DialogRoot,
  {
    basic: React.lazy(() =>
      import("../registry/components/dialog/basic").then((mod) => ({
        default: mod.DialogRoot,
      })),
    ),
  },
);

export const Dialog = createDynamicComponent<DialogProps>(
  "dialog",
  "Dialog",
  _Dialog,
  {
    basic: React.lazy(() =>
      import("../registry/components/dialog/basic").then((mod) => ({
        default: mod.Dialog,
      })),
    ),
  },
);

export const DialogHeader = createDynamicComponent<DialogHeaderProps>(
  "dialog",
  "DialogHeader",
  _DialogHeader,
  {
    basic: React.lazy(() =>
      import("../registry/components/dialog/basic").then((mod) => ({
        default: mod.DialogHeader,
      })),
    ),
  },
);

export const DialogHeading = createDynamicComponent<DialogHeadingProps>(
  "dialog",
  "DialogHeading",
  _DialogHeading,
  {
    basic: React.lazy(() =>
      import("../registry/components/dialog/basic").then((mod) => ({
        default: mod.DialogHeading,
      })),
    ),
  },
);

export const DialogDescription = createDynamicComponent<DialogDescriptionProps>(
  "dialog",
  "DialogDescription",
  _DialogDescription,
  {
    basic: React.lazy(() =>
      import("../registry/components/dialog/basic").then((mod) => ({
        default: mod.DialogDescription,
      })),
    ),
  },
);

export const DialogContent = createDynamicComponent<DialogContentProps>(
  "dialog",
  "DialogContent",
  _DialogContent,
  {
    basic: React.lazy(() =>
      import("../registry/components/dialog/basic").then((mod) => ({
        default: mod.DialogContent,
      })),
    ),
  },
);

export const DialogBody = createDynamicComponent<DialogBodyProps>(
  "dialog",
  "DialogBody",
  _DialogBody,
  {
    basic: React.lazy(() =>
      import("../registry/components/dialog/basic").then((mod) => ({
        default: mod.DialogBody,
      })),
    ),
  },
);

export const DialogFooter = createDynamicComponent<DialogFooterProps>(
  "dialog",
  "DialogFooter",
  _DialogFooter,
  {
    basic: React.lazy(() =>
      import("../registry/components/dialog/basic").then((mod) => ({
        default: mod.DialogFooter,
      })),
    ),
  },
);

export const DialogInset = createDynamicComponent<DialogInsetProps>(
  "dialog",
  "DialogInset",
  _DialogInset,
  {
    basic: React.lazy(() =>
      import("../registry/components/dialog/basic").then((mod) => ({
        default: mod.DialogInset,
      })),
    ),
  },
);

export type {
  DialogRootProps,
  DialogProps,
  DialogHeaderProps,
  DialogHeadingProps,
  DialogDescriptionProps,
  DialogContentProps,
  DialogFooterProps,
  DialogInsetProps,
};
