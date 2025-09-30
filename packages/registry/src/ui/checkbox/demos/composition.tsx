import { CheckboxIndicator, CheckboxRoot } from "@dotui/registry/ui/checkbox";

export default function Demo() {
  return (
    <CheckboxRoot className="selected:border-border-accent selected:bg-accent-muted selected:text-fg-accent rounded-md border p-4 transition-colors">
      <span>I agree to the terms and conditions</span>
      <CheckboxIndicator className="group-selected:bg-accent group-selected:text-fg-on-accent" />
    </CheckboxRoot>
  );
}
