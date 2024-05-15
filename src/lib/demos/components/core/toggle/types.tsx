import { Bold } from "lucide-react";
import { ToggleButton } from "@/lib/components/core/default/toggle-button";

const types = ["neutral", "primary", "success", "warning", "danger"] as const;

export default function ToggleDemo() {
  return (
    <div className="flex items-center gap-4">
      {types.map((type) => (
        <ToggleButton key={type} type={type} aria-label="Toggle bold">
          <Bold />
        </ToggleButton>
      ))}
    </div>
  );
}
