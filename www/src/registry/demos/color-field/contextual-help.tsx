import React from "react";
import { ColorField } from "@/components/dynamic-core/color-field";
import { ContextualHelp } from "@/components/dynamic-core/contextual-help";

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
