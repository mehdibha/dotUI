"use client";

import { Switch } from "@dotui/registry-v2/ui/switch";

export function SwitchDemo() {
  return (
    <div className="flex flex-col gap-6">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-4">
          <Switch size={size}>Enable notifications</Switch>
          <Switch size={size} defaultSelected>
            Auto-save
          </Switch>
          <Switch size={size} isDisabled>
            Disabled
          </Switch>
          <Switch size={size} defaultSelected isDisabled>
            Disabled selected
          </Switch>
        </div>
      ))}
      <div className="space-y-2">
        <Switch variant="card">
          <div>
            <div className="font-medium">Marketing emails</div>
            <div className="text-sm text-fg-muted">
              Receive emails about new products and features
            </div>
          </div>
        </Switch>
        <Switch variant="card">
          <div>
            <div className="font-medium">Security alerts</div>
            <div className="text-sm text-fg-muted">
              Get notified about account security
            </div>
          </div>
        </Switch>
      </div>
    </div>
  );
}
