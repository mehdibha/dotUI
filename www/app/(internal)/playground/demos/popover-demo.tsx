"use client";

import { Button } from "@dotui/registry/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogHeading,
  DialogInset,
} from "@dotui/registry/ui/dialog";
import { Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import { Popover } from "@dotui/registry/ui/popover";
import { TextField } from "@dotui/registry/ui/text-field";

export function PopoverDemo() {
  return (
    <div className="flex max-w-md flex-col flex-wrap items-center gap-10 py-10">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {/* Basic popover */}
        <Dialog>
          <Button>Open popover</Button>
          <Popover>
            <DialogContent>
              <DialogHeader>
                <DialogHeading>Dimensions</DialogHeading>
                <DialogDescription>
                  Set the dimensions for the layer.
                </DialogDescription>
              </DialogHeader>
              <DialogBody>
                <TextField defaultValue="100%" className="w-full">
                  <Label>Width</Label>
                  <Input />
                </TextField>
                <TextField>
                  <Label>Height</Label>
                  <Input />
                </TextField>
              </DialogBody>
            </DialogContent>
          </Popover>
        </Dialog>

        {/* Popover with actions */}
        <Dialog>
          <Button>Actions</Button>
          <Popover>
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
                <Button slot="close" size="sm">
                  Cancel
                </Button>
                <Button variant="primary" size="sm">
                  Apply
                </Button>
              </DialogFooter>
            </DialogContent>
          </Popover>
        </Dialog>

        {/* Popover with inset content */}
        <Dialog>
          <Button>Inset</Button>
          <Popover>
            <DialogContent>
              <DialogHeader>
                <DialogHeading>Dimensions</DialogHeading>
                <DialogDescription>
                  Set the dimensions for the layer.
                </DialogDescription>
              </DialogHeader>
              <DialogBody>
                <DialogInset>hello world</DialogInset>
              </DialogBody>
            </DialogContent>
          </Popover>
        </Dialog>

        {/* Popover with large content */}
        <Dialog>
          <Button>Large content</Button>
          <Popover>
            <DialogContent>
              <DialogHeader>
                <DialogHeading>Dimensions</DialogHeading>
                <DialogDescription>
                  Set the dimensions for the layer.
                </DialogDescription>
              </DialogHeader>
              <DialogBody className="space-y-4">
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
              </DialogBody>
            </DialogContent>
          </Popover>
        </Dialog>

        {/* Popover with fixed height */}
        <Dialog>
          <Button>Fixed height</Button>
          <Popover className="h-96">
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
                <Button slot="close" size="sm">
                  Cancel
                </Button>
                <Button variant="primary" size="sm">
                  Apply
                </Button>
              </DialogFooter>
            </DialogContent>
          </Popover>
        </Dialog>

        {/* Nested popover */}
        <Dialog>
          <Button>Nested popover</Button>
          <Popover>
            <DialogContent>
              <Dialog>
                <Button>Open Nested Popover</Button>
                <Popover placement="right">
                  <DialogContent>Nested popover content</DialogContent>
                </Popover>
              </Dialog>
            </DialogContent>
          </Popover>
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
            <Popover placement={placement} className="w-auto">
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
              </DialogContent>
            </Popover>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
