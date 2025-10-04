"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

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
} from "./basic";
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
} from "./basic";

export const DialogRoot = createDynamicComponent<DialogRootProps>(
  "dialog",
  "DialogRoot",
  _DialogRoot,
  {},
);

export const Dialog = createDynamicComponent<DialogProps>(
  "dialog",
  "Dialog",
  _Dialog,
  {},
);

export const DialogHeader = createDynamicComponent<DialogHeaderProps>(
  "dialog",
  "DialogHeader",
  _DialogHeader,
  {},
);

export const DialogHeading = createDynamicComponent<DialogHeadingProps>(
  "dialog",
  "DialogHeading",
  _DialogHeading,
  {},
);

export const DialogDescription = createDynamicComponent<DialogDescriptionProps>(
  "dialog",
  "DialogDescription",
  _DialogDescription,
  {},
);

export const DialogContent = createDynamicComponent<DialogContentProps>(
  "dialog",
  "DialogContent",
  _DialogContent,
  {},
);

export const DialogBody = createDynamicComponent<DialogBodyProps>(
  "dialog",
  "DialogBody",
  _DialogBody,
  {},
);

export const DialogFooter = createDynamicComponent<DialogFooterProps>(
  "dialog",
  "DialogFooter",
  _DialogFooter,
  {},
);

export const DialogInset = createDynamicComponent<DialogInsetProps>(
  "dialog",
  "DialogInset",
  _DialogInset,
  {},
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
