"use client";

import { Separator } from "@dotui/registry-v2/ui/separator";

export function SeparatorDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-4">
        <div className="space-y-1">
          <h4 className="text-sm font-medium">Horizontal Separator</h4>
          <p className="text-sm text-fg-muted">Content above</p>
        </div>
        <Separator />
        <div className="space-y-1">
          <p className="text-sm text-fg-muted">Content below</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 space-y-1">
          <h4 className="text-sm font-medium">Vertical</h4>
          <p className="text-sm text-fg-muted">Left side</p>
        </div>
        <Separator orientation="vertical" className="h-20" />
        <div className="flex-1 space-y-1">
          <h4 className="text-sm font-medium">Separator</h4>
          <p className="text-sm text-fg-muted">Right side</p>
        </div>
      </div>
    </div>
  );
}
