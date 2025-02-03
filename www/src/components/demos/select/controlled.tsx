"use client";

import React from "react";
import type { Key } from "react-aria-components";
import { Select, SelectItem } from "@/components/dynamic-core/select";

export default function Demo() {
  const [provider, setProvider] = React.useState<Key>("eleven-labs");
  return (
    <div className="flex flex-col items-center gap-6">
      <Select selectedKey={provider} onSelectionChange={setProvider}>
        <SelectItem id="perplexity">Perplexity</SelectItem>
        <SelectItem id="replicate">Replicate</SelectItem>
        <SelectItem id="together-ai">Together AI</SelectItem>
        <SelectItem id="eleven-labs">ElevenLabs</SelectItem>
      </Select>
      <p className="text-fg-muted text-sm">
        Selected provider: <span className="text-fg font-bold">{provider}</span>
      </p>
    </div>
  );
}
