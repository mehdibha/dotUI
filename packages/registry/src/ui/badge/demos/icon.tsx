import { ShieldIcon } from "@dotui/registry/icons";
import { Badge } from "@dotui/registry/ui/badge";

export default function Demo() {
  return (
    <div className="flex items-center gap-2">
      <Badge size="sm">
        <ShieldIcon />
        Badge
      </Badge>
      <Badge size="md">
        <ShieldIcon />
        Badge
      </Badge>
      <Badge size="lg">
        <ShieldIcon />
        Badge
      </Badge>
    </div>
  );
}
