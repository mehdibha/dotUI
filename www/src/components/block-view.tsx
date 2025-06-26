import React from "react";
import { ChevronsUpDownIcon, CopyIcon } from "lucide-react";

import { BlockViewer } from "@dotui/ui/block-viewer";
import { Button } from "@dotui/ui/components/button";
import { ListBox, ListBoxItem } from "@dotui/ui/components/list-box";
import { Overlay } from "@dotui/ui/components/overlay";
import { SelectRoot, SelectValue } from "@dotui/ui/components/select";
import { registryBlocks } from "@dotui/ui/registry-blocks";

import { ThemeModeSwitch } from "@/components/theme-mode-switch";

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
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-medium tracking-tight">{title}</h2>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" shape="square">
          <CopyIcon />
        </Button>
        <ThemeModeSwitch size="sm" shape="square" />
        <SelectRoot defaultSelectedKey="minimalist">
          <Button
            variant="outline"
            suffix={<ChevronsUpDownIcon className="text-fg-muted" />}
          >
            Style: <SelectValue />
          </Button>
          <Overlay type="popover">
            <ListBox>
              <ListBoxItem id="minimalist">minimalist</ListBoxItem>
              <ListBoxItem id="modern">modern</ListBoxItem>
              <ListBoxItem id="retro">retro</ListBoxItem>
            </ListBox>
          </Overlay>
        </SelectRoot>
      </div>
    </div>
  );
};

const BlockViewView = ({ name }: { name: string }) => {
  return (
    <div className="flex-1 rounded-lg border">
      <React.Suspense fallback={<div>Loading...</div>}>
        <BlockViewer name={name} />
      </React.Suspense>
    </div>
  );
};

const BlockViewCode = () => {
  return <div></div>;
};
