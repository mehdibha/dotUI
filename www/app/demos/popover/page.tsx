import { InfoIcon } from "lucide-react";

import { Button } from "@dotui/registry/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeading,
} from "@dotui/registry/ui/dialog";
import { Popover } from "@dotui/registry/ui/popover";

export default function Page() {
  return (
    <Dialog>
      <Button aria-label="Help">
        <InfoIcon />
      </Button>
      <Popover>
        <DialogContent className="w-56 space-y-4">
          <DialogHeading>Need help?</DialogHeading>
          <p>
            If you&apos;re having issues, contact our customer support team.
          </p>
        </DialogContent>
      </Popover>
    </Dialog>
  );
}
