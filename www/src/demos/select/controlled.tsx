"use client";

import React from "react";
import type { Key } from "react-aria-components";
import { Item } from "@/registry/ui/default/core/list-box";
import { Select } from "@/registry/ui/default/core/select";

export default function Demo() {
  const [provider, setProvider] = React.useState<Key>("eleven-labs");
  return (
    <div className="flex flex-col items-center gap-6">
      <Select selectedKey={provider} onSelectionChange={setProvider}>
        <Item id="perplexity">Perplexity</Item>
        <Item id="replicate">Replicate</Item>
        <Item id="together-ai">Together AI</Item>
        <Item id="eleven-labs">ElevenLabs</Item>
      </Select>
      <p className="text-fg-muted text-sm">
        Selected provider: <span className="text-fg font-bold">{provider}</span>
      </p>
    </div>
  );
}
