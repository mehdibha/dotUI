import { Slider } from "@/components/dynamic-core/slider";

export default function Demo() {
  return (
    <Slider label="Opacity" valueLabel minValue={0} maxValue={100} step={5} />
  );
}
