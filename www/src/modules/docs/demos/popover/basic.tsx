import React from "react";
import { Button } from "@/components/dynamic-ui/button";
import {
  DialogContent,
  DialogHeading,
  DialogRoot,
} from "@/components/dynamic-ui/dialog";
import { Popover } from "@/components/dynamic-ui/popover";
import { InfoIcon } from "lucide-react";

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
