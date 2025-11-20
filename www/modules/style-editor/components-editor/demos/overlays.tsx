import { Button } from "@dotui/registry/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogHeading,
} from "@dotui/registry/ui/dialog";
import { Drawer } from "@dotui/registry/ui/drawer";
import { Modal } from "@dotui/registry/ui/modal";
import { Popover } from "@dotui/registry/ui/popover";

import { ComponentConfig } from "@/modules/style-editor/components-editor/component-config";
import { getComponentVariants } from "@/modules/style-editor/components-editor/demos/utils";

export function Overlays() {
  return (
    <ComponentConfig
      name="overlays"
      title="Overlays"
      variants={getComponentVariants("popover")}
      previewClassName="gap-4"
    >
      <Dialog>
        <Button>Popover</Button>
        <Popover>
          <DialogContent>
            <DialogHeader>
              <DialogHeading>Popover</DialogHeading>
            </DialogHeader>
            <DialogBody>some content</DialogBody>
            <DialogFooter>
              <Button slot="close">Cancel</Button>
              <Button variant="primary" slot="close">
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Popover>
      </Dialog>
      <Dialog>
        <Button>Modal</Button>
        <Modal>
          <DialogContent>
            <DialogHeader>
              <DialogHeading>Modal</DialogHeading>
            </DialogHeader>
            <DialogBody>some content</DialogBody>
            <DialogFooter>
              <Button slot="close">Cancel</Button>
              <Button variant="primary" slot="close">
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Modal>
      </Dialog>
      <Dialog>
        <Button>Drawer</Button>
        <Drawer>
          <DialogContent>
            <DialogHeader>
              <DialogHeading>Drawer</DialogHeading>
            </DialogHeader>
            <DialogBody>some content</DialogBody>
            <DialogFooter>
              <Button slot="close">Cancel</Button>
              <Button variant="primary" slot="close">
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Drawer>
      </Dialog>
    </ComponentConfig>
  );
}
