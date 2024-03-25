import { Bold } from "lucide-react";
import { Toggle } from "@/lib/components/core/default/toggle";

export default function ToggleDemo() {
  return (
    <Toggle aria-label="Toggle bold">
      <Bold className="h-4 w-4" />
    </Toggle>
  );
}
