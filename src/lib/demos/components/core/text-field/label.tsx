import { TextField } from "@/lib/components/core/default/text-field";

export default function InputWithLabelDemo() {
  return (
    <div className="space-y-4">
      <TextField label="Email" placeholder="Visual label" />
      <TextField aria-label="Email" placeholder="Hidden label" />
    </div>
  );
}
