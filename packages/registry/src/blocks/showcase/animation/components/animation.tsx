"use client";

import React from "react";

import { Select, SelectItem } from "@dotui/registry/ui/select";

export function Animation({
  className: _className,
}: React.ComponentProps<"div">) {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsOpen((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-96 w-96">
      <Select
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        defaultValue="perplexity"
      >
        <SelectItem id="perplexity">Perplexity</SelectItem>
        <SelectItem id="replicate">Replicate</SelectItem>
        <SelectItem id="together-ai">Together AI</SelectItem>
        <SelectItem id="elevenlabs">ElevenLabs</SelectItem>
      </Select>
    </div>
  );
}
