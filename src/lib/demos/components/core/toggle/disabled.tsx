import { Bold } from "lucide-react";
import { ToggleButton } from "@/lib/components/core/default/toggle-button";

export default function ToggleDemo() {
  return (
    <div className="flex items-center gap-4">
      <ToggleButton isDisabled variant="ghost" aria-label="Toggle bold">
        <Bold />
      </ToggleButton>
      <ToggleButton isDisabled variant="outline" aria-label="Toggle bold">
        <Bold />
      </ToggleButton>
    </div>
  );
}
