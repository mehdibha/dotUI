import { PinIcon } from "@/__icons__";
import { ToggleButton } from "@/registry/ui/default/core/toggle-button";

export default function Demo() {
  return (
    <ToggleButton aria-label="Toggle pin">
      <PinIcon className="rotate-45" />
    </ToggleButton>
  );
}
