import React from "react";
import { ContextualHelp } from "@/components/dynamic-core/contextual-help";
import { TextArea } from "@/components/dynamic-core/text-area";

export default function Demo() {
  return (
    <TextArea
      label="Bio"
      contextualHelp={
        <ContextualHelp
          title="Need help?"
          description="If you're having trouble writing your bio, get assisted by our AI."
        />
      }
    />
  );
}
