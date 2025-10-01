"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import { Toaster as _Toaster } from "./basic";

export const Toaster = createDynamicComponent<{}>(
  "toast",
  "ToastProvider",
  _Toaster,
  {},
);

export { toast } from "./basic";
