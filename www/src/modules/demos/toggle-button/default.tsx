import { PinIcon } from "lucide-react";
import { ToggleButton } from "@/components/dynamic-core/toggle-button";

export default function Demo() {
  return (
    <ToggleButton aria-label="Toggle pin">
      <PinIcon className="rotate-45" />
    </ToggleButton>
  );
}
