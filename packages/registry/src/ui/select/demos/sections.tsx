import React from "react";

import { ListBoxSection } from "@dotui/registry/ui/list-box";
import { Select, SelectItem } from "@dotui/registry/ui/select";

export default function Demo() {
  return (
    <Select label="Model">
      <ListBoxSection title="OpenAI">
        <SelectItem>GPT-4o</SelectItem>
        <SelectItem>GPT-4 Turbo</SelectItem>
        <SelectItem>GPT-4</SelectItem>
        <SelectItem>GPT-3.5 Turbo</SelectItem>
      </ListBoxSection>
      <ListBoxSection title="Google">
        <SelectItem>Gemini 1.5 Flash</SelectItem>
        <SelectItem>Gemini 1.5 Pro</SelectItem>
        <SelectItem>Gemini 1.0 Pro</SelectItem>
      </ListBoxSection>
      <ListBoxSection title="Meta">
        <SelectItem>Llama 3 (70B)</SelectItem>
        <SelectItem>Llama 3 (8B)</SelectItem>
        <SelectItem>Code Llama (70B)</SelectItem>
      </ListBoxSection>
      <ListBoxSection title="Mistral AI">
        <SelectItem>Mixtral 8x22B</SelectItem>
        <SelectItem>Mistral Large</SelectItem>
        <SelectItem>Mistral 7B</SelectItem>
      </ListBoxSection>
    </Select>
  );
}
