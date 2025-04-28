import { PinIcon } from "lucide-react";
import { ToggleButton } from "@/components/dynamic-ui/toggle-button";

export default function Demo() {
  return (
    <ToggleButton aria-label="Toggle pin">
      <PinIcon className="rotate-45" />
    </ToggleButton>
  );
}
