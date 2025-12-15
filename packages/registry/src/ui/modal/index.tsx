"use client";

import { createDynamicComponent } from "@dotui/core/utils/create-dynamic-component";

import * as Default from "./basic";
import type { ModalProps } from "./types";

export const Modal = createDynamicComponent("modal", "Modal", Default.Modal, {});

export type { ModalProps };
