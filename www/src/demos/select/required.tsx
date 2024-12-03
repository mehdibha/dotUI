import React from "react";
import { Item } from "@/components/dynamic-core/list-box";
import { Select } from "@/components/dynamic-core/select";

export default function Demo() {
  return (
    <Select label="Provider" isRequired necessityIndicator="icon">
      <Item>Perplexity</Item>
      <Item>Replicate</Item>
      <Item>Together AI</Item>
      <Item>ElevenLabs</Item>
    </Select>
  );
}
