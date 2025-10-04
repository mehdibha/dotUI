import React from "react";

import {
  SwitchIndicator,
  SwitchRoot,
  SwitchThumb,
} from "@dotui/registry/ui/switch";

export default function Demo() {
  return (
    <SwitchRoot>
      <SwitchIndicator>
        <SwitchThumb />
      </SwitchIndicator>
      <span>Focus mode</span>
    </SwitchRoot>
  );
}
