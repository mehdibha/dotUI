"use client";

import { Description, Label } from "@dotui/registry-v2/ui/field";
import { Slider } from "@dotui/registry-v2/ui/slider";

export function SliderDemo() {
  return (
    <div className="space-y-4">
      <div className="flex gap-8">
        {/* Horizontal Sliders */}
        <div
          className="space-y-4"
          // TODO: check on flex, it's awful
          // className="flex items-start"
        >
          <Slider aria-label="simple slider" defaultValue={50}>
            <Slider.Control />
          </Slider>

          <Slider aria-label="range slider" defaultValue={[25, 75]}>
            <Slider.Control />
          </Slider>

          <Slider
            aria-label="multiple values slider"
            defaultValue={[15, 40, 60]}
          >
            <Slider.Control />
          </Slider>

          <Slider aria-label="disabled" defaultValue={50} isDisabled>
            <Slider.Control />
          </Slider>
        </div>

        {/* Veritcal Sliders */}
        <div className="flex gap-4">
          <Slider
            aria-label="simple slider"
            orientation="vertical"
            defaultValue={50}
          >
            <Slider.Control />
          </Slider>

          <Slider
            aria-label="range slider"
            orientation="vertical"
            defaultValue={[25, 75]}
          >
            <Slider.Control />
          </Slider>

          <Slider
            aria-label="multiple values slider"
            orientation="vertical"
            defaultValue={[15, 40, 60]}
          >
            <Slider.Control />
          </Slider>

          <Slider
            aria-label="disabled"
            orientation="vertical"
            defaultValue={50}
            isDisabled
          >
            <Slider.Control />
          </Slider>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 *:w-full">
        <Slider defaultValue={30}>
          <div className="flex items-center justify-between">
            <Label>Volume</Label>
            <Slider.Output />
          </div>
          <Slider.Control>
            <Slider.Filler />
            <Slider.Thumb />
          </Slider.Control>
          <Description>Adjust the volume of the audio</Description>
        </Slider>

        <Slider
          defaultValue={[25, 75]}
          formatOptions={{ style: "currency", currency: "USD" }}
        >
          <div className="flex items-center justify-between">
            <Label>Price range</Label>
            <Slider.Output />
          </div>
          <Slider.Control />
          <Description>Adjust the price range</Description>
        </Slider>

        <Slider defaultValue={[25, 75]} isDisabled>
          <div className="flex items-center justify-between">
            <Label>Price range</Label>
            <Slider.Output />
          </div>
          <Slider.Control />
          <Description>Adjust the price range</Description>
        </Slider>
      </div>
    </div>
  );
}

{
  /* {(["sm", "md", "lg"] as const).map((size) => (
  <div key={size} className="space-y-4">
    <Slider size={size} label="Volume" defaultValue={30} showValueLabel />
    <Slider
      size={size}
      label="Brightness"
      defaultValue={50}
      variant="primary"
      showValueLabel
    />
  </div>
))}
<Slider
  label="Price range"
  defaultValue={[25, 75]}
  showValueLabel
  getValueLabel={(values) => `$${values[0]} - $${values[1]}`}
/>
<Slider
  label="Temperature"
  defaultValue={20}
  minValue={0}
  maxValue={100}
  step={5}
  showValueLabel
  getValueLabel={(values) => `${values[0]}°C`}
/>
<Slider
  orientation="vertical"
  label="Vertical slider"
  defaultValue={60}
  showValueLabel
/>
<Slider label="Disabled" defaultValue={50} isDisabled showValueLabel /> */
}
