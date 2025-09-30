import { ExternalLinkIcon, Globe2Icon, LockIcon } from "lucide-react";

import { Button } from "@dotui/registry/ui/button";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogRoot,
} from "@dotui/registry/ui/dialog";
import { Select, SelectItem } from "@dotui/registry/ui/select";
import { TextArea } from "@dotui/registry/ui/text-area";
import { TextField } from "@dotui/registry/ui/text-field";

export function PublishStyleModal({ children }: { children: React.ReactNode }) {
  return (
    <DialogRoot>
      {children}
      <Dialog
        title="Publish your style"
        description="Follow these steps to correctly publish your style."
        modalProps={{ className: "max-w-lg" }}
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
            <SelectItem id="unlisted" prefix={<ExternalLinkIcon />}>
              Unlisted
            </SelectItem>
            <SelectItem id="private" isDisabled prefix={<LockIcon />}>
              Private
            </SelectItem>
          </Select>
          <TextArea label="Description (optional)" className="w-full" />
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
