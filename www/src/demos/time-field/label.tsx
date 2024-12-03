import { TimeField } from "@/registry/ui/default/core/time-field";

export default function Demo() {
  return (
    <div className="space-y-4">
      <TimeField label="Event time" />
      <TimeField aria-label="Event time" />
    </div>
  );
}
