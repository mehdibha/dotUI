import React from "react";
import { Select, SelectItem } from "@/components/dynamic-core/select";

export default function Demo() {
  return (
    <Select isDisabled>
      <SelectItem>Perplexity</SelectItem>
      <SelectItem>Replicate</SelectItem>
      <SelectItem>Together AI</SelectItem>
      <SelectItem>ElevenLabs</SelectItem>
    </Select>
  );
}
