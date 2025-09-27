import { TextField } from "@dotui/ui/components/text-field";

export default function Demo() {
  return (
    <div className="flex items-center gap-4">
      <TextField aria-label="small (sm)" placeholder="small (sm)" size="sm" />
      <TextField aria-label="medium (md)" placeholder="medium (md)" size="md" />
      <TextField aria-label="large (lg)" placeholder="large (lg)" size="lg" />
    </div>
  );
}
