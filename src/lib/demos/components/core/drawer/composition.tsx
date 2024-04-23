"use client";

import * as React from "react";
import { XIcon } from "lucide-react";
import { Button } from "@/lib/components/core/default/button";
import {
  DrawerRoot,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
} from "@/lib/components/core/default/drawer";

export default function DrawerCompositionDemo() {
  return (
    <DrawerRoot direction="left">
      <DrawerTrigger asChild>
        <Button>Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div>
          <DrawerClose asChild>
            <Button
              shape="circle"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2"
            >
              <XIcon />
            </Button>
          </DrawerClose>
          <div className="flex flex-col items-center gap-4 p-12">
            <h2 className="text-xl font-bold">A drawer title</h2>
            <p>Drawer body</p>
          </div>
        </div>
      </DrawerContent>
    </DrawerRoot>
  );
}
