import { Badge } from "@dotui/ui/components/badge";

import { getComponentVariants } from "@/modules/style-editor/components/components-editor/demos/utils";
import { Section } from "@/modules/style-editor/components/components-editor/section";

export function BadgeAndTagGroup() {
  return (
    <Section
      name="badge-and-tag-group"
      title="Badge & TagGroup"
      variants={getComponentVariants("badge")}
      previewClassName="flex-col gap-4"
    >
      <div className="flex items-center gap-4">
        <Badge>Default</Badge>
        <Badge variant="accent">Accent</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="danger">Danger</Badge>
        <Badge variant="info">Info</Badge>
      </div>
      <div className="flex items-center gap-4">
        <Badge size="sm">Small</Badge>
        <Badge size="md">Medium</Badge>
        <Badge size="lg">Large</Badge>
      </div>
    </Section>
  );
}
