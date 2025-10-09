"use client";

import { Button } from "@dotui/registry-v2/ui/button";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogRoot,
} from "@dotui/registry-v2/ui/dialog";

export function DialogDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <DialogRoot>
        <Button>Open Dialog</Button>
        <Dialog
          title="Delete Account"
          description="Are you sure you want to delete your account?"
        >
          <DialogBody>
            <p className="text-sm text-fg-muted">
              This action cannot be undone. All of your data will be permanently
              deleted from our servers.
            </p>
          </DialogBody>
          <DialogFooter>
            <Button variant="quiet">Cancel</Button>
            <Button variant="danger">Delete</Button>
          </DialogFooter>
        </Dialog>
      </DialogRoot>

      <DialogRoot>
        <Button>Simple Dialog</Button>
        <Dialog title="Welcome">
          <DialogBody>
            <p className="text-sm">
              Welcome to our application! Get started by exploring the features.
            </p>
          </DialogBody>
          <DialogFooter>
            <Button>Got it</Button>
          </DialogFooter>
        </Dialog>
      </DialogRoot>

      <DialogRoot>
        <Button>Alert Dialog</Button>
        <Dialog
          role="alertdialog"
          title="Unsaved Changes"
          description="You have unsaved changes. Do you want to discard them?"
        >
          <DialogFooter>
            <Button variant="quiet">Cancel</Button>
            <Button variant="warning">Discard</Button>
          </DialogFooter>
        </Dialog>
      </DialogRoot>

      <DialogRoot>
        <Button>Rich Content</Button>
        <Dialog title="Create New Project">
          <DialogBody>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Project Name
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  placeholder="My awesome project"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Description
                </label>
                <textarea
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Describe your project..."
                />
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="quiet">Cancel</Button>
            <Button>Create Project</Button>
          </DialogFooter>
        </Dialog>
      </DialogRoot>
    </div>
  );
}
