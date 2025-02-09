import React from "react";
import { InfoIcon } from "lucide-react";
import { Button } from "@/components/dynamic-core/button";
import {
  DialogContent,
  DialogRoot,
  DialogHeading,
} from "@/components/dynamic-core/dialog";
import { Popover } from "@/components/dynamic-core/popover";

export default function Demo() {
  return (
    <DialogRoot>
      <Button shape="square">
        <InfoIcon />
      </Button>
      <Popover>
        <DialogContent className="w-56 space-y-4">
          <DialogHeading>Need help?</DialogHeading>
          <p>
            If you&apos;re having issues accessing your account, contact our
            customer support team for help.
          </p>
        </DialogContent>
      </Popover>
    </DialogRoot>
  );
}
