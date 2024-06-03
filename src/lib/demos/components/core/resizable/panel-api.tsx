"use client";

import React from "react";
import { Button } from "@/lib/components/core/default/button";
import {
  type ImperativePanelHandle,
  ResizableHandle,
  ResizablePanel,
  ResizableGroup,
} from "@/lib/components/core/default/resizable";

export default function ResizableDemo() {
  const ref = React.useRef<ImperativePanelHandle>(null);

  const collapsePanel = () => {
    if (ref.current) {
      ref.current.collapse();
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <Button onClick={collapsePanel}>Collapse</Button>
      <ResizableGroup direction="horizontal" className="max-w-md rounded-lg border">
        <ResizablePanel
          ref={ref}
          defaultSize={50}
          minSize={20}
          collapsible
          collapsedSize={10}
        >
          <div className="flex items-center justify-center p-6">
            <span className="font-semibold">One</span>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75}>
          <div className="flex items-center justify-center p-6">
            <span className="font-semibold">Two</span>
          </div>
        </ResizablePanel>
      </ResizableGroup>
    </div>
  );
}
