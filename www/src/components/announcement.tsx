import { LayoutTemplateIcon } from "lucide-react";
import { Button } from "@/registry/core/button_basic";

export function Announcement() {
  return (
    <Button
      href="/docs/getting-started/introduction"
      prefix={<LayoutTemplateIcon />}
      variant="outline"
      className="bg-bg-inverse/5 text-fg-muted mb-3 h-7 rounded-lg text-xs [&_svvg]:size-4"
    >
      Introducing dotUI beta
    </Button>
  );
}
