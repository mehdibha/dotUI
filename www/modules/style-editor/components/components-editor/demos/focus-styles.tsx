import { Button } from "@dotui/ui/components/button";
import { Checkbox } from "@dotui/ui/components/checkbox";
import { TextField } from "@dotui/ui/components/text-field";

import { getComponentVariants } from "@/modules/style-editor/components/components-editor/demos/utils";
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
        <TextField
          aria-label="Email"
          placeholder="hello@mehdibha.com"
          form="none"
        />
        <Checkbox aria-label="Checkbox example" form="none" />
      </div>
    </Section>
  );
}
