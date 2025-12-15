"use client";

import { createDynamicComponent } from "@dotui/core/utils/create-dynamic-component";

import * as Default from "./basic";
import type { AlertVariant } from "./meta";
import type { AlertActionProps, AlertDescriptionProps, AlertProps, AlertTitleProps } from "./types";

export const Alert = createDynamicComponent<AlertProps, AlertVariant>("alert", "Alert", Default.Alert, {});

export const AlertTitle = createDynamicComponent<AlertTitleProps, AlertVariant>(
	"alert",
	"AlertTitle",
	Default.AlertTitle,
	{},
);

export const AlertDescription = createDynamicComponent<AlertDescriptionProps, AlertVariant>(
	"alert",
	"AlertDescription",
	Default.AlertDescription,
	{},
);

export const AlertAction = createDynamicComponent<AlertActionProps, AlertVariant>(
	"alert",
	"AlertAction",
	Default.AlertAction,
	{},
);

export type { AlertProps, AlertDescriptionProps, AlertTitleProps, AlertActionProps };
