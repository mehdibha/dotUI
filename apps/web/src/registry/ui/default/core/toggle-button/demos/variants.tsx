import { PinIcon } from "@/__icons__";
import { ToggleButton } from "@/registry/ui/default/core/toggle-button";

const variants = ["quiet", "outline", "accent"] as const;

export default function Demo() {
  return (
    <div className="flex items-center gap-4">
      {variants.map((variant) => (
        <ToggleButton
          key={variant}
          variant={variant}
          defaultSelected={variant === "accent"}
          aria-label="Toggle pin"
        >
          <PinIcon className="rotate-45" />
        </ToggleButton>
      ))}
    </div>
  );
}
