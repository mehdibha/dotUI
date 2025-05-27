import { ToggleButton } from "@/components/dynamic-ui/toggle-button";
import { ToggleButtonGroup } from "@/components/dynamic-ui/toggle-button-group";

export default function Demo() {
  return (
    <ToggleButtonGroup variant="accent">
      <ToggleButton>A</ToggleButton>
      <ToggleButton>B</ToggleButton>
      <ToggleButton>C</ToggleButton>
    </ToggleButtonGroup>
  );
}
