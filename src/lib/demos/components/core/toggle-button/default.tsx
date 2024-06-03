import { PinIcon } from "lucide-react";
import { ToggleButton } from "@/lib/components/core/default/toggle-button";

export default function Demo() {
  return (
    <ToggleButton aria-label="Toggle pin" defaultSelected>
      <PinIcon className="rotate-45" />
    </ToggleButton>
  );
}
