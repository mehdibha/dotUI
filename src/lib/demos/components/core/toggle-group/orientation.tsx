import { Bold, Italic, Underline } from "lucide-react";
import {
  ToggleGroupButton,
  ToggleGroup,
} from "@/lib/components/core/default/toggle-group";

const orientations = ["horizontal", "vertical"] as const;

export default function ToggleDemo() {
  return (
    <div className="flex items-center gap-8">
      {orientations.map((orientation) => (
        <ToggleGroup
          key={orientation}
          orientation={orientation}
          variant="outline"
          defaultValue="bold"
        >
          <ToggleGroupButton value="bold" aria-label="Toggle bold">
            <Bold className="h-4 w-4" />
          </ToggleGroupButton>
          <ToggleGroupButton value="italic" aria-label="Toggle bold">
            <Italic className="h-4 w-4" />
          </ToggleGroupButton>
          <ToggleGroupButton value="underline" aria-label="Toggle bold">
            <Underline className="h-4 w-4" />
          </ToggleGroupButton>
        </ToggleGroup>
      ))}
    </div>
  );
}
