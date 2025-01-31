"use client";

import React from "react";
import { InfoIcon } from "lucide-react";
import { Button } from "@/components/dynamic-core/button";
import { DialogContent, DialogRoot } from "@/components/dynamic-core/dialog";
import { Popover } from "@/components/dynamic-core/popover";
import { Heading } from "@/registry/core/heading";

export default function Demo() {
  return (
    <DialogRoot>
      <Button shape="square">
        <InfoIcon />
      </Button>
      <Popover
        UNSTABLE_portalContainer={
          document.getElementById("custom-theme-portal")!
        }
      >
        <DialogContent className="w-56 space-y-4">
          <Heading>Need help?</Heading>
          <p>
            If you&apos;re having issues accessing your account, contact our
            customer support team for help.
          </p>
        </DialogContent>
      </Popover>
    </DialogRoot>
  );
}
