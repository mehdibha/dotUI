import { BoldIcon, ItalicIcon, XCircleIcon } from "lucide-react";
import { Button } from "@/lib/components/core/default/button";
import { TextArea } from "@/lib/components/core/default/text-area";
import { ToggleButton } from "@/lib/components/core/default/toggle-button";
import { Tooltip } from "@/lib/components/core/default/tooltip";

export default function Demo() {
  return (
    <TextArea
      label="Your comment"
      placeholder="type something here"
      prefix={
        <div className="flex items-center gap-1">
          <Button variant="quiet" shape="square" size="sm" className="size-7">
            👍
          </Button>
          <Button variant="quiet" shape="square" size="sm" className="size-7">
            ❤️
          </Button>
        </div>
      }
      suffix={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            <ToggleButton size="sm">
              <BoldIcon />
            </ToggleButton>
            <ToggleButton size="sm">
              <ItalicIcon />
            </ToggleButton>
          </div>
          <Button variant="primary" size="sm">
            Comment
          </Button>
        </div>
      }
    />
  );
}
