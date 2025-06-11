import { ToggleButton } from "@/components/dynamic-ui/toggle-button";
import { PinIcon } from "lucide-react";

export default function Demo() {
  return (
    <ToggleButton aria-label="Toggle pin">
      <PinIcon className="rotate-45" />
    </ToggleButton>
  );
}
