import { TimeField } from "@/components/dynamic-ui/time-field";

export default function Demo() {
  return (
    <div className="flex items-center gap-4">
      <TimeField label="small (sm)" size="sm" />
      <TimeField label="medium (md)" size="md" />
      <TimeField label="large (lg)" size="lg" />
    </div>
  );
}
