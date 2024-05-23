import { TextField } from "@/lib/components/core/default/text-field";

export default function InputStatusDemo() {
  return (
    <div className="space-y-4">
      <TextField type="success" label="Success" />
      <TextField type="warning" label="Warning" />
      <TextField type="danger" label="Danger" />
    </div>
  );
}
