import React from "react";
import { Item } from "@/registry/ui/default/core/list-box";
import { Select } from "@/registry/ui/default/core/select";

export default function Demo() {
  return (
    <Select defaultSelectedKey="eleven-labs">
      <Item id="perplexity">Perplexity</Item>
      <Item id="replicate">Replicate</Item>
      <Item id="together-ai">Together AI</Item>
      <Item id="eleven-labs">ElevenLabs</Item>
    </Select>
  );
}
