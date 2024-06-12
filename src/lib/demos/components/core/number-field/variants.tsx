import { NumberField } from "@/lib/components/core/default/number-field";

export default function Demo() {
  return (
    <div className="space-y-4">
      <NumberField variant="success" label="Success" />
      <NumberField variant="warning" label="Warning" />
      <NumberField variant="danger" label="Danger" />
    </div>
  );
}
