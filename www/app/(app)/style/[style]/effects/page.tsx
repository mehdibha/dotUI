"use client";

import { ColorPicker } from "@dotui/ui/components/color-picker";
import { ColorSwatch } from "@dotui/ui/components/color-swatch";
import { FormControl } from "@dotui/ui/components/form";
import { Select, SelectItem } from "@dotui/ui/components/select";
import { Slider } from "@dotui/ui/components/slider";

import { useStyleForm } from "@/modules/styles/lib/form-context";

export default function StyleEffectsPage() {
  const { form } = useStyleForm();

  return (
    <div>
      <p className="text-base font-semibold">Patterns</p>
      <FormControl
        name="effects.backgroundPattern"
        control={form.control}
        render={(props) => (
          <Select
            label="Background pattern"
            defaultSelectedKey="none"
            className="mt-2"
            {...props}
          >
            <SelectItem id="none">None</SelectItem>
            <SelectItem id="dots">Dots</SelectItem>
            <SelectItem id="lines">Lines</SelectItem>
            <SelectItem id="squares">Squares</SelectItem>
          </Select>
        )}
      />
      {/* texture applied on the entire website */}
      <FormControl
        name="effects.texture"
        control={form.control}
        render={(props) => (
          <Select
            label="Texture"
            defaultSelectedKey="none"
            className="mt-2"
            {...props}
          >
            <SelectItem id="none">None</SelectItem>
            <SelectItem id="none">None</SelectItem>
          </Select>
        )}
      />
      <p className="mt-6 text-base font-semibold">Shadows</p>
      <FormControl
        name="effects.shadows.color"
        control={form.control}
        render={(props) => (
          <ColorPicker className="mt-2 w-full" {...props}>
            <ColorSwatch />
            Shadow color
          </ColorPicker>
        )}
      />
      <div className="mt-2 grid grid-cols-2 gap-3">
        <FormControl
          name="effects.shadows.opacity"
          control={form.control}
          render={(props) => (
            <Slider
              label="Opacity"
              defaultValue={0.25}
              minValue={0}
              maxValue={1}
              step={0.05}
              getValueLabel={(value) => `${value}%`}
              className="col-span-2 w-full"
              {...props}
            />
          )}
        />
        <FormControl
          name="effects.shadows.blurRadius"
          control={form.control}
          render={(props) => (
            <Slider
              label="Blur radius"
              defaultValue={2}
              minValue={0}
              maxValue={50}
              step={1}
              getValueLabel={(value) => `${value}px`}
              className="col-span-1 w-full"
              {...props}
            />
          )}
        />
        <FormControl
          name="effects.shadows.spread"
          control={form.control}
          render={(props) => (
            <Slider
              label="Spread"
              defaultValue={0}
              minValue={0}
              maxValue={100}
              step={1}
              getValueLabel={(value) => `${value}%`}
              className="col-span-1 w-full"
              {...props}
            />
          )}
        />
        <FormControl
          name="effects.shadows.offsetX"
          control={form.control}
          render={(props) => (
            <Slider
              label="Offset X"
              defaultValue={0}
              minValue={-50}
              maxValue={50}
              step={1}
              getValueLabel={(value) => `${value}px`}
              className="col-span-1 w-full"
              {...props}
            />
          )}
        />
        <FormControl
          name="effects.shadows.offsetY"
          control={form.control}
          render={(props) => (
            <Slider
              label="Offset Y"
              defaultValue={1}
              minValue={-50}
              maxValue={50}
              step={1}
              getValueLabel={(value) => `${value}px`}
              className="col-span-1 w-full"
              {...props}
            />
          )}
        />
      </div>
    </div>
  );
}