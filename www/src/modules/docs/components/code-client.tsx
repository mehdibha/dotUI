"use client";

import React from "react";
import { ScrollArea } from "@/components/scroll-area";
import { CheckIcon, CopyIcon } from "lucide-react";
import { tv } from "tailwind-variants";

import { Button } from "@dotui/ui/components/button";

const codeStyles = tv({
  base: "bg-bg-muted relative rounded-md",
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
        shape="square"
        size="sm"
        className="absolute top-2 right-2 [&_svg]:size-3"
        onPress={handleCopy}
      >
        {copied ? (
          <CheckIcon className="animate-in fade-in" />
        ) : (
          <CopyIcon className="animate-in fade-in" />
        )}
      </Button>
    </div>
  );
};

export { CodeClient };
