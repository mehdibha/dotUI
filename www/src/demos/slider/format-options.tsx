import { Slider } from "@/registry/ui/default/core/slider";

export default function Demo() {
  return (
    <Slider
      label="Price"
      formatOptions={{ style: "currency", currency: "JPY" }}
      defaultValue={60}
      valueLabel
    />
  );
}
