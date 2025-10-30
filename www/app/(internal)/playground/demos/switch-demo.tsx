"use client";

import {
  Description,
  FieldContent,
  FieldGroup,
  Label,
} from "@dotui/registry/ui/field";
import {
  Switch,
  SwitchIndicator,
  SwitchThumb,
} from "@dotui/registry/ui/switch";

export function SwitchDemo() {
  return (
    <div className="space-y-4">
      {/* Simple switches - different sizes */}
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="">
          <div className="flex items-center gap-2">
            <Switch size={size} />
            <Switch defaultSelected size={size} />
            <Switch defaultSelected size={size}>
              <SwitchIndicator>
                <SwitchThumb />
              </SwitchIndicator>
              <Label>Enable notifications</Label>
            </Switch>
          </div>
        </div>
      ))}

      {/* Switch with Label and Description */}
      <Switch className="w-full max-w-sm justify-between">
        <FieldContent>
          <Label>Marketing emails</Label>
          <Description>
            Receive emails about new products and features
          </Description>
        </FieldContent>
        <SwitchIndicator>
          <SwitchThumb />
        </SwitchIndicator>
      </Switch>

      {/* Card variant */}
      <FieldGroup>
        <Switch>
          <SwitchIndicator>
            <SwitchThumb />
          </SwitchIndicator>
          <FieldContent>
            <Label>Marketing emails</Label>
            <Description>
              Receive emails about new products and features
            </Description>
          </FieldContent>
        </Switch>
        <Switch>
          <SwitchIndicator>
            <SwitchThumb />
          </SwitchIndicator>
          <FieldContent>
            <Label>Security alerts</Label>
            <Description>Get notified about account security</Description>
          </FieldContent>
        </Switch>
      </FieldGroup>
    </div>
  );
}
