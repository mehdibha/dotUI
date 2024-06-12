import { DateRangePicker } from "@/lib/components/core/default/date-range-picker";

export default function Demo() {
  return (
    <div className="flex items-center gap-4">
      <DateRangePicker label="small (sm)" size="sm" />
      <DateRangePicker label="medium (md)" size="md" />
      <DateRangePicker label="large (lg)" size="lg" />
    </div>
  );
}
