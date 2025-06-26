import React from "react";

import { Select, SelectItem } from "@dotui/ui/components/select";

export default function Demo() {
  return (
    <Select
      label="Provider"
      isInvalid
      errorMessage="Please select an item in the list."
    >
      <SelectItem>Perplexity</SelectItem>
      <SelectItem>Replicate</SelectItem>
      <SelectItem>Together AI</SelectItem>
      <SelectItem>ElevenLabs</SelectItem>
    </Select>
  );
}
