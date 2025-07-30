"use client";

import React from "react";
import { CopyIcon, ExternalLinkIcon, TerminalIcon } from "lucide-react";

import { registryBlocks } from "@dotui/registry-definition/registry-blocks";
import { BlockViewer } from "@dotui/ui/block-viewer";
import { Button } from "@dotui/ui/components/button";
import { Skeleton } from "@dotui/ui/components/skeleton";

import { ThemeModeSwitch } from "@/components/theme-mode-switch";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";
import { ActiveStyleProviderSuspense } from "@/modules/styles/components/active-style-provider-suspense";
import { useActiveStyle } from "../styles/hooks/use-active-style";

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
  const [isCopied, setIsCopied] = React.useState(false);

  return (
    <div className="flex items-center justify-between px-2">
      <h2 className="text-lg font-medium tracking-tight truncate">{title}</h2>
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
          className="max-w-[200px] font-mono [&_svg]:size-8 max-lg:hidden"
          prefix={<TerminalIcon />}
          size="sm"
        >
          <span className="truncate text-xs">
            npx shadcn@latest add https://dotui.org/r/{activeStyle?.name}/{name}
          </span>
        </Button>
        <Button
          variant="primary"
          size="sm"
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
    <React.Suspense fallback={<Skeleton className="h-[600px]" />}>
      <ActiveStyleProviderSuspense className="flex-1 overflow-y-auto max-h-[100vh] rounded-lg border">
        <BlockViewer name={name} />
      </ActiveStyleProviderSuspense>
    </React.Suspense>
  );
};
