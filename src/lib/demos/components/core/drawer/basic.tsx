import { Button } from "@/lib/components/core/default/button";
import { DrawerRoot, Drawer } from "@/lib/components/core/default/drawer";

export default function DrawerDemo() {
  return (
    <DrawerRoot>
      <Button >
        Open drawer
      </Button>
      <Drawer title="Salemou 3alaykom">
        <div>some content here</div>
      </Drawer>
    </DrawerRoot>
  );
}
