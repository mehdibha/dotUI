"use client";

import React from "react";
import { CopyIcon } from "lucide-react";

import { registryBlocks } from "@dotui/registry-definition/registry-blocks";
import { BlockViewer } from "@dotui/ui/block-viewer";
import { Button } from "@dotui/ui/components/button";
import { Skeleton } from "@dotui/ui/components/skeleton";

import { ThemeModeSwitch } from "@/components/theme-mode-switch";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";
import { CurrentStyleProvider } from "@/modules/styles/components/current-style-provider";

interface BlockViewProps {
  name: string;
}
export function BlockView({ name, ...props }: BlockViewProps) {
  const block = registryBlocks.find((block) => block.name === name);

  if (!block) {
    return <div>Block not found</div>;
  }

  return (
    <div className="flex min-h-[400px] flex-col gap-2">
      <BlockViewToolbar title={block.description} />
      <BlockViewView name={block.name} />
      <BlockViewCode />
    </div>
  );
}

interface BlockViewToolbarProps {
  title?: string;
}
const BlockViewToolbar = ({ title }: BlockViewToolbarProps) => {
  const { currentMode, setCurrentMode } = usePreferences();

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-medium tracking-tight">{title}</h2>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" shape="square">
          <CopyIcon />
        </Button>

        <ThemeModeSwitch
          size="sm"
          shape="square"
          isSelected={currentMode === "dark"}
          onChange={(isSelected) =>
            setCurrentMode(isSelected ? "dark" : "light")
          }
        />
      </div>
    </div>
  );
};

const BlockViewView = ({ name }: { name: string }) => {
  return (
    <CurrentStyleProvider className="flex-1 rounded-lg border">
      <React.Suspense fallback={<Skeleton className="h-full w-full" />}>
        <BlockViewer name={name} />
      </React.Suspense>
    </CurrentStyleProvider>
  );
};

const BlockViewCode = () => {
  return <div></div>;
};
