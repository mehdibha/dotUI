"use client";

import React from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "@/lib/components/core/default/button";
import { cn } from "@/lib/utils/classes";

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
    <Button shape="square" onClick={handleCopy} className={cn("h-8 w-8", className)}>
      {copied ? (
        <CheckIcon size={15} className="animate-in fade-in" />
      ) : (
        <CopyIcon size={15} className="animate-in fade-in" />
      )}
    </Button>
  );
};
