import { Description, Label } from "@/components/dynamic-ui/field";
import {
  SliderFiller,
  SliderRoot,
  SliderThumb,
  SliderTrack,
  SliderValueLabel,
} from "@/components/dynamic-ui/slider";
import { Volume1Icon, Volume2Icon } from "lucide-react";

export default function Demo() {
  return (
    <SliderRoot defaultValue={50} className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <Label>Volume</Label>
        <SliderValueLabel />
      </div>
      <div className="flex items-center gap-2">
        <Volume1Icon />
        <SliderTrack>
          <SliderFiller />
          <SliderThumb />
        </SliderTrack>
        <Volume2Icon />
      </div>
      <Description>Adjust the volume.</Description>
    </SliderRoot>
  );
}
