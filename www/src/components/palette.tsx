import { cn } from "@/lib/cn";
import { ThemeOverride } from "@/components/theme-override";

export interface PaletteProps extends React.ComponentProps<"div"> {
  baseColor:
    | "neutral"
    | "neutral-alpha"
    | "accent"
    | "success"
    | "warning"
    | "error";
}

export function Palette({ baseColor, className, ...props }: PaletteProps) {
  return (
    <ThemeOverride>
      <div className={cn("grid grid-cols-10 gap-1", className)} {...props}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="h-10 border"
            style={{
              borderRadius: "0.25rem",
              backgroundColor: `hsl(var(--color-${baseColor}-${(i + 1) * 100}))`,
            }}
          />
        ))}
      </div>
    </ThemeOverride>
  );
}
