import { ToggleButton } from "@/registry/ui/default/core/toggle-button";
import { PinIcon } from "@/__icons__";

export default function Demo() {
  return (
    <ToggleButton aria-label="Toggle pin">
      <PinIcon className="rotate-45" />
    </ToggleButton>
  );
}
