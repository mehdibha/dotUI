import { RadioGroup, RadioCard } from "@/lib/components/core/default/radio";

export default function Demo() {
  return (
    <RadioGroup defaultValue="sm" label="Size" orientation="horizontal">
      <RadioCard value="sm" title="Small" description="Dimension: 128 x 128" />
      <RadioCard value="md" title="Medium" description="Dimension: 256 x 256" />
      <RadioCard value="lg" title="Large" description="Dimension: 512 x 512" />
    </RadioGroup>
  );
}
