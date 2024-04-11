"use client";

import { colord } from "colord";
import { MoonIcon, SunIcon, Undo2Icon } from "lucide-react";
import { useTheme } from "next-themes";
import { HexColorInput, HexColorPicker } from "react-colorful";
import Balancer from "react-wrap-balancer";
import { useConfig } from "@/hooks/use-config";
import { Button } from "@/lib/components/core/default/button";
import { Label } from "@/lib/components/core/default/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/lib/components/core/default/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/lib/components/core/default/tooltip";
import { defaultTheme } from "@/lib/theme";
import { cn } from "@/lib/utils/classes";
import type { ColorName } from "@/types/theme";
import { styles } from "@/config/styles-config";

export default function ThemesPage() {
  const {
    type,
    setType,
    mode,
    setMode,
    setStyle,
    style: currentStyle,
    theme,
    setTheme,
  } = useConfig();
  const { theme: rootMode } = useTheme();
  const resolvedMode = (type === "default" ? rootMode : mode) as "light" | "dark";
  return (
    <div className="container">
      <div className="mx-auto mt-14 max-w-4xl text-center">
        <h1 className="leading-tighter mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-5xl">
          <Balancer>Everything starts with identity</Balancer>
        </h1>
        <p className="text-md mt-4 text-muted-foreground md:text-lg lg:text-xl">
          <Balancer>
            Make your design system, choose your color palette, your components style and
            fonts to match you brand identity.
          </Balancer>
        </p>
      </div>
      <div className="mt-10 flex justify-center">
        <div>
          {/* <Label className="text-xs">Mode</Label> */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={"outline"}
              size="sm"
              onClick={() => {
                setMode("light");
                setType("custom");
              }}
              className={cn(
                "h-8 text-xs",
                resolvedMode === "light" && "border-2 border-primary"
              )}
            >
              <SunIcon size={15} className="mr-1 -translate-x-1" />
              Light
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setMode("dark");
                setType("custom");
              }}
              className={cn(
                "h-8 text-xs",
                resolvedMode === "dark" && "border-2 border-primary"
              )}
            >
              <MoonIcon size={15} className="mr-1 -translate-x-1" />
              Dark
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
