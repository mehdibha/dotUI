import {
  CloudDownloadIcon,
  LayoutGridIcon,
  ListIcon,
  UserRoundPlusIcon,
} from "lucide-react";

import { Button } from "@dotui/ui/components/button";
import { TextField } from "@dotui/ui/components/text-field";
import { ToggleButton } from "@dotui/ui/components/toggle-button";

export default function BlocksPage() {
  return (
    <div className="p-10">
      <h2 className="w-fit text-3xl font-semibold tracking-tight">
        Find your style or make your own.
      </h2>
      <p className="text-fg-muted mt-2 text-base">
        Choose a style to get started or create your own.
      </p>
      <h2 className="mt-16 text-2xl font-semibold tracking-tight">
        Featured styles
      </h2>
      <div className="mt-6 grid grid-cols-2 gap-2">
        {[
          {
            name: "Geist",
            description: "A modern, minimalistic style.",
          },
          {
            name: "Shadcn",
            description: "A minimalistic style.",
          },
          {
            name: "Brutalist",
            description: "A brutalist style.",
          },
        ].map((style) => (
          <div
            key={style.name}
            className="flex items-end justify-between gap-4 rounded-sm border p-6"
          >
            <div>
              <div className="flex items-center gap-4">
                <h2 className="font-heading text-2xl font-medium tracking-tight">
                  {style.name}
                </h2>
                <Button variant="default" className="h-6 text-xs">
                  View style
                </Button>
              </div>
              <p className="text-fg-muted mt-1 text-base">
                {style.description}
              </p>
            </div>
            <div className="min-w-[220px] space-y-4">
              <TextField placeholder="Email" className="w-full" />
              <div className="flex items-center justify-between gap-2">
                <Button variant="accent" prefix={<UserRoundPlusIcon />}>
                  Invite
                </Button>
                <div className="flex items-center">
                  <ToggleButton
                    variant="accent"
                    className="rounded-r-none border-r-0"
                  >
                    <ListIcon />
                  </ToggleButton>
                  <ToggleButton variant="accent" className="rounded-l-none">
                    <LayoutGridIcon />
                  </ToggleButton>
                </div>
                <Button shape="square">
                  <CloudDownloadIcon />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
