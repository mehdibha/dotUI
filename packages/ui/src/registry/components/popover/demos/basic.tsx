import React from "react";

import { Button } from "@dotui/ui/components/button";
import {
  DialogContent,
  DialogHeading,
  DialogRoot,
} from "@dotui/ui/components/dialog";
import { Popover } from "@dotui/ui/components/popover";
import { InfoIcon } from "@dotui/ui/icons";

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
