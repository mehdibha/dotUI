import { TimerIcon } from "@dotui/registry/icons";
import { TimeField } from "@dotui/registry/ui/time-field";

export default function Demo() {
  return (
    <div className="space-y-2">
      <TimeField aria-label="Event time" prefix={<TimerIcon />} />
      <TimeField aria-label="Event time" suffix={<TimerIcon />} />
    </div>
  );
}
