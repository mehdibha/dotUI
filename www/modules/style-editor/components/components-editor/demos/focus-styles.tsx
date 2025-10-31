import { Button } from "@dotui/registry/ui/button";
import { Checkbox } from "@dotui/registry/ui/checkbox";
import { Input } from "@dotui/registry/ui/input";
import { TextField } from "@dotui/registry/ui/text-field";

import { Section } from "@/modules/style-editor/components/components-editor/section";

export function FocusStyles() {
  return (
    <Section
      name="focus-style"
      title="Focus style"
      variants={[
        { name: "basic", label: "Basic" },
        { name: "minimal", label: "Minimal" },
      ]}
      tokens={["color-border-focus", "color-border-focus-muted"]}
      previewClassName="flex-col gap-4"
    >
      <div className="flex items-center gap-4">
        <Button>Button</Button>
        <TextField aria-label="Email" form="none">
          <Input placeholder="hello@mehdibha.com" />
        </TextField>
        <Checkbox aria-label="Checkbox example" form="none" />
      </div>
    </Section>
  );
}
