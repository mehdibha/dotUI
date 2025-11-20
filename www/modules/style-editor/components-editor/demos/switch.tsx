import { Switch } from "@dotui/registry/ui/switch";

import { Section } from "@/modules/style-editor/components-editor/component-config-section";
import { getComponentVariants } from "@/modules/style-editor/components-editor/demos/utils";

export function Switches() {
  return (
    <Section
      name="switch"
      title="Switches"
      variants={getComponentVariants("switch")}
      previewClassName="flex-col gap-4"
    >
      <div className="flex items-center gap-4">
        <Switch aria-label="Basic switch" form="none" />
        <Switch defaultSelected>Notifications</Switch>
        <Switch variant="default" defaultSelected form="none">
          Dark mode
        </Switch>
      </div>
    </Section>
  );
}
