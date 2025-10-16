import { HeartIcon, LightbulbIcon, PinIcon } from "lucide-react";

import {
  ToggleButton,
  ToggleButtonProvider,
} from "@dotui/registry-v2/ui/toggle-button";

export function ToggleButtonDemo() {
  return (
    <div className="space-y-8">
      {(["sm", "md", "lg"] as const).map((size) => (
        <ToggleButtonProvider key={size} variant="quiet" size={size}>
          <div className="flex flex-wrap items-center gap-2">
            <ToggleButton aria-label="Pin" variant="quiet">
              <PinIcon />
            </ToggleButton>
            <ToggleButton aria-label="Pin">
              <PinIcon />
            </ToggleButton>
            <ToggleButton aria-label="Heart" defaultSelected>
              <HeartIcon />
            </ToggleButton>
            <ToggleButton aria-label="Heart" isDisabled>
              disabled
            </ToggleButton>
            <ToggleButton aria-label="Heart" isDisabled defaultSelected>
              disabled/toggled
            </ToggleButton>
            <ToggleButton aria-label="Heart">
              <LightbulbIcon />
              Think
            </ToggleButton>
          </div>
        </ToggleButtonProvider>
      ))}
    </div>
  );
}
