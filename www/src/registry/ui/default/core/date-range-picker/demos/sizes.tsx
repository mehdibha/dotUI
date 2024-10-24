import { DateRangePicker } from "@/registry/ui/default/core/date-range-picker";

export default function Demo() {
  return (
    <div className="flex flex-col gap-2">
      <DateRangePicker label="small" size="sm" />
      <DateRangePicker label="medium" size="md" />
      <DateRangePicker label="large" size="lg" />
    </div>
  );
}
