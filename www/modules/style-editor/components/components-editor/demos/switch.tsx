import { Switch } from "@dotui/registry/ui/switch";

import { getComponentVariants } from "@/modules/style-editor/components/components-editor/demos/utils";
import { Section } from "@/modules/style-editor/components/components-editor/section";

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
        <Switch variant="card" defaultSelected form="none">
          Dark mode
        </Switch>
      </div>
    </Section>
  );
}
