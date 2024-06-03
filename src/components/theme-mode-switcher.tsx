import { MoonIcon, SunIcon } from "lucide-react";
import { useConfig } from "@/hooks/use-config";
import { Button } from "@/lib/components/core/default/button";
import { cn } from "@/lib/utils/classes";

export const ThemeModeSwitcher = () => {
  const { mode, setMode } = useConfig();

  return (
    <div className="bg-popover flex items-center rounded border p-0.5">
      <Button
        size="sm"
        onClick={() => setMode("light")}
        className={cn(
          "text-foreground h-[22px] bg-transparent px-2 hover:bg-transparent",
          mode === "light" && "bg-background"
        )}
      >
        <SunIcon size={15} />
      </Button>
      <Button
        size="sm"
        onClick={() => setMode("dark")}
        className={cn(
          "text-foreground h-[22px] bg-transparent px-2 hover:bg-transparent",
          mode === "dark" && "bg-background"
        )}
      >
        <MoonIcon size={15} />
      </Button>
    </div>
  );
};
