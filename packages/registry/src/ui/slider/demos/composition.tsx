import { Volume1Icon, Volume2Icon } from "@dotui/registry/icons";
import { Description, Label } from "@dotui/registry/ui/field";
import {
  Slider,
  SliderControl,
  SliderFiller,
  SliderOutput,
  SliderThumb,
} from "@dotui/registry/ui/slider";

export default function Demo() {
  return (
    <Slider defaultValue={50} className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <Label>Volume</Label>
        <SliderOutput />
      </div>
      <div className="flex items-center gap-2">
        <Volume1Icon />
        <SliderControl>
          <SliderFiller />
          <SliderThumb />
        </SliderControl>
        <Volume2Icon />
      </div>
      <Description>Adjust the volume.</Description>
    </Slider>
  );
}
