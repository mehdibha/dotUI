import React from "react";
import { Slider } from "@/components/dynamic-ui/slider";

export function SliderDemo() {
  return (
    <div className="flex flex-col gap-8">
      <Slider label="Default slider" defaultValue={30} />
      <Slider label="Disabled" defaultValue={60} isDisabled />
    </div>
  );
}
