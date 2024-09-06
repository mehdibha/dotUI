import { PinIcon } from "@/lib/icons";
import { ToggleButton } from "@/registry/ui/default/core/toggle-button";

export default function Demo() {
  return (
    <ToggleButton isDisabled aria-label="Toggle pin">
      <PinIcon className="rotate-45" />
    </ToggleButton>
  );
}
