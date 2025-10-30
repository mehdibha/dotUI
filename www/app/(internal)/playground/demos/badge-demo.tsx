import { BadgeCheckIcon } from "lucide-react";

import { Badge } from "@dotui/registry/ui/badge";

export function BadgeDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Info</Badge>
      <Badge className="bg-blue-500 text-white dark:bg-blue-600">
        <BadgeCheckIcon />
        Verified
      </Badge>
      <Badge className="rounded-full font-mono tabular-nums">8</Badge>
      <Badge className="rounded-full font-mono tabular-nums" variant="danger">
        99
      </Badge>
      <Badge className="rounded-full font-mono tabular-nums">20+</Badge>
    </div>
  );
}
