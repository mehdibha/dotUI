"use client";

import { createDynamicComponent } from "@dotui/core/react/dynamic-component";

import * as Default from "./base";

export const Toaster = createDynamicComponent("toast", "ToastProvider", Default.Toaster, {});

export { toast } from "./base";
