import { LayoutTemplateIcon } from "lucide-react";

import { Button } from "@dotui/ui/components/button";

export function Announcement() {
  return (
    <Button
      href="/docs/getting-started/introduction"
      prefix={<LayoutTemplateIcon />}
      className="text-fg-muted mb-3 h-7 rounded-lg text-xs [&_svvg]:size-4"
    >
      Shadcn CLI support is here!
    </Button>
  );
}
