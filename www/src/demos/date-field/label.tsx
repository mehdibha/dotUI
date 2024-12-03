import { DateField } from "@/components/dynamic-core/date-field";

export default function Demo() {
  return (
    <div className="space-y-4">
      <DateField label="Meeting date" />
      <DateField aria-label="Meeting date" />
    </div>
  );
}
