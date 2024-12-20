import React from "react";
import { Item } from "@/components/dynamic-core/list-box";
import { Select } from "@/components/dynamic-core/select";

export default function Demo() {
  return (
    <Select
      label="Provider"
      isInvalid
      errorMessage="Please select an item in the list."
    >
      <Item>Perplexity</Item>
      <Item>Replicate</Item>
      <Item>Together AI</Item>
      <Item>ElevenLabs</Item>
    </Select>
  );
}
