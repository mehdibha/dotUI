"use client";

import { createDynamicComponent } from "@dotui/registry/ui/create-dynamic-component";

import * as Default from "./basic";
import type { ModalProps } from "./types";

export const Modal = createDynamicComponent(
  "modal",
  "Modal",
  Default.Modal,
  {},
);

export type { ModalProps };
