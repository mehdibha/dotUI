"use client";

import { Button } from "@dotui/registry-v2/ui/button";
import { Dialog } from "@dotui/registry-v2/ui/dialog";
import { TextField } from "@dotui/registry-v2/ui/text-field";

export function PopoverDemo() {
  return (
    <div className="flex flex-col flex-wrap items-center gap-10 py-10">
      <div className="flex flex-wrap gap-2">
        {/* Basic popover */}
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
                <TextField
                  label="Width"
                  defaultValue="100%"
                  className="w-full"
                />
                <TextField
                  label="Height"
                  defaultValue="200px"
                  className="w-full"
                />
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Popover>
        </Dialog>

        {/* Popover with actions */}
        <Dialog>
          <Button>With actions</Button>
          <Dialog.Popover className="h-140">
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Heading>Dimensions</Dialog.Heading>
                <Dialog.Description>
                  Set the dimensions for the layer.
                </Dialog.Description>
              </Dialog.Header>
              <Dialog.Body>
                <TextField
                  label="Width"
                  defaultValue="100%"
                  className="w-full"
                />
                <TextField
                  label="Height"
                  defaultValue="200px"
                  className="w-full"
                />
              </Dialog.Body>
              <Dialog.Footer>
                <Button slot="close" size="sm">
                  Cancel
                </Button>
                <Button variant="primary" size="sm">
                  Apply
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Popover>
        </Dialog>

        {/* Popover with inset content */}
        <Dialog>
          <Button>Inset</Button>
          <Dialog.Popover>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Heading>Dimensions</Dialog.Heading>
                <Dialog.Description>
                  Set the dimensions for the layer.
                </Dialog.Description>
              </Dialog.Header>
              <Dialog.Body>
                <Dialog.Inset>hello world</Dialog.Inset>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Popover>
        </Dialog>

        {/* Popover with large content */}
        <Dialog>
          <Button>Large</Button>
          <Dialog.Popover>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Heading>Dimensions</Dialog.Heading>
                <Dialog.Description>
                  Set the dimensions for the layer.
                </Dialog.Description>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Popover>
        </Dialog>

        {/* Nested popover */}
        <Dialog>
          <Button>Nested popover</Button>
          <Dialog.Popover>
            <Dialog.Content>
              <Dialog>
                <Button>Open Nested Popover</Button>
                <Dialog.Popover placement="right">
                  <Dialog.Content>Nested popover content</Dialog.Content>
                </Dialog.Popover>
              </Dialog>
            </Dialog.Content>
          </Dialog.Popover>
        </Dialog>
      </div>

      {/* Placement popover */}
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
            <Dialog.Popover placement={placement} className="w-auto">
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Heading>Dimensions</Dialog.Heading>
                  <Dialog.Description>
                    Set the dimensions for the layer.
                  </Dialog.Description>
                </Dialog.Header>
                <Dialog.Body>
                  <TextField
                    label="Width"
                    defaultValue="100%"
                    className="w-full"
                  />
                  <TextField
                    label="Height"
                    defaultValue="200px"
                    className="w-full"
                  />
                </Dialog.Body>
              </Dialog.Content>
            </Dialog.Popover>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
