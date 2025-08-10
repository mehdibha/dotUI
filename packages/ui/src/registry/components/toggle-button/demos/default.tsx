import { ToggleButton } from "@dotui/ui/components/toggle-button";
import { PinIcon } from "@dotui/ui/icons";

export default function Demo() {
  return (
    <ToggleButton aria-label="Toggle pin">
      <PinIcon className="rotate-45" />
    </ToggleButton>
  );
}
