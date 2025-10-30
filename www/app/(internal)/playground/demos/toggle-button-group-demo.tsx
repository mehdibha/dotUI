import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react";

import { ToggleButton } from "@dotui/registry/ui/toggle-button";
import { ToggleButtonGroup } from "@dotui/registry/ui/toggle-button-group";

export function ToggleButtonGroupDemo() {
  return (
    <div className="space-y-4">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-4">
          <ToggleButtonGroup variant="quiet" size={size}>
            <ToggleButton defaultSelected>
              <BoldIcon />
            </ToggleButton>
            <ToggleButton>
              <ItalicIcon />
            </ToggleButton>
            <ToggleButton>
              <UnderlineIcon />
            </ToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup>
            <ToggleButton defaultSelected>
              <BoldIcon />
            </ToggleButton>
            <ToggleButton>
              <ItalicIcon />
            </ToggleButton>
            <ToggleButton>
              <UnderlineIcon />
            </ToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup
            variant="quiet"
            size={size}
            disallowEmptySelection
            defaultSelectedKeys={["all"]}
          >
            <ToggleButton id="all">All</ToggleButton>
            <ToggleButton id="missed">Missed</ToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup
            size={size}
            disallowEmptySelection
            defaultSelectedKeys={["all"]}
          >
            <ToggleButton id="all" defaultSelected>
              All
            </ToggleButton>
            <ToggleButton id="missed">Missed</ToggleButton>
          </ToggleButtonGroup>
        </div>
      ))}

      <div className="flex gap-8">
        {(["sm", "md", "lg"] as const).map((size) => (
          <div key={size} className="flex gap-2">
            <ToggleButtonGroup
              orientation="vertical"
              variant="default"
              size={size}
            >
              <ToggleButton defaultSelected>
                <BoldIcon />
              </ToggleButton>
              <ToggleButton>
                <ItalicIcon />
              </ToggleButton>
              <ToggleButton>
                <UnderlineIcon />
              </ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup
              orientation="vertical"
              variant="quiet"
              size={size}
            >
              <ToggleButton defaultSelected>
                <BoldIcon />
              </ToggleButton>
              <ToggleButton>
                <ItalicIcon />
              </ToggleButton>
              <ToggleButton>
                <UnderlineIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        ))}
      </div>
    </div>
  );
}
