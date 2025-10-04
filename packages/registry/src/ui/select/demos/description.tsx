import React from "react";

import { Select, SelectItem } from "@dotui/registry/ui/select";

export default function Demo() {
  return (
    <Select label="Provider" description="Please select a provider.">
      <SelectItem>Perplexity</SelectItem>
      <SelectItem>Replicate</SelectItem>
      <SelectItem>Together AI</SelectItem>
      <SelectItem>ElevenLabs</SelectItem>
    </Select>
  );
}
