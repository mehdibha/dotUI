import { TimerIcon } from "lucide-react";

import { TimeField } from "@dotui/ui/components/time-field";

export default function Demo() {
  return (
    <div className="space-y-2">
      <TimeField aria-label="Event time" prefix={<TimerIcon />} />
      <TimeField aria-label="Event time" suffix={<TimerIcon />} />
    </div>
  );
}
