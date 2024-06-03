"use client";

import { Button } from "@/lib/components/core/default/button";
import { DrawerRoot, Drawer } from "@/lib/components/core/default/drawer";
import { TextField } from "@/lib/components/core/default/text-field";

export default function DrawerDemo() {
  return (
    <DrawerRoot>
      <Button>Open drawer</Button>
      <Drawer title="Salemou 3alaykom">
        <div className="mx-auto h-[200px] max-w-sm"></div>
      </Drawer>
    </DrawerRoot>
  );
}
