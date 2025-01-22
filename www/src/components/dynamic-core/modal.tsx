"use client";

import React from "react";
import { createDynamicComponent } from "@/lib/create-dynamic-component";
import { Modal as _Modal, ModalProps } from "@/registry/core/modal_basic";

export const Modal = createDynamicComponent<ModalProps>(
  "modal",
  "Modal",
  _Modal,
  {}
);
