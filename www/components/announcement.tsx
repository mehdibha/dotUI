import { AlertTriangleIcon, LayoutTemplateIcon } from "lucide-react";

import { Badge } from "@dotui/ui/components/badge";
import { Button } from "@dotui/ui/components/button";

export function Announcement() {
  return (
    <Badge className="mb-3 h-7 rounded-lg text-xs">
      <AlertTriangleIcon />
      Project under development
    </Badge>
  );
  // return (
  //   <Button
  //     variant="warning"
  //     prefix={<AlertTriangleIcon />}
  //     href="/docs/getting-started/introduction"
  //     className="text-fg-muted mb-3 h-7 rounded-lg text-xs [&_svvg]:size-4"
  //   >
  //     Under development
  //   </Button>
  // );
}
