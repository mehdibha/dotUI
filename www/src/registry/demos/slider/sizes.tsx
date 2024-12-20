import { Slider } from "@/components/dynamic-core/slider";

export default function Demo() {
  return (
    <div className="space-y-4">
      <Slider aria-label="Opacity" defaultValue={50} size="sm" />
      <Slider aria-label="Opacity" defaultValue={50} size="md" />
      <Slider aria-label="Opacity" defaultValue={50} size="lg" />
    </div>
  );
}
