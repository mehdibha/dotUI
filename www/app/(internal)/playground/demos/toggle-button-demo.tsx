import { HeartIcon, LightbulbIcon, PinIcon } from "lucide-react";

import {
  ToggleButton,
  ToggleButtonProvider,
} from "@dotui/registry/ui/toggle-button";

export function ToggleButtonDemo() {
  return (
    <div className="space-y-8">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="space-y-2">
          <ToggleButtonProvider size={size}>
            <div className="flex flex-wrap items-center gap-4 *:flex *:items-center *:gap-1">
              <div>
                <ToggleButton aria-label="Pin">
                  <HeartIcon />
                </ToggleButton>
                <ToggleButton aria-label="Heart" defaultSelected>
                  <HeartIcon />
                </ToggleButton>
              </div>

              <div>
                <ToggleButton aria-label="Heart" isDisabled>
                  disabled
                </ToggleButton>
                <ToggleButton aria-label="Heart" isDisabled defaultSelected>
                  disabled/toggled
                </ToggleButton>
              </div>

              <div>
                <ToggleButton aria-label="Heart">
                  <LightbulbIcon />
                  Think
                </ToggleButton>
                <ToggleButton aria-label="Heart" defaultSelected>
                  <LightbulbIcon />
                  Think
                </ToggleButton>
              </div>
            </div>
          </ToggleButtonProvider>
          <ToggleButtonProvider key={size} size={size} variant="quiet">
            <div className="flex flex-wrap items-center gap-2">
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
        </div>
      ))}
    </div>
  );
}
