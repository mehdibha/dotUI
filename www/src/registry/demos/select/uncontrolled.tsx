import React from "react";
import { Item } from "@/components/dynamic-core/list-box";
import { Select } from "@/components/dynamic-core/select";

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
