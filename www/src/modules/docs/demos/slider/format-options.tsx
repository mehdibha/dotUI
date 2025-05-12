import { Slider } from "@/components/dynamic-ui/slider";

export default function Demo() {
  return (
    <Slider
      label="Price"
      formatOptions={{ style: "currency", currency: "JPY" }}
      defaultValue={60}
      showValueLabel
    />
  );
}
