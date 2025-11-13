import { InfoIcon } from "lucide-react";

import { Button } from "@dotui/registry/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogHeading,
} from "@dotui/registry/ui/dialog";
import { Popover } from "@dotui/registry/ui/popover";

export default function Page() {
  return (
    <div className="flex h-40 items-end justify-center">
      <Dialog defaultOpen>
        <Button aria-label="Help">
          <InfoIcon />
        </Button>
        <Popover>
          <DialogContent>
            <DialogHeader>
              <DialogHeading>Need help?</DialogHeading>
            </DialogHeader>
            <p>
              If you&apos;re having issues, contact our customer support team.
            </p>
          </DialogContent>
        </Popover>
      </Dialog>
    </div>
  );
}
