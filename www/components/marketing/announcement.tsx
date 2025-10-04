import { LayoutTemplateIcon } from "lucide-react";

import { Button } from "@dotui/registry/ui/button";

export function Announcement() {
  return (
    <Button
      prefix={<LayoutTemplateIcon />}
      href="/docs/changelog"
      className="mb-3 h-7 rounded-lg text-xs text-fg-muted [&_svvg]:size-4"
    >
      Introducing a dynamic shadcn registry
    </Button>
  );
}
