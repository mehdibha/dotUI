import {
  CheckboxIndicator,
  CheckboxRoot,
} from "@/components/dynamic-ui/checkbox";

export default function Demo() {
  return (
    <CheckboxRoot className="selected:border-border-accent selected:bg-bg-accent-muted selected:text-fg-accent rounded-md border p-4 transition-colors">
      <span>I agree to the terms and conditions</span>
      <CheckboxIndicator className="group-selected:bg-bg-accent group-selected:text-fg-onAccent" />
    </CheckboxRoot>
  );
}
