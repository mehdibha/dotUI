"use client";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import { ToastProvider as _ToastProvider } from "../registry/components/toast/basic";

export const ToastProvider = createDynamicComponent<{}>(
  "toast",
  "ToastProvider",
  _ToastProvider,
  {},
);

export { queue } from "../registry/components/toast/basic";
