import { Slider, SliderControl } from "@dotui/registry/ui/slider";

import { getComponentVariants } from "@/modules/style-editor/components-editor/demos/utils";
import { Section } from "@/modules/style-editor/components-editor/section";

export function Sliders() {
  return (
    <Section
      name="slider"
      title="Sliders"
      variants={getComponentVariants("slider")}
      previewClassName="flex-col gap-4"
    >
      <Slider defaultValue={50} aria-label="Basic slider">
        <SliderControl />
      </Slider>
    </Section>
  );
}
