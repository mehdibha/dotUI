import { ShieldIcon } from "@dotui/registry/icons";
import { Badge } from "@dotui/registry/ui/badge";

export default function Demo() {
  return (
    <div className="flex items-center gap-2">
      <Badge>
        <ShieldIcon />
        Badge
      </Badge>
    </div>
  );
}
