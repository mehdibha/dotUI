import { Slider } from "@dotui/registry/ui/slider";

export default function Demo() {
  return (
    <Slider label="Cookies to" minValue={1} maxValue={50} defaultValue={25} />
  );
}
