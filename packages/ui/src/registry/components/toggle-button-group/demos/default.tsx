import { ToggleButton } from "@dotui/ui/components/toggle-button";
import { ToggleButtonGroup } from "@dotui/ui/components/toggle-button-group";

export default function Demo() {
  return (
    <ToggleButtonGroup variant="accent">
      <ToggleButton>A</ToggleButton>
      <ToggleButton>B</ToggleButton>
      <ToggleButton>C</ToggleButton>
    </ToggleButtonGroup>
  );
}
