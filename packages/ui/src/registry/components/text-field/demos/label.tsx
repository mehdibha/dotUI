import { TextField } from "@dotui/ui/components/text-field";

export default function Demo() {
  return (
    <div className="space-y-4">
      <TextField label="Email" placeholder="Visible label" />
      <TextField aria-label="Email" placeholder="Hidden label" />
    </div>
  );
}
