import { Bold, Italic, Underline } from "lucide-react";
import {
  ToggleGroupButton,
  ToggleGroup,
} from "@/lib/components/core/default/toggle-group";

const sizes = ["sm", "md", "lg"] as const;

export default function ToggleDemo() {
  return (
    <div className="space-y-4">
      {sizes.map((size) => (
        <div key={size} className="space-y-1">
          <p className="font-bold">{size}</p>
          <ToggleGroup size={size} variant="outline" defaultValue="bold">
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
        </div>
      ))}
    </div>
  );
}
