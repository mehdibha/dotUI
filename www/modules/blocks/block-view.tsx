"use client";

import React from "react";
import { CheckIcon, ExternalLinkIcon, TerminalIcon } from "lucide-react";
import type { RegistryItem } from "shadcn/schema";

import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";

import { ThemeModeSwitch } from "@/components/ui/theme-mode-switch";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";
import { useActiveStyle } from "@/modules/styles/hooks/use-active-style";

interface BlockViewProps {
  block?: RegistryItem;
}

export function BlockView({ block }: BlockViewProps) {
  if (!block) {
    return <div>Block not found</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <BlockViewToolbar name={block.name} title={block.description} />
      <BlockViewView block={block} />
    </div>
  );
}

interface BlockViewToolbarProps {
  name: string;
  title?: string;
}
const BlockViewToolbar = ({ name, title }: BlockViewToolbarProps) => {
  const { activeMode, setActiveMode } = usePreferences();
  const { data: activeStyle } = useActiveStyle();
  const [isCopied, setCopied] = React.useState(false);

  const handleCopy = () => {
    void navigator.clipboard.writeText(`npx shadcn@latest add @dotui/${name}`);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-between px-2">
      <h2 className="truncate text-lg font-medium tracking-tight">{title}</h2>
      <div className="flex items-center gap-2">
        <ThemeModeSwitch
          size="sm"
          shape="square"
          isSelected={activeMode === "light"}
          onChange={(isSelected) =>
            setActiveMode(isSelected ? "light" : "dark")
          }
        />
        <Button
          className="font-mono max-lg:hidden [&_svg]:size-4 [&_svg]:text-fg-muted"
          prefix={
            isCopied ? (
              <CheckIcon className="animate-in fade-in" />
            ) : (
              <TerminalIcon className="animate-in fade-in" />
            )
          }
          onPress={handleCopy}
          size="sm"
        >
          <span className="truncate text-xs">
            npx shadcn@latest add @dotui/{name}
          </span>
        </Button>
        <Button
          variant="primary"
          size="sm"
          target={activeStyle ? "_blank" : undefined}
          href={
            activeStyle
              ? `/view/${activeStyle.user.username}/${activeStyle.name}/${name}`
              : undefined
          }
          prefix={<ExternalLinkIcon />}
          className="max-lg:hidden"
        >
          Open in new tab
        </Button>
      </div>
    </div>
  );
};

const BlockViewView = ({ block }: { block: RegistryItem }) => {
  const { data: activeStyle } = useActiveStyle();
  const [isLoading, setLoading] = React.useState(true);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border bg-muted",
        isLoading && "animate-pulse",
      )}
    >
      <iframe
        src={
          activeStyle
            ? `/view/${activeStyle?.user.username}/${activeStyle?.name}/${block.name}`
            : undefined
        }
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
        style={{ height: block.meta?.containerHeight }}
        className="w-full"
      />
    </div>
  );
};
