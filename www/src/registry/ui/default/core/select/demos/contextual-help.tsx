import React from "react";
import { ContextualHelp } from "@/registry/ui/default/core/contextual-help";
import { Item } from "@/registry/ui/default/core/list-box";
import { Select } from "@/registry/ui/default/core/select";

export default function SelectDemo() {
  return (
    <Select
      label="Provider"
      contextualHelp={
        <ContextualHelp
          title="Need help?"
          description="If you're having trouble, get assisted by our AI."
        />
      }
    >
      <Item>Perplexity</Item>
      <Item>Replicate</Item>
      <Item>Together AI</Item>
      <Item>ElevenLabs</Item>
    </Select>
  );
}
