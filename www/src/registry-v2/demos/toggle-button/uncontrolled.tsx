import { ToggleButton } from "@/components/dynamic-core/toggle-button";
import { PinIcon } from "@/__icons__";

export default function Demo() {
  return (
    <ToggleButton aria-label="Toggle pin" defaultSelected>
      <PinIcon className="rotate-45" />
    </ToggleButton>
  );
}
