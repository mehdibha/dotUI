"use client";

import { createDynamicComponent } from "@dotui/registry/__internal__/helpers/create-dynamic-component";

import { Modal as _Modal } from "./basic";
import type { ModalProps } from "./basic";

export const Modal = createDynamicComponent("modal", "Modal", _Modal, {});

export type { ModalProps };
