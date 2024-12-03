import { Badge } from "@/registry/core/badge";
import { ShieldIcon } from "@/__icons__";

export default function Demo() {
  return (
    <div className="flex items-center gap-2">
      <Badge icon={<ShieldIcon />} size="sm">
        Badge
      </Badge>
      <Badge icon={<ShieldIcon />} size="md">
        Badge
      </Badge>
      <Badge icon={<ShieldIcon />} size="lg">
        Badge
      </Badge>
    </div>
  );
}
