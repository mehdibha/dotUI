import { NumberField } from "@dotui/ui/components/number-field";

export default function Demo() {
  return (
    <div className="flex items-center gap-4">
      <NumberField aria-label="small (sm)" placeholder="small (sm)" size="sm" />
      <NumberField
        aria-label="medium (md)"
        placeholder="medium (md)"
        size="md"
      />
      <NumberField aria-label="large (lg)" placeholder="large (lg)" size="lg" />
    </div>
  );
}
