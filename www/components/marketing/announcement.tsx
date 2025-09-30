import { LayoutTemplateIcon } from "lucide-react";

import { Button } from "@dotui/registry/ui/button";

export function Announcement() {
  return (
    <Button
      prefix={<LayoutTemplateIcon />}
      href="/docs/changelog"
      className="text-fg-muted mb-3 h-7 rounded-lg text-xs [&_svvg]:size-4"
    >
      Introducing a dynamic shadcn registry
    </Button>
  );
}
