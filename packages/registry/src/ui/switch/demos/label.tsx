

import { Switch } from "@dotui/registry/ui/switch";

export default function Demo() {
  return (
    <div className="flex items-center gap-10">
      <Switch>Focus mode</Switch>
      <Switch aria-label="Focus mode" />
    </div>
  );
}
