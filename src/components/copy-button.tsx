"use client";

import React from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CopyButton = ({ code, className }: { code: string; className?: string }) => {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    void navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  return (
    <Button size="icon" onClick={handleCopy} className={className}>
      {copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
    </Button>
  );
};
