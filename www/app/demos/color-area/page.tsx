import { ColorArea, ColorThumb } from "@dotui/registry/ui/color-area";

export default function Page() {
  return (
    <ColorArea defaultValue="hsl(0, 100%, 50%)">
      <ColorThumb />
    </ColorArea>
  );
}

