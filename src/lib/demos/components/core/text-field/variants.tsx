import { TextField } from "@/lib/components/core/default/text-field";

export default function Demo() {
  return (
    <div className="space-y-4">
      <TextField variant="success" label="Success" />
      <TextField variant="warning" label="Warning" />
      <TextField variant="danger" label="Danger" />
    </div>
  );
}
