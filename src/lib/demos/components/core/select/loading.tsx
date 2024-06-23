import React from "react";
import { Item } from "@/lib/components/core/default/list-box";
import { Select } from "@/lib/components/core/default/select";

export default function Demo() {
  // TODO : add isLoading prop
  return (
    <Select>
      <Item>Perplexity</Item>
      <Item>Replicate</Item>
      <Item>Together AI</Item>
      <Item>ElevenLabs</Item>
    </Select>
  );
}
