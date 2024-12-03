import { TimeField } from "@/components/dynamic-core/time-field";
import { TimerIcon } from "@/__icons__";

export default function Demo() {
  return (
    <div className="space-y-2">
      <TimeField prefix={<TimerIcon />} />
      <TimeField suffix={<TimerIcon />} />
    </div>
  );
}
