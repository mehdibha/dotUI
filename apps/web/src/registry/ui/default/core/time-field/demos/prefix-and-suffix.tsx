import { TimerIcon } from "@/lib/icons";
import { TimeField } from "@/registry/ui/default/core/time-field";

export default function Demo() {
  return (
    <div className="space-y-2">
      <TimeField prefix={<TimerIcon />} />
      <TimeField suffix={<TimerIcon />} />
    </div>
  );
}
