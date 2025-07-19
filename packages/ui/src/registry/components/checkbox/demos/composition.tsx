import { CheckboxIndicator, CheckboxRoot } from "@dotui/ui/components/checkbox";

export default function Demo() {
  return (
    <CheckboxRoot className="rounded-md border p-4 transition-colors selected:border-border-accent selected:bg-bg-accent-muted selected:text-fg-accent">
      <span>I agree to the terms and conditions</span>
      <CheckboxIndicator className="group-selected:bg-bg-accent group-selected:text-fg-on-accent" />
    </CheckboxRoot>
  );
}
