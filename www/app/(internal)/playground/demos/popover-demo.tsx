"use client";

import { Button } from "@dotui/registry-v2/ui/button";
import { Dialog } from "@dotui/registry-v2/ui/dialog";
import { Label } from "@dotui/registry-v2/ui/field";
import { Input } from "@dotui/registry-v2/ui/input";
import { TextField } from "@dotui/registry-v2/ui/text-field";

export function PopoverDemo() {
  return (
    <div className="flex max-w-md flex-col flex-wrap items-center gap-10 py-10">
      <div className="flex flex-wrap items-center justify-center gap-2">
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
                <TextField defaultValue="100%" className="w-full">
                  <Label>Width</Label>
                  <Input />
                </TextField>
                <TextField>
                  <Label>Height</Label>
                  <Input />
                </TextField>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Popover>
        </Dialog>

        {/* Popover with actions */}
        <Dialog>
          <Button>Actions</Button>
          <Dialog.Popover>
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
          <Button>Large content</Button>
          <Dialog.Popover>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Heading>Dimensions</Dialog.Heading>
                <Dialog.Description>
                  Set the dimensions for the layer.
                </Dialog.Description>
              </Dialog.Header>
              <Dialog.Body className="space-y-4">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint
                  occaecat cupidatat non proident, sunt in culpa qui officia
                  deserunt mollit anim id est laborum.
                </p>
                <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque laudantium, totam rem aperiam, eaque
                  ipsa quae ab illo inventore veritatis et quasi architecto
                  beatae vitae dicta sunt explicabo.
                </p>
                <p>
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                  odit aut fugit, sed quia consequuntur magni dolores eos qui
                  ratione voluptatem sequi nesciunt. Neque porro quisquam est,
                  qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
                  velit.
                </p>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Popover>
        </Dialog>

        {/* Popover with fixed height */}
        <Dialog>
          <Button>Fixed height</Button>
          <Dialog.Popover className="h-96">
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
                  <TextField>
                    <Label>Width</Label>
                    <Input />
                  </TextField>
                  <TextField>
                    <Label>Height</Label>
                    <Input />
                  </TextField>
                </Dialog.Body>
              </Dialog.Content>
            </Dialog.Popover>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
