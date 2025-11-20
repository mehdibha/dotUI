import React from "react";
import {
  ArrowRightIcon,
  BoldIcon,
  BookmarkIcon,
  Edit2Icon,
  ItalicIcon,
  PinIcon,
  SendIcon,
} from "lucide-react";

import { Button } from "@dotui/registry/ui/button";
import { ToggleButton } from "@dotui/registry/ui/toggle-button";

import { ComponentConfig } from "@/modules/style-editor/components-editor/component-config";
import { getComponentVariants } from "@/modules/style-editor/components-editor/demos/utils";

export function Buttons() {
  const [isPending, setIsPending] = React.useState(false);

  React.useEffect(() => {
    if (isPending) {
      setTimeout(() => setIsPending(false), 2000);
    }
  }, [isPending]);

  return (
    <ComponentConfig
      name="buttons"
      title="Buttons"
      variants={getComponentVariants("button")}
      previewClassName="flex-col"
    >
      <div className="flex items-center gap-2">
        <Button variant="default">Default</Button>
        <Button variant="primary">Primary</Button>
        <Button variant="quiet">Quiet</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="danger">Danger</Button>
        <Button variant="success">Success</Button>
        <Button variant="warning">Warning</Button>
      </div>
      <div className="flex items-center gap-2">
        <Button>
          <SendIcon />
          Send
        </Button>
        <Button>
          Learn more
          <ArrowRightIcon />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <ToggleButton variant="default" aria-label="Toggle pin">
          <PinIcon />
        </ToggleButton>
        <ToggleButton variant="default" aria-label="Toggle bold">
          <BoldIcon />
        </ToggleButton>
        <ToggleButton>
          <Edit2Icon />
          Edit mode
        </ToggleButton>
        <ToggleButton aria-label="Toggle " isDisabled>
          <BoldIcon />
        </ToggleButton>
        <ToggleButton aria-label="Toggle italic" defaultSelected>
          <ItalicIcon />
          Italic
        </ToggleButton>
        <ToggleButton
          aria-label="Toggle book"
          variant="default"
          className="selected:[&_svg]:fill-fg-on-primary"
        >
          <BookmarkIcon />
        </ToggleButton>
      </div>
    </ComponentConfig>
  );
}
