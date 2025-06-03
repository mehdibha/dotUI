import { ToggleButton } from "@/components/dynamic-ui/toggle-button";
import { PinIcon } from "lucide-react";

export default function Demo() {
  return (
    <div className="flex items-center gap-4">
      <ToggleButton shape="square" aria-label="Toggle pin">
        <PinIcon className="rotate-45" />
      </ToggleButton>
      <ToggleButton shape="circle" aria-label="Toggle pin">
        <PinIcon className="rotate-45" />
      </ToggleButton>
      <ToggleButton
        variant="accent"
        shape="rectangle"
        prefix={<PinIcon className="rotate-45" />}
        defaultSelected
        aria-label="Toggle pin"
      >
        Pin
      </ToggleButton>
    </div>
  );
}
