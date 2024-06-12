import { TimeField } from "@/lib/components/core/default/time-field";

export default function Demo() {
  return (
    <div className="space-y-4">
      <TimeField label="Visible label" />
      <TimeField aria-label="Hidden label" />
    </div>
  );
}
