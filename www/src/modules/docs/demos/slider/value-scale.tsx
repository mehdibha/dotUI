import { Slider } from "@/components/dynamic-ui/slider";

export default function Demo() {
  return (
    <Slider label="Cookies to" minValue={1} maxValue={50} defaultValue={25} />
  );
}
