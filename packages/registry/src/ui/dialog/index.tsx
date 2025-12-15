"use client";

import { createDynamicComponent } from "@dotui/core/utils/create-dynamic-component";

import * as Default from "./basic";
import type {
	DialogBodyProps,
	DialogContentProps,
	DialogDescriptionProps,
	DialogFooterProps,
	DialogHeaderProps,
	DialogHeadingProps,
	DialogInsetProps,
	DialogProps,
} from "./types";

export const Dialog = createDynamicComponent<DialogProps>("dialog", "Dialog", Default.Dialog, {});

export const DialogHeader = createDynamicComponent<DialogHeaderProps>(
	"dialog",
	"DialogHeader",
	Default.DialogHeader,
	{},
);

export const DialogHeading = createDynamicComponent<DialogHeadingProps>(
	"dialog",
	"DialogHeading",
	Default.DialogHeading,
	{},
);

export const DialogDescription = createDynamicComponent<DialogDescriptionProps>(
	"dialog",
	"DialogDescription",
	Default.DialogDescription,
	{},
);

export const DialogContent = createDynamicComponent<DialogContentProps>(
	"dialog",
	"DialogContent",
	Default.DialogContent,
	{},
);

export const DialogBody = createDynamicComponent<DialogBodyProps>("dialog", "DialogBody", Default.DialogBody, {});

export const DialogFooter = createDynamicComponent<DialogFooterProps>(
	"dialog",
	"DialogFooter",
	Default.DialogFooter,
	{},
);

export const DialogInset = createDynamicComponent<DialogInsetProps>("dialog", "DialogInset", Default.DialogInset, {});

export type {
	DialogProps,
	DialogHeaderProps,
	DialogHeadingProps,
	DialogDescriptionProps,
	DialogContentProps,
	DialogFooterProps,
	DialogInsetProps,
};
