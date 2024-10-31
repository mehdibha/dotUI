"use client";

import { ColorPicker } from "@/registry/ui/default/core/color-picker";
import { Label } from "@/registry/ui/default/core/field";

export const ButtonsCustomizer = () => {
  return (
    <div className="rounded-lg border p-6">
      <h3 className="text-lg font-semibold">Buttons</h3>
      {/* 200px 1fr */}
      <div className="mt-4">
        <div className="flex flex-col items-start gap-2">
          <Label>Primary background</Label>
          <ColorPicker shape="rectangle">
            {({ color }) => <>{color.toString("hsl")}</>}
          </ColorPicker>
        </div>
        <div className="rounded-lg"></div>
      </div>
    </div>
  );
};
