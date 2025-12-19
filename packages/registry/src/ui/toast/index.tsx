"use client";

import { createDynamicComponent } from "@dotui/core/components/create-dynamic-component";

import * as Default from "./basic";

export const Toaster = createDynamicComponent("toast", "ToastProvider", Default.Toaster, {});

export { toast } from "./basic";
