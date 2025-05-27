import React from "react";
import { Select, SelectItem } from "@/components/dynamic-ui/select";

export default function Demo() {
  return (
    <Select defaultSelectedKey="eleven-labs">
      <SelectItem id="perplexity">Perplexity</SelectItem>
      <SelectItem id="replicate">Replicate</SelectItem>
      <SelectItem id="together-ai">Together AI</SelectItem>
      <SelectItem id="eleven-labs">ElevenLabs</SelectItem>
    </Select>
  );
}
