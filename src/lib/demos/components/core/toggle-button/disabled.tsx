import { PinIcon } from "lucide-react";
import { ToggleButton } from "@/lib/components/core/default/toggle-button";

export default function Demo() {
  return (
    <ToggleButton isDisabled aria-label="Toggle pin">
      <PinIcon className="rotate-45" />
    </ToggleButton>
  );
}
