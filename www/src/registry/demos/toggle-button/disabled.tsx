import { ToggleButton } from "@/components/dynamic-core/toggle-button";
import { PinIcon } from "@/__icons__";

export default function Demo() {
  return (
    <ToggleButton isDisabled aria-label="Toggle pin">
      <PinIcon className="rotate-45" />
    </ToggleButton>
  );
}
