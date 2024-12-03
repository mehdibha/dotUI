import React from "react";
import { ContextualHelp } from "@/components/dynamic-core/contextual-help";
import { Item } from "@/components/dynamic-core/list-box";
import { Select } from "@/components/dynamic-core/select";

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
