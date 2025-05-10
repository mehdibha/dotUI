import {
  BoldIcon,
  BookmarkIcon,
  Edit2Icon,
  ItalicIcon,
  PinIcon,
} from "lucide-react";
import { ToggleButton } from "@/components/dynamic-ui/toggle-button";

export function ToggleButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
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
        className="selected:[&_svg]:fill-fg-onPrimary"
      >
        <BookmarkIcon />
      </ToggleButton>
    </div>
  );
}
