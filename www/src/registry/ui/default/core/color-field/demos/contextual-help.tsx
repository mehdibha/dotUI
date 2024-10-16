import React from "react";
import { ColorField } from "@/registry/ui/default/core/color-field";
import { ContextualHelp } from "@/registry/ui/default/core/contextual-help";

export default function Demo() {
  return (
    <ColorField
      label="Color"
      contextualHelp={
        <ContextualHelp
          title="Need help?"
          description="If you're having trouble, contact our customer
      support team for help."
        />
      }
    />
  );
}
