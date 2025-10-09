"use client";

import { Button } from "@dotui/registry-v2/ui/button";
import { Dialog } from "@dotui/registry-v2/ui/dialog";
import { TextField } from "@dotui/registry-v2/ui/text-field";

export function PopoverDemo() {
  return (
    <div className="flex flex-col flex-wrap items-center gap-4 py-10">
      <Dialog>
        <Button>Open popover</Button>
        <Dialog.Popover>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Heading>Dimensions</Dialog.Heading>
              <Dialog.Description>
                Set the dimensions for the layer.
              </Dialog.Description>
            </Dialog.Header>
            <Dialog.Body>
              <TextField label="Width" defaultValue="100%" />
              <TextField label="Height" defaultValue="200px" />
            </Dialog.Body>
            <Dialog.Footer>
              <Button slot="close">Cancel</Button>
              <Button variant="primary">Apply</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Popover>
      </Dialog>

      <div className="grid gap-2 [grid-template-areas:'top-left_top_top-right'_'left-top_top_right-top'_'left_._right'_'left-bottom_._right-bottom'_'bottom-left_bottom_bottom-right']">
        {(
          [
            "top left",
            "top",
            "top right",
            "left",
            "left top",
            "left bottom",
            "right",
            "right top",
            "right bottom",
            "bottom left",
            "bottom",
            "bottom right",
          ] as const
        ).map((placement) => (
          <Dialog key={placement}>
            <Button style={{ gridArea: placement.replace(" ", "-") }}>
              {placement}
            </Button>
            <Dialog.Popover placement={placement}>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Heading>Dimensions</Dialog.Heading>
                  <Dialog.Description>
                    Set the dimensions for the layer.
                  </Dialog.Description>
                </Dialog.Header>
                <Dialog.Body>
                  <TextField label="Width" defaultValue="100%" />
                  <TextField label="Height" defaultValue="200px" />
                </Dialog.Body>
                <Dialog.Footer>
                  <Button slot="close">Cancel</Button>
                  <Button variant="primary">Apply</Button>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Popover>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
