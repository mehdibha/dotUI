"use client";

import { ColorField } from "@dotui/registry-v2/ui/color-field";

export function ColorFieldDemo() {
  return (
    <div className="flex flex-col gap-6">
      {(["sm", "md", "lg"] as const).map((size) => (
        <ColorField key={size} size={size} label={`Size: ${size}`} />
      ))}

      <ColorField label="Color" description="Enter a hex color value" />

      <ColorField
        label="Required color"
        isRequired
        errorMessage="Please enter a color"
      />

      <ColorField label="Disabled" isDisabled />

      <ColorField label="Theme color" placeholder="#000000" />
    </div>
  );
}
