import React from "react";

import {
  SwitchIndicator,
  SwitchRoot,
  SwitchThumb,
} from "@dotui/ui/components/switch";

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
