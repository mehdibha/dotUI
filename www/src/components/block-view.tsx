import { ChevronsUpDownIcon, CopyIcon } from "lucide-react";

import { Button } from "@dotui/ui/components/button";
import { ListBox, ListBoxItem } from "@dotui/ui/components/list-box";
import { Overlay } from "@dotui/ui/components/overlay";
import { SelectRoot, SelectValue } from "@dotui/ui/components/select";

import { ThemeModeSwitch } from "@/components/theme-mode-switch";

interface BlockViewProps {
  name: string;
}
export function BlockView({ name, ...props }: BlockViewProps) {
  return (
    <div className="flex min-h-[800px] flex-col gap-2">
      <BlockViewToolbar name={name} />
      <BlockViewView />
      <BlockViewCode />
    </div>
  );
}

interface BlockViewToolbarProps {
  name: string;
}
const BlockViewToolbar = ({ name }: BlockViewToolbarProps) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-medium tracking-tight">{name}</h2>
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

const BlockViewView = () => {
  return <div className="flex-1 rounded-lg border bg-bg-muted"></div>;
};

const BlockViewCode = () => {
  return <div></div>;
};
