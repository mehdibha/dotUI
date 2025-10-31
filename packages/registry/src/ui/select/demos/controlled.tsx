"use client";

import React from "react";
import type { Key } from "react-aria-components";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@dotui/registry/ui/select";

export default function Demo() {
  const [provider, setProvider] = React.useState<Key | null>("eleven-labs");
  return (
    <div className="flex flex-col items-center gap-6">
      <Select aria-label="Provider" value={provider} onChange={setProvider}>
        <SelectTrigger />
        <SelectContent>
          <SelectItem id="perplexity">Perplexity</SelectItem>
          <SelectItem id="replicate">Replicate</SelectItem>
          <SelectItem id="together-ai">Together AI</SelectItem>
          <SelectItem id="eleven-labs">ElevenLabs</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-sm text-fg-muted">
        Selected provider: <span className="font-bold text-fg">{provider}</span>
      </p>
    </div>
  );
}
