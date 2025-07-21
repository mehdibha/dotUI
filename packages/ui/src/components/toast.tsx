"use client";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import { Toaster as _Toaster } from "../registry/components/toast/basic";

export const Toaster = createDynamicComponent<{}>(
  "toast",
  "ToastProvider",
  _Toaster,
  {},
);

export { toast } from "../registry/components/toast/basic";
