import React from "react";
import { Item } from "@/registry/ui/default/core/list-box";
import { Select } from "@/registry/ui/default/core/select";

export default function Demo() {
  return (
    <Select label="Provider" description="Please select a provider.">
      <Item>Perplexity</Item>
      <Item>Replicate</Item>
      <Item>Together AI</Item>
      <Item>ElevenLabs</Item>
    </Select>
  );
}
