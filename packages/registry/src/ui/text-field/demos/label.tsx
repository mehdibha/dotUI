import { TextField } from "@dotui/registry/ui/text-field";

export default function Demo() {
  return (
    <div className="space-y-4">
      <TextField label="Email" placeholder="Visible label" />
      <TextField aria-label="Email" placeholder="Hidden label" />
    </div>
  );
}
