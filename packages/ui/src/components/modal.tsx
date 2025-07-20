"use client";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import { Modal as _Modal } from "../registry/components/modal/basic";
import type { ModalProps } from "../registry/components/modal/basic";

export const Modal = createDynamicComponent("modal", "Modal", _Modal, {});

export type { ModalProps };
