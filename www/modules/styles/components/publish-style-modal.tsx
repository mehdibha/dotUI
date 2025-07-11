import { Globe2Icon, LockIcon } from "lucide-react";

import { Button } from "@dotui/ui/components/button";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogRoot,
} from "@dotui/ui/components/dialog";
import { Select, SelectItem } from "@dotui/ui/components/select";
import { TextField } from "@dotui/ui/components/text-field";

export function PublishStyleModal({ children }: { children: React.ReactNode }) {
  return (
    <DialogRoot>
      {children}
      <Dialog
        title="Publish your style"
        description="Follow these steps to correctly publish your style."
      >
        <DialogBody className="-mx-6 space-y-2 px-6 pt-1 [&_[data-slot='label']]:text-sm">
          <TextField
            label="Name"
            defaultValue="Minimalist"
            className="w-full"
          />
          <TextField
            label="slug"
            defaultValue="minimalist"
            className="w-full"
          />
          <Select
            aria-label="Visibility"
            defaultSelectedKey="public"
            className="w-full"
          >
            <SelectItem id="public" prefix={<Globe2Icon />}>
              Public
            </SelectItem>
            <SelectItem id="private" isDisabled prefix={<LockIcon />}>
              Private
            </SelectItem>
          </Select>
        </DialogBody>
        <DialogFooter>
          <Button slot="close">Cancel</Button>
          <Button variant="primary" slot="close">
            Publish
          </Button>
        </DialogFooter>
      </Dialog>
    </DialogRoot>
  );
}
