"use client";

import React from "react";
import { CheckIcon, ExternalLinkIcon, TerminalIcon } from "lucide-react";

import { registryBlocks } from "@dotui/registry-definition/registry-blocks";
import { BlockViewer } from "@dotui/ui/block-viewer";
import { Button } from "@dotui/ui/components/button";

import { ThemeModeSwitch } from "@/components/theme-mode-switch";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";
import { ActiveStyleProvider } from "@/modules/styles/components/active-style-provider";
import { useActiveStyle } from "@/modules/styles/hooks/use-active-style";

interface BlockViewProps {
  name: string;
}
export function BlockView({ name, ...props }: BlockViewProps) {
  const block = registryBlocks.find((block) => block.name === name);

  if (!block) {
    return <div>Block not found</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <BlockViewToolbar name={block.name} title={block.description} />
      <BlockViewView name={block.name} />
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
          className="[&_svg]:text-fg-muted font-mono max-lg:hidden [&_svg]:size-4"
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

const BlockViewView = ({ name }: { name: string }) => {
  return (
    <ActiveStyleProvider className="flex flex-1 items-center justify-center rounded-lg border">
      <BlockViewer name={name} />
    </ActiveStyleProvider>
  );
};
