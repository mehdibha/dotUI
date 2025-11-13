"use client";

import React from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { tv } from "tailwind-variants";

import { Button } from "@dotui/registry/ui/button";

import { ScrollArea } from "@/components/ui/scroll-area";

const codeStyles = tv({
  base: "relative rounded-md bg-muted",
  variants: {
    variant: {
      classic: "p-4 text-xs",
      inline: "px-2 py-0.5",
    },
  },
});

interface CodeClientProps extends React.HTMLAttributes<HTMLDivElement> {
  inline?: boolean;
  code: string;
}
const CodeClient = ({
  className,
  inline = false,
  children,
  code,
}: CodeClientProps) => {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    void navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  if (inline) {
    return (
      <span className={codeStyles({ variant: "inline" })}>{children}</span>
    );
  }

  return (
    <div className={codeStyles({ variant: "classic", className })}>
      <ScrollArea scrollbars="both" className="max-h-[200px]">
        {children}
      </ScrollArea>
      <Button
        variant="quiet"
        size="sm"
        className="absolute top-2 right-2 [&_svg]:size-3"
        onPress={handleCopy}
      >
        {copied ? (
          <CheckIcon className="fade-in animate-in" />
        ) : (
          <CopyIcon className="fade-in animate-in" />
        )}
      </Button>
    </div>
  );
};

export { CodeClient };
