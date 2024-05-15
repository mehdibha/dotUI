import { Bold } from "lucide-react";
import { ToggleButton } from "@/lib/components/core/default/toggle-button";

export default function ToggleDemo() {
  return (
    <ToggleButton aria-label="Toggle bold" defaultSelected>
      <Bold />
    </ToggleButton>
  );
}
