import { HeartIcon, LightbulbIcon, PinIcon } from "lucide-react";

import { ToggleButton } from "@dotui/registry-v2/ui/toggle-button";

export function ToggleButtonDemo() {
  return (
    <div className="space-y-8">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-2">
          <ToggleButton aria-label="Pin" size={size} variant="quiet">
            <PinIcon />
          </ToggleButton>
          <ToggleButton aria-label="Pin" size={size}>
            <PinIcon />
          </ToggleButton>
          <ToggleButton aria-label="Heart" defaultSelected size={size}>
            <HeartIcon />
          </ToggleButton>
          <ToggleButton aria-label="Heart" isDisabled size={size}>
            disabled
          </ToggleButton>
          <ToggleButton
            aria-label="Heart"
            isDisabled
            defaultSelected
            size={size}
          >
            disabled/toggled
          </ToggleButton>
          <ToggleButton aria-label="Heart" size={size}>
            <LightbulbIcon />
            Think
          </ToggleButton>
        </div>
      ))}
    </div>
  );
}
