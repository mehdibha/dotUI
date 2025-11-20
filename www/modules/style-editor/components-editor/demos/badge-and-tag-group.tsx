import { Badge } from "@dotui/registry/ui/badge";

import { ComponentConfig } from "@/modules/style-editor/components-editor/component-config";
import { getComponentVariants } from "@/modules/style-editor/components-editor/demos/utils";

export function BadgeAndTagGroup() {
  return (
    <ComponentConfig
      name="badge-and-tag-group"
      title="Badge & TagGroup"
      variants={getComponentVariants("badge")}
      previewClassName="flex-col gap-4"
    >
      <div className="flex items-center gap-4">
        <Badge>Default</Badge>
        <Badge variant="default">Accent</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="danger">Danger</Badge>
        <Badge variant="info">Info</Badge>
      </div>
      <div className="flex items-center gap-4">
        <Badge>Small</Badge>
        <Badge>Medium</Badge>
        <Badge>Large</Badge>
      </div>
    </ComponentConfig>
  );
}
