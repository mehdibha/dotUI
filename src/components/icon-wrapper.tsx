"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";

export const IconWrapper = ({
  code,
  children,
}: {
  code: string;
  children: React.ReactNode;
}) => {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    void navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div onClick={handleCopy} className="relative overflow-hidden">
      {children}
      <AnimatePresence>
        {copied && (
          <motion.span
            initial={{ y: 3, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 3, opacity: 0 }}
            className="absolute bottom-0 w-full rounded-t-sm bg-card py-0.5 text-center text-xs text-muted-foreground shadow-sm"
          >
            copied
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};
