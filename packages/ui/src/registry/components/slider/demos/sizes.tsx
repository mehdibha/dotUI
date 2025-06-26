import { Slider } from "@dotui/ui/components/slider";

export default function Demo() {
  return (
    <div className="space-y-4">
      <Slider label="sm" defaultValue={50} size="sm" />
      <Slider label="md" defaultValue={50} size="md" />
      <Slider label="lg" defaultValue={50} size="lg" />
    </div>
  );
}
