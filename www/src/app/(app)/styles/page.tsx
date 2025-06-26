import { LayoutGridIcon, ListIcon, PinIcon } from "lucide-react";

import { Button } from "@dotui/ui/components/button";
import { TextField } from "@dotui/ui/components/text-field";
import { ToggleButton } from "@dotui/ui/components/toggle-button";

export default function BlocksPage() {
  return (
    <div className="p-10">
      <h2 className="w-fit text-3xl font-semibold tracking-tight">
        Find your style or make your own.
      </h2>
      <h2 className="mt-16 text-2xl font-semibold tracking-tight">
        Featured styles
      </h2>
      <div className="mt-6 grid grid-cols-2 gap-6">
        {[
          {
            name: "Geist",
            description: "A modern, minimalistic style.",
          },
        ].map((style) => (
          <div key={style.name} className="grid grid-cols-5 border p-6">
            <div className="col-span-2 flex flex-col justify-end">
              <h2 className="font-heading text-2xl font-medium tracking-tight">
                {style.name}
              </h2>
              <p className="text-fg-muted mt-1 text-base">
                {style.description}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Button variant="default" className="h-6 rounded-full text-xs">
                  View
                </Button>
              </div>
            </div>
            <div className="col-span-3 space-y-4">
              <TextField
                label="Email"
                description="Enter your email"
                className="w-full"
              />
              <div className="flex items-center gap-2">
                <Button variant="accent">Apply</Button>
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
