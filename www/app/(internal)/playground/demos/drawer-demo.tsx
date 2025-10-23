"use client";

import { Button } from "@dotui/registry-v2/ui/button";
import { Dialog } from "@dotui/registry-v2/ui/dialog";
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
            <Dialog.Drawer placement={placement}>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Heading>Dimensions</Dialog.Heading>
                  <Dialog.Description>
                    Set the dimensions for the layer.
                  </Dialog.Description>
                </Dialog.Header>
                <Dialog.Body>
                  <TextField>
                    <Label>Width</Label>
                    <Input />
                  </TextField>
                  <TextField>
                    <Label>Height</Label>
                    <Input />
                  </TextField>
                </Dialog.Body>
                <Dialog.Footer>
                  <Button slot="close">Cancel</Button>
                  <Button variant="primary">Apply</Button>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Drawer>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
