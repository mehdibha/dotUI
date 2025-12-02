"use client";

import { Label } from "@dotui/registry/ui/field";

import { Slider, SliderControl } from "@dotui/registry/ui/slider";

interface SliderPlaygroundProps {
  label?: string;
  isDisabled?: boolean;
  orientation?: "horizontal" | "vertical";
}

export function SliderPlayground({
  label = "Volume",
  ...props
}: SliderPlaygroundProps) {
  return (
    <Slider defaultValue={50} {...props}>
      {label && <Label>{label}</Label>}
      <SliderControl />
    </Slider>
  );
}
