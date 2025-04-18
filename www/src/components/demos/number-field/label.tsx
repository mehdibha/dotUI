import { NumberField } from "@/components/dynamic-core/number-field";

export default function Demo() {
  return (
    <div className="space-y-4">
      <NumberField label="Width" placeholder="Visible label" />
      <NumberField aria-label="Width" placeholder="Hidden label" />
    </div>
  );
}
