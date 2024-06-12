import { DateField } from "@/lib/components/core/default/date-field";

export default function Demo() {
  return (
    <div className="space-y-4">
      <DateField label="Visible label" />
      <DateField aria-label="Hidden label" />
    </div>
  );
}
