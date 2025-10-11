"use client";

import { Separator } from "@dotui/registry-v2/ui/separator";

export function SeparatorDemo() {
  return (
    <div>
      <div className="space-y-1">
        <h4 className="text-sm leading-none font-medium">Tanstack start</h4>
        <p className="text-sm text-fg-muted">
          Full-stack Framework for React and Solid
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Routing</div>
        <Separator orientation="vertical" />
        <div>SSR</div>
        <Separator orientation="vertical" />
        <div>Deploy Anywhere</div>
      </div>
    </div>
  );
}
