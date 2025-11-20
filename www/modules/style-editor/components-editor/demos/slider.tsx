import { Slider, SliderControl } from "@dotui/registry/ui/slider";

import { ComponentConfig } from "@/modules/style-editor/components-editor/component-config";
import { getComponentVariants } from "@/modules/style-editor/components-editor/demos/utils";

export function Sliders() {
  return (
    <ComponentConfig
      name="slider"
      title="Sliders"
      variants={getComponentVariants("slider")}
      previewClassName="flex-col gap-4"
    >
      <Slider defaultValue={50} aria-label="Basic slider">
        <SliderControl />
      </Slider>
    </ComponentConfig>
  );
}
