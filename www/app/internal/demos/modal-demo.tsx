"use client";

import { Button } from "@dotui/registry-v2/ui/button";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogRoot,
} from "@dotui/registry-v2/ui/dialog";

export function ModalDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <DialogRoot>
        <Button>Open Modal</Button>
        <Dialog
          type="modal"
          title="Confirm Action"
          description="Please confirm your action before proceeding."
        >
          <DialogBody>
            <p className="text-sm text-fg-muted">
              This will perform an important operation. Make sure you want to
              continue.
            </p>
          </DialogBody>
          <DialogFooter>
            <Button variant="quiet">Cancel</Button>
            <Button>Confirm</Button>
          </DialogFooter>
        </Dialog>
      </DialogRoot>

      <DialogRoot>
        <Button>Small Modal</Button>
        <Dialog
          type="modal"
          modalProps={{ className: "max-w-sm" }}
          title="Quick Action"
        >
          <DialogBody>
            <p className="text-sm">This is a smaller modal dialog.</p>
          </DialogBody>
          <DialogFooter>
            <Button size="sm">OK</Button>
          </DialogFooter>
        </Dialog>
      </DialogRoot>

      <DialogRoot>
        <Button>Large Modal</Button>
        <Dialog
          type="modal"
          modalProps={{ className: "max-w-2xl" }}
          title="Detailed View"
        >
          <DialogBody>
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-medium">Section 1</h4>
                <p className="text-sm text-fg-muted">
                  This is a larger modal with more content and details.
                </p>
              </div>
              <div>
                <h4 className="mb-2 font-medium">Section 2</h4>
                <p className="text-sm text-fg-muted">
                  You can add multiple sections and rich content here.
                </p>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="quiet">Close</Button>
            <Button>Save</Button>
          </DialogFooter>
        </Dialog>
      </DialogRoot>
    </div>
  );
}
