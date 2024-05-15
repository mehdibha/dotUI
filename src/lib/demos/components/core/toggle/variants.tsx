import { Bold } from "lucide-react";
import { ToggleButton } from "@/lib/components/core/default/toggle-button";

const variants = ["ghost", "outline"] as const;

export default function ToggleDemo() {
  return (
    <div className="flex items-center gap-4">
      {variants.map((variant) => (
        <ToggleButton key={variant} variant={variant} aria-label="Toggle bold">
          <Bold />
        </ToggleButton>
      ))}
    </div>
  );
}
