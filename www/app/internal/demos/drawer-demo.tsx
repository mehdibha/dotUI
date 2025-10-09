"use client";

import { Button } from "@dotui/registry-v2/ui/button";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogRoot,
} from "@dotui/registry-v2/ui/dialog";

export function DrawerDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <DialogRoot>
        <Button>Bottom Drawer</Button>
        <Dialog
          type="drawer"
          mobileType="drawer"
          drawerProps={{ placement: "bottom" }}
          title="Settings"
          description="Manage your account settings"
        >
          <DialogBody>
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-medium">Appearance</h4>
                <p className="text-sm text-fg-muted">
                  Customize how the app looks on your device.
                </p>
              </div>
              <div>
                <h4 className="mb-2 font-medium">Notifications</h4>
                <p className="text-sm text-fg-muted">
                  Choose what notifications you want to receive.
                </p>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="quiet">Cancel</Button>
            <Button>Save Changes</Button>
          </DialogFooter>
        </Dialog>
      </DialogRoot>

      <DialogRoot>
        <Button>Right Drawer</Button>
        <Dialog
          type="drawer"
          mobileType="drawer"
          drawerProps={{ placement: "right" }}
          title="Navigation"
        >
          <DialogBody>
            <nav className="space-y-2">
              <a
                href="#"
                className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
              >
                Dashboard
              </a>
              <a
                href="#"
                className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
              >
                Projects
              </a>
              <a
                href="#"
                className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
              >
                Team
              </a>
              <a
                href="#"
                className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
              >
                Settings
              </a>
            </nav>
          </DialogBody>
        </Dialog>
      </DialogRoot>

      <DialogRoot>
        <Button>Left Drawer</Button>
        <Dialog
          type="drawer"
          mobileType="drawer"
          drawerProps={{ placement: "left" }}
          title="Filters"
        >
          <DialogBody>
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 text-sm font-medium">Category</h4>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" />
                    Electronics
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" />
                    Clothing
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" />
                    Books
                  </label>
                </div>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="quiet">Clear</Button>
            <Button>Apply Filters</Button>
          </DialogFooter>
        </Dialog>
      </DialogRoot>

      <DialogRoot>
        <Button>Top Drawer</Button>
        <Dialog
          type="drawer"
          mobileType="drawer"
          drawerProps={{ placement: "top" }}
          title="Announcement"
        >
          <DialogBody>
            <p className="text-sm">
              🎉 New features are now available! Check out the latest updates.
            </p>
          </DialogBody>
        </Dialog>
      </DialogRoot>
    </div>
  );
}
