import { TimeField } from "@/components/dynamic-ui/time-field";
import { TimerIcon } from "lucide-react";

export default function Demo() {
  return (
    <div className="space-y-2">
      <TimeField aria-label="Event time" prefix={<TimerIcon />} />
      <TimeField aria-label="Event time" suffix={<TimerIcon />} />
    </div>
  );
}
