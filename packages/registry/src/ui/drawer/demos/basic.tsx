import { Button } from "@dotui/registry/ui/button";
import { DialogContent, DialogRoot } from "@dotui/registry/ui/dialog";
import { Drawer } from "@dotui/registry/ui/drawer";

export default function Demo() {
  return (
    <DialogRoot>
      <Button>Open drawer</Button>
      <Drawer>
        <DialogContent>Drawer content</DialogContent>
      </Drawer>
    </DialogRoot>
  );
}
