import { Description, Label } from "@/components/dynamic-core/field";
import {
  SliderControls,
  SliderRoot,
  SliderValueLabel,
} from "@/components/dynamic-core/slider";

export default function Demo() {
  return (
    <SliderRoot defaultValue={50}>
      <div className="flex items-center justify-between">
        <Label>Volume</Label>
        <SliderValueLabel />
      </div>
      <SliderControls />
      <Description>Adjust the volume.</Description>
    </SliderRoot>
  );
}
