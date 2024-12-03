import { Badge } from "@/registry/core/badge";

export default function Demo() {
  return (
    <div className="flex items-center gap-2">
      <Badge variant="primary" size="sm">
        Small
      </Badge>
      <Badge variant="primary" size="md">
        Medium
      </Badge>
      <Badge variant="primary" size="lg">
        Large
      </Badge>
    </div>
  );
}
