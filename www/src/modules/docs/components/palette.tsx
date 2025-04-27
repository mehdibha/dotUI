import { cn } from "@/lib/utils";

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
  );
}
