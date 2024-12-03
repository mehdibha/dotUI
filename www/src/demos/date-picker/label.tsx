import { DatePicker } from "@/components/dynamic-core/date-picker";

export default function Demo() {
  return (
    <div className="space-y-4">
      <DatePicker label="Meeting date" />
      <DatePicker aria-label="Meeting date" />
    </div>
  );
}
