import { DateRangePicker } from "@/lib/components/core/default/date-range-picker";

export default function Demo() {
  return (
    <div className="space-y-4">
      <DateRangePicker label="Visible label" />
      <DateRangePicker aria-label="Hidden label" />
    </div>
  );
}
