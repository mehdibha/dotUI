import { InfoIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import {
  DialogContent,
  DialogHeading,
  DialogRoot,
} from "@dotui/registry/ui/dialog";
import { Popover } from "@dotui/registry/ui/popover";

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
