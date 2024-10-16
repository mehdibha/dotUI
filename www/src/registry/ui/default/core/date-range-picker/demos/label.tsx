import { DateRangePicker } from "@/registry/ui/default/core/date-range-picker";

export default function Demo() {
  return (
    <div className="space-y-4">
      <DateRangePicker label="Trip" />
      <DateRangePicker aria-label="Trip" />
    </div>
  );
}
