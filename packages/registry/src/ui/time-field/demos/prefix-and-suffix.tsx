import { TimerIcon } from "@dotui/registry/icons";
import { DateInput, InputAddon, InputGroup } from "@dotui/registry/ui/input";
import { TimeField } from "@dotui/registry/ui/time-field";

export default function Demo() {
  return (
    <div className="space-y-2">
      <TimeField aria-label="Event time">
        <InputGroup>
          <InputAddon>
            <TimerIcon />
          </InputAddon>
          <DateInput />
        </InputGroup>
      </TimeField>

      <TimeField aria-label="Event time">
        <InputGroup>
          <DateInput />
          <InputAddon>
            <TimerIcon />
          </InputAddon>
        </InputGroup>
      </TimeField>
    </div>
  );
}
