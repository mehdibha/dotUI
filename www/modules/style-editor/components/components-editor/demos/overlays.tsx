import { Button } from "@dotui/ui/components/button";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogRoot,
} from "@dotui/ui/components/dialog";

import { getComponentVariants } from "@/modules/style-editor/components/components-editor/demos/utils";
import { Section } from "@/modules/style-editor/components/components-editor/section";

export function Overlays() {
  return (
    <Section
      name="overlays"
      title="Overlays"
      variants={getComponentVariants("popover")}
      previewClassName="gap-4"
    >
      <DialogRoot>
        <Button>Popover</Button>
        <Dialog title="Popover" type="popover">
          <DialogBody>some content</DialogBody>
          <DialogFooter>
            <Button slot="close">Cancel</Button>
            <Button variant="primary" slot="close">
              Save changes
            </Button>
          </DialogFooter>
        </Dialog>
      </DialogRoot>
      <DialogRoot>
        <Button>Modal</Button>
        <Dialog title="Modal" type="modal">
          <DialogBody>some content</DialogBody>
          <DialogFooter>
            <Button slot="close">Cancel</Button>
            <Button variant="primary" slot="close">
              Save changes
            </Button>
          </DialogFooter>
        </Dialog>
      </DialogRoot>
      <DialogRoot>
        <Button>Drawer</Button>
        <Dialog title="Drawer" type="drawer">
          <DialogBody>some content</DialogBody>
          <DialogFooter>
            <Button slot="close">Cancel</Button>
            <Button variant="primary" slot="close">
              Save changes
            </Button>
          </DialogFooter>
        </Dialog>
      </DialogRoot>
    </Section>
  );
}
