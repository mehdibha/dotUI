"use client";

import { createDynamicComponent } from "@dotui/core/react/dynamic-component";

import * as Default from "./basic";
import type { AlertActionProps, AlertDescriptionProps, AlertProps, AlertTitleProps } from "./types";

export const Alert = createDynamicComponent<AlertProps>("alert", "Alert", Default.Alert, {});

export const AlertTitle = createDynamicComponent<AlertTitleProps>("alert", "AlertTitle", Default.AlertTitle, {});

export const AlertDescription = createDynamicComponent<AlertDescriptionProps>(
	"alert",
	"AlertDescription",
	Default.AlertDescription,
	{},
);

export const AlertAction = createDynamicComponent<AlertActionProps>("alert", "AlertAction", Default.AlertAction, {});

export type { AlertProps, AlertDescriptionProps, AlertTitleProps, AlertActionProps };
