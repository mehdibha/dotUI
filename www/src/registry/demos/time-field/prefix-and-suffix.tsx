import { TimerIcon } from "lucide-react";
import { TimeField } from "@/components/dynamic-core/time-field";

export default function Demo() {
  return (
    <div className="space-y-2">
      <TimeField prefix={<TimerIcon />} />
      <TimeField suffix={<TimerIcon />} />
    </div>
  );
}
