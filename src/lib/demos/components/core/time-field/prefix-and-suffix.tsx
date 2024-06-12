import { TimerIcon } from "lucide-react";
import { TimeField } from "@/lib/components/core/default/time-field";

export default function Demo() {
  return (
    <div className="space-y-2">
      <TimeField prefix={<TimerIcon />} />
      <TimeField suffix={<TimerIcon />} />
    </div>
  );
}
