import { PinIcon } from "lucide-react";
import { ToggleButton } from "@/lib/components/core/default/toggle-button";

const sizes = ["sm", "md", "lg"] as const;

export default function Demo() {
  return (
    <div className="flex items-center gap-4">
      {sizes.map((size) => (
        <ToggleButton key={size} size={size} variant="outline" aria-label="Toggle pin">
          <PinIcon className="rotate-45" />
        </ToggleButton>
      ))}
    </div>
  );
}
