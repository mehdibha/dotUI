"use client";

import * as React from "react";
import { Button } from "@/lib/components/core/default/button";
import { Drawer } from "@/lib/components/core/default/drawer";

export default function DrawerDemo() {
  const [bottomOpen, setBottomOpen] = React.useState(false);
  const [topOpen, setTopOpen] = React.useState(false);
  const [leftOpen, setLeftOpen] = React.useState(false);
  const [rightOpen, setRightOpen] = React.useState(false);
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button onClick={() => setBottomOpen(true)}>Bottom</Button>
      <Drawer
        direction="bottom"
        open={bottomOpen}
        onOpenChange={(state) => setBottomOpen(state)}
      >
        <div className="flex flex-col items-center gap-4 p-12">
          <h2 className="text-xl font-bold">A drawer title</h2>
          <p>Drawer body</p>
        </div>
      </Drawer>
      <Button onClick={() => setTopOpen(true)}>Top</Button>
      <Drawer direction="top" open={topOpen} onOpenChange={(state) => setTopOpen(state)}>
        <div className="flex flex-col items-center gap-4 p-12">
          <h2 className="text-xl font-bold">A drawer title</h2>
          <p>Drawer body</p>
        </div>
      </Drawer>
      <Button onClick={() => setLeftOpen(true)}>Left</Button>
      <Drawer
        direction="left"
        showSwipeBar={false}
        open={leftOpen}
        onOpenChange={(state) => setLeftOpen(state)}
      >
        <div className="flex flex-col items-center gap-4 p-12">
          <h2 className="text-xl font-bold">A drawer title</h2>
          <p>Drawer body</p>
        </div>
      </Drawer>
      <Button onClick={() => setRightOpen(true)}>Right</Button>
      <Drawer
        direction="right"
        showSwipeBar={false}
        open={rightOpen}
        onOpenChange={(state) => setRightOpen(state)}
      >
        <div className="flex flex-col items-center gap-4 p-12">
          <h2 className="text-xl font-bold">A drawer title</h2>
          <p>Drawer body</p>
        </div>
      </Drawer>
    </div>
  );
}
