import { Label } from "@dotui/registry/ui/field";
import { TextArea } from "@dotui/registry/ui/input";
import { TextField } from "@dotui/registry/ui/text-field";

export default function Demo() {
  return (
    <div className="space-y-4">
      <TextField>
        <Label>Description</Label>
        <TextArea />
      </TextField>
      <TextField aria-label="Description">
        <TextArea />
      </TextField>
    </div>
  );
}
