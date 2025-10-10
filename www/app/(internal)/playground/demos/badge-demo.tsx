import { BadgeCheckIcon } from "lucide-react";

import { Badge } from "@dotui/registry-v2/ui/badge";

export function BadgeDemo() {
  return (["sm", "md", "lg"] as const).map((size) => (
    <div key={size} className="flex flex-wrap gap-2">
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-wrap gap-2">
          <Badge size={size}>Badge</Badge>
          <Badge variant="neutral" size={size}>
            Secondary
          </Badge>
          <Badge variant="danger">Destructive</Badge>
          <Badge variant="success" size={size}>
            Outline
          </Badge>
          <Badge className="bg-blue-500 text-white dark:bg-blue-600">
            <BadgeCheckIcon size={size} />
            Verified
          </Badge>
          <Badge
            className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
            size={size}
          >
            8
          </Badge>
          <Badge
            className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
            size={size}
            variant="danger"
          >
            99
          </Badge>
          <Badge
            className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
            size={size}
          >
            20+
          </Badge>
        </div>
      </div>
    </div>
  ));
}
