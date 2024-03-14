"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/utils/classes";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface IconWrapperProps {
  code: string;
  name: string;
  className?: string;
  children: React.ReactNode;
}

const IconWrapper = (props: IconWrapperProps) => {
  const { code, name, className, children } = props;
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    void navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn("relative overflow-hidden", className)}
          onClick={handleCopy}
        >
          {children}
          <AnimatePresence>
            {copied && (
              <motion.span
                initial={{ y: 3, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 3, opacity: 0 }}
                className="absolute bottom-0 left-0 w-full rounded-t-sm border-t bg-card py-1 text-center text-xs text-muted-foreground shadow-sm"
              >
                copied
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </TooltipTrigger>
      <TooltipContent>{name}</TooltipContent>
    </Tooltip>
  );
};

export { IconWrapper };
