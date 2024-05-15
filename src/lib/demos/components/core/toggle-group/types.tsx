import { Bold, Italic, Underline } from "lucide-react";
import { ToggleGroupButton, ToggleGroup } from "@/lib/components/core/default/toggle-group";

const types = ["neutral", "primary", "success", "warning", "danger"] as const;

export default function ToggleDemo() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {types.map((type) => (
        <div key={type} className="space-y-1">
          <p className="font-bold">{type}</p>
          <ToggleGroup variant="outline" type={type} defaultValue="bold">
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
