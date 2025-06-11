import { Badge } from "@/components/dynamic-ui/badge";
import { ShieldIcon } from "lucide-react";

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
