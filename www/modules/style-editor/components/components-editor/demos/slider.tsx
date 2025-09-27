import { Slider } from "@dotui/ui/components/slider";

import { getComponentVariants } from "@/modules/style-editor/components/components-editor/demos/utils";
import { Section } from "@/modules/style-editor/components/components-editor/section";

export function Sliders() {
  return (
    <Section
      name="slider"
      title="Sliders"
      variants={getComponentVariants("slider")}
      previewClassName="flex-col gap-4"
    >
      <Slider defaultValue={50} aria-label="Basic slider" />
    </Section>
  );
}
