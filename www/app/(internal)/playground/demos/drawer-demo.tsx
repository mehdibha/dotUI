"use client";

import { Button } from "@dotui/registry-v2/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogHeading,
} from "@dotui/registry-v2/ui/dialog";
import { Drawer } from "@dotui/registry-v2/ui/drawer";
import { Label } from "@dotui/registry-v2/ui/field";
import { Input } from "@dotui/registry-v2/ui/input";
import { TextField } from "@dotui/registry-v2/ui/text-field";

export function DrawerDemo() {
  return (
    <div className="flex flex-col flex-wrap items-center gap-4">
      <div className="grid gap-2 [grid-template-areas:'top-left_top_top-right'_'left-top_top_right-top'_'left_._right'_'left-bottom_._right-bottom'_'bottom-left_bottom_bottom-right']">
        {(["top", "left", "right", "bottom"] as const).map((placement) => (
          <Dialog key={placement}>
            <Button
              style={{ gridArea: placement.replace(" ", "-") }}
              className="w-[100px]"
            >
              {placement}
            </Button>
            <Drawer placement={placement}>
              <DialogContent>
                <DialogHeader>
                  <DialogHeading>Dimensions</DialogHeading>
                  <DialogDescription>
                    Set the dimensions for the layer.
                  </DialogDescription>
                </DialogHeader>
                <DialogBody>
                  <TextField>
                    <Label>Width</Label>
                    <Input />
                  </TextField>
                  <TextField>
                    <Label>Height</Label>
                    <Input />
                  </TextField>
                </DialogBody>
                <DialogFooter>
                  <Button slot="close">Cancel</Button>
                  <Button variant="primary">Apply</Button>
                </DialogFooter>
              </DialogContent>
            </Drawer>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
