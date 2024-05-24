"use client";

import React from "react";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogInset,
  DialogRoot,
  DialogTitle,
  type DialogRootProps,
} from "./dialog";

const AlertDialogRoot = ({ mobileType = "modal", ...props }: DialogRootProps) => {
  return <DialogRoot mobileType={mobileType} {...props} />;
};

// TODO : Add isDismissable true, role "alert"

const AlertDialogContent = DialogContent;
const AlertDialog = Dialog;
const AlertDialogHeader = DialogHeader;
const AlertDialogTitle = DialogTitle;
const AlertDialogDescription = DialogDescription;
const AlertDialogBody = DialogBody;
const AlertDialogFooter = DialogFooter;
const AlertDialogInset = DialogInset;

export {
  AlertDialogRoot,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogInset,
};
