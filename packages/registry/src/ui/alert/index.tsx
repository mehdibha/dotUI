"use client";

import { createDynamicComponent } from "../../_helpers/create-dynamic-component";
import type {
  AlertActionProps,
  AlertDescriptionProps,
  AlertProps,
  AlertTitleProps,
} from "./basic";
import {
  Alert as _Alert,
  AlertAction as _AlertAction,
  AlertDescription as _AlertDescription,
  AlertTitle as _AlertTitle,
} from "./basic";
import type { AlertVariant } from "./meta";

export const Alert = createDynamicComponent<AlertProps, AlertVariant>(
  "alert",
  "Alert",
  _Alert,
  {},
);

export const AlertTitle = createDynamicComponent<AlertTitleProps, AlertVariant>(
  "alert",
  "AlertTitle",
  _AlertTitle,
  {},
);

export const AlertDescription = createDynamicComponent<
  AlertDescriptionProps,
  AlertVariant
>("alert", "AlertDescription", _AlertDescription, {});

export const AlertAction = createDynamicComponent<
  AlertActionProps,
  AlertVariant
>("alert", "AlertAction", _AlertAction, {});

export type {
  AlertProps,
  AlertDescriptionProps,
  AlertTitleProps,
  AlertActionProps,
};
