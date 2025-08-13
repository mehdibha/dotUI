"use client";

import React from "react";

import {
  Dialog,
  DialogBody,
  DialogHeader,
  DialogHeading,
  DialogRoot,
} from "@dotui/ui/components/dialog";

import { LoginForm } from "./login-form";

export function SignInModal({ children }: { children: React.ReactNode }) {
  return (
    <DialogRoot>
      {children}
      <Dialog modalProps={{ className: "max-w-md" }}>
        <DialogHeader>
          <DialogHeading>Sign in</DialogHeading>
        </DialogHeader>
        <DialogBody>
          <LoginForm />
        </DialogBody>
      </Dialog>
    </DialogRoot>
  );
}
