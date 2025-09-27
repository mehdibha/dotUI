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

import { Button } from "@dotui/ui/components/button";
import { ToggleButton } from "@dotui/ui/components/toggle-button";

import { getComponentVariants } from "@/modules/style-editor/components/components-editor/demos/utils";
import { Section } from "@/modules/style-editor/components/components-editor/section";

export function Buttons() {
  const [isPending, setIsPending] = React.useState(false);

  React.useEffect(() => {
    if (isPending) {
      setTimeout(() => setIsPending(false), 2000);
    }
  }, [isPending]);

  return (
    <Section
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
        <Button prefix={<SendIcon />}>Send</Button>
        <Button suffix={<ArrowRightIcon />}>Learn more</Button>
      </div>
      <div className="flex items-center gap-2">
        <ToggleButton variant="primary" aria-label="Toggle pin" shape="square">
          <PinIcon />
        </ToggleButton>
        <ToggleButton variant="accent" aria-label="Toggle bold">
          <BoldIcon />
        </ToggleButton>
        <ToggleButton prefix={<Edit2Icon />} shape="rectangle">
          Edit mode
        </ToggleButton>
        <ToggleButton aria-label="Toggle " isDisabled>
          <BoldIcon />
        </ToggleButton>
        <ToggleButton
          aria-label="Toggle italic"
          shape="rectangle"
          prefix={<ItalicIcon />}
          defaultSelected
        >
          Italic
        </ToggleButton>
        <ToggleButton
          aria-label="Toggle book"
          variant="primary"
          className="selected:[&_svg]:fill-fg-on-primary"
        >
          <BookmarkIcon />
        </ToggleButton>
      </div>
    </Section>
  );
}
