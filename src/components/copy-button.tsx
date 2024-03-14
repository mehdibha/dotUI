"use client";

import React from "react";
import { LayoutGroup, motion } from "framer-motion";
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
    <Button variant="secondary" size="icon" onClick={handleCopy} className={className}>
      <LayoutGroup>
        {copied ? (
          <motion.span
            layoutId="icon"
            key={0}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CheckIcon size={18} />
          </motion.span>
        ) : (
          <motion.span
            layoutId="icon"
            key={1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CopyIcon size={18} />
          </motion.span>
        )}
      </LayoutGroup>
    </Button>
  );
};
