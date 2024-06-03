"use client";

import * as React from "react";
import { Button } from "@/lib/components/core/default/button";

// import { Drawer } from "@/lib/components/core/default/drawer";

export default function DrawerDemo() {
  const [open, setOpen] = React.useState(false);
  return null;
  // return (
  //   <>
  //     <Button onClick={() => setOpen(true)}>Open Drawer</Button>
  //     <Drawer className="h-[400px]" open={open} onOpenChange={(state) => setOpen(state)}>
  //       <div className="flex flex-col items-center p-12 gap-4">
  //         <h2 className="text-xl font-bold">A drawer title</h2>
  //         <p>Drawer body</p>
  //       </div>
  //     </Drawer>
  //   </>
  // );
}
