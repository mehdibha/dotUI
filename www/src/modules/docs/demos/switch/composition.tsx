import React from "react";
import {
  SwitchIndicator,
  SwitchRoot,
  SwitchThumb,
} from "@/components/dynamic-ui/switch";

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
