import { colord } from "colord";
import { MoonIcon, SunIcon, Undo2Icon } from "lucide-react";
import { useTheme } from "next-themes";
import { HexColorInput, HexColorPicker } from "react-colorful";
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

export const CustomizeTheme = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 w-[100px] text-xs">
          Customize
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="z-40 w-[340px] rounded-[0.5rem] bg-white p-6 dark:bg-zinc-950"
      >
        <Customizer />
      </PopoverContent>
    </Popover>
  );
};

const colors: {
  label: string;
  colors: { name: ColorName; label?: string }[];
}[] = [
  {
    label: "Default",
    colors: [
      { name: "background", label: "Background" },
      { name: "foreground", label: "Foreground" },
    ],
  },
  {
    label: "Card",
    colors: [
      { name: "card", label: "Background" },
      { name: "card-foreground", label: "Foreground" },
    ],
  },
  {
    label: "Popover",
    colors: [
      { name: "popover", label: "Background" },
      { name: "popover-foreground", label: "Foreground" },
    ],
  },
  {
    label: "Primary",
    colors: [
      { name: "primary", label: "Background" },
      { name: "primary-foreground", label: "Foreground" },
    ],
  },
  {
    label: "Secondary",
    colors: [
      { name: "secondary", label: "Background" },
      { name: "secondary-foreground", label: "Foreground" },
    ],
  },
  {
    label: "Muted",
    colors: [
      { name: "muted", label: "Background" },
      { name: "muted-foreground", label: "Foreground" },
    ],
  },
  {
    label: "Accent",
    colors: [
      { name: "accent", label: "Background" },
      { name: "accent-foreground", label: "Foreground" },
    ],
  },
  {
    label: "Destructive",
    colors: [
      { name: "destructive", label: "Background" },
      { name: "destructive-foreground", label: "Foreground" },
    ],
  },
  {
    label: "Border",
    colors: [{ name: "border" }],
  },
  {
    label: "Input",
    colors: [{ name: "input" }],
  },
  {
    label: "Ring",
    colors: [{ name: "ring" }],
  },
];

function Customizer() {
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

  const reset = () => {
    setType("default");
    setTheme(defaultTheme);
  };

  return (
    <div>
      <div className="flex items-start pt-4 md:pt-0">
        <div className="space-y-1 pr-2">
          <div className="font-semibold leading-none tracking-tight">Customize</div>
          <div className="text-xs text-muted-foreground">
            Pick a style and color for your components.
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={reset}
          className="ml-auto rounded-[0.5rem]"
        >
          <Undo2Icon size={20} />
          <span className="sr-only">Reset</span>
        </Button>
      </div>
      <div className="mt-2 flex flex-1 flex-col space-y-2">
        <div className="space-y-1.5">
          <Label className="text-xs">Style</Label>
          <div className="grid grid-cols-3 gap-2">
            {styles.map((style) => {
              return (
                <Button
                  key={style.name}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setStyle(style.name);
                    setType("custom");
                  }}
                  className={cn(
                    "h-8 text-xs",
                    style.name === currentStyle && "border-2 border-primary"
                  )}
                >
                  {style.label}
                </Button>
              );
            })}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Mode</Label>
          <div className="grid grid-cols-3 gap-2">
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
              variant={"outline"}
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
        <div className="space-y-1.5">
          <Label className="text-xs">Colors</Label>
          <div className="grid grid-cols-2 gap-2">
            {colors
              .filter((item) => item.colors.length === 2)
              .map((item, index) => {
                return (
                  <ColorCard label={item.label} key={index}>
                    {item.colors.map((color, colorIndex) => {
                      const hslColor = theme[resolvedMode][color.name];
                      const hexColor = colord(
                        `hsl(${hslColor.split(" ").join(", ")})`
                      ).toHex();
                      return (
                        <ColorPicker
                          key={colorIndex}
                          color={hexColor}
                          onChange={(newColor: string) => {
                            const newHslColor = colord(newColor).toHsl();
                            setTheme({
                              ...theme,
                              [resolvedMode]: {
                                ...theme[resolvedMode],
                                [color.name]: `${newHslColor.h} ${newHslColor.s}% ${newHslColor.l}%`,
                              },
                            });
                            setType("custom");
                          }}
                          label={color.label}
                        />
                      );
                    })}
                  </ColorCard>
                );
              })}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {colors
              .filter((item) => item.colors.length === 1)
              .map((item, index) => {
                return (
                  <ColorCard label={item.label} key={index}>
                    {item.colors.map((color, colorIndex) => {
                      const hslColor = theme[resolvedMode][color.name];
                      const hexColor = colord(
                        `hsl(${hslColor.split(" ").join(", ")})`
                      ).toHex();
                      return (
                        <ColorPicker
                          key={colorIndex}
                          color={hexColor}
                          label={color.label}
                          onChange={(newColor: string) => {
                            const newHslColor = colord(newColor).toHsl();
                            setTheme({
                              ...theme,
                              [resolvedMode]: {
                                ...theme[resolvedMode],
                                [color.name]: `${newHslColor.h} ${newHslColor.s}% ${newHslColor.l}%`,
                              },
                            });
                            setType("custom");
                          }}
                        />
                      );
                    })}
                  </ColorCard>
                );
              })}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Radius</Label>
          <div className="grid grid-cols-5 gap-2">
            {["0", "0.3", "0.5", "0.75", "1.0"].map((value) => {
              return (
                <Button
                  variant={"outline"}
                  size="sm"
                  key={value}
                  className={cn(
                    "h-8 text-xs",
                    theme.radius === value && "border-2 border-primary"
                  )}
                  onClick={() => {
                    setTheme({ ...theme, radius: value });
                  }}
                >
                  {value}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const ColorCard = ({ label, children }: { label: string; children: React.ReactNode }) => {
  return (
    <div className="flex h-7 items-center justify-between rounded-md border border-input bg-background px-1.5 text-xs">
      <span className="">{label}</span>
      <div className="flex items-center space-x-0.5">{children}</div>
    </div>
  );
};

export const ColorPicker = (props: {
  color: string;
  onChange: (newColor: string) => void;
  label?: string;
}) => {
  const { label, color, onChange } = props;

  return (
    <Tooltip>
      <Popover>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <button
              className="h-4 w-4 cursor-pointer rounded-sm border"
              style={{ backgroundColor: color }}
            />
          </PopoverTrigger>
        </TooltipTrigger>
        <PopoverContent className="w-auto p-2">
          <HexColorPicker color={color} onChange={onChange} />
          <HexColorInput
            color={color}
            onChange={onChange}
            // className={cn(inputBase, "mt-2")}
          />
        </PopoverContent>
      </Popover>
      {label && (
        <TooltipContent className="p-2 text-xs">
          <p>{label}</p>
        </TooltipContent>
      )}
    </Tooltip>
  );
};
