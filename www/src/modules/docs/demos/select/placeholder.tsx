import React from "react";
import { Select, SelectItem } from "@/components/dynamic-ui/select";

export default function Demo() {
  return (
    <Select placeholder="Select a provider">
      <SelectItem>Perplexity</SelectItem>
      <SelectItem>Replicate</SelectItem>
      <SelectItem>Together AI</SelectItem>
      <SelectItem>ElevenLabs</SelectItem>
    </Select>
  );
}
