import { CalendarIcon } from "@dotui/registry/icons";
import { DateField } from "@dotui/registry/ui/date-field";
import { DateInput, InputAddon, InputGroup } from "@dotui/registry/ui/input";

export default function Demo() {
  return (
    <div className="space-y-2">
      <DateField aria-label="Meeting date">
        <InputGroup>
          <InputAddon>
            <CalendarIcon />
          </InputAddon>
          <DateInput />
        </InputGroup>
      </DateField>
      <DateField aria-label="Meeting date">
        <InputGroup>
          <DateInput />
          <InputAddon>
            <CalendarIcon />
          </InputAddon>
        </InputGroup>
      </DateField>
    </div>
  );
}
