import { Bold } from "lucide-react";
import { ToggleButton } from "@/lib/components/core/default/toggle-button";

const sizes = ["sm", "md", "lg"] as const;

export default function ToggleDemo() {
  return (
    <div className="flex items-center gap-4">
      {sizes.map((size) => (
        <ToggleButton key={size} size={size} aria-label="Toggle bold">
          <Bold />
        </ToggleButton>
      ))}
    </div>
  );
}
