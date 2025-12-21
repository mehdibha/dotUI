"use client";

import { createDynamicComponent } from "@dotui/core/react/dynamic-component";

import * as Default from "./basic";
import type { ModalProps } from "./types";

export const Modal = createDynamicComponent("modal", "Modal", Default.Modal, {});

export type { ModalProps };
