import {
  BrainIcon,
  HeartIcon,
  LightbulbIcon,
  PinIcon,
  Repeat1Icon,
} from "lucide-react";

import { ToggleButton } from "@dotui/registry-v2/ui/toggle-button";

export function ToggleButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <ToggleButton aria-label="Pin">
        <PinIcon />
      </ToggleButton>
      <ToggleButton aria-label="Heart" defaultSelected>
        <HeartIcon />
      </ToggleButton>
      <ToggleButton aria-label="Heart" isDisabled shape="rectangle">
        disabled
      </ToggleButton>
      <ToggleButton
        aria-label="Heart"
        isDisabled
        defaultSelected
        shape="rectangle"
      >
        disabled/toggled
      </ToggleButton>
      <ToggleButton
        aria-label="Heart"
        prefix={<LightbulbIcon />}
        shape="rectangle"
      >
        Think
      </ToggleButton>
    </div>
  );
}
