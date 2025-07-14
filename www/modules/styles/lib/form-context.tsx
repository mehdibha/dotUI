"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  BackgroundColor as LeonardoBgColor,
  Color as LeonardoColor,
  Theme as LeonardoTheme,
} from "@adobe/leonardo-contrast-colors";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import type { ContrastColor, CssColor } from "@adobe/leonardo-contrast-colors";
import type { UseFormReturn } from "react-hook-form";

import { DEFAULT_THEME, DEFAULT_VARIANTS } from "@dotui/style-engine/constants";
import type { Style } from "@dotui/style-engine/types";

import { useDebounce } from "@/hooks/use-debounce";
import { useTRPC } from "@/lib/trpc/react";
import { useLiveStyleProducer } from "../atoms/live-style-atom";
import { usePreferences } from "../atoms/preferences-atom";

const colorPaletteSchema = z.object({
  colorKeys: z
    .array(
      z.object({
        id: z.number(),
        color: z.string(),
      }),
    )
    .min(1),
  ratios: z.array(z.number().min(0).max(1)),
  overrides: z.record(z.string(), z.string()),
});

const themeSchema = z.object({
  lightness: z.number().min(0).max(100),
  saturation: z.number().min(0).max(100),
  contrast: z.number().min(0).max(500),
  colors: z.object({
    neutral: colorPaletteSchema,
    accent: colorPaletteSchema,
    success: colorPaletteSchema,
    warning: colorPaletteSchema,
    danger: colorPaletteSchema,
    info: colorPaletteSchema,
  }),
});

const createStyleSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  colors: z.object({
    mode: z.enum(["light-dark", "light-only", "dark-only"]),
    light: themeSchema,
    dark: themeSchema,
    theme: z.record(z.string(), z.string()),
  }),
  layout: z.object({
    radius: z.number().min(0).max(2),
    spacing: z.number().min(0.1).max(0.35),
  }),
  typography: z.object({
    fonts: z.object({
      heading: z.string().min(1),
      body: z.string().min(1),
    }),
    letterSpacing: z.number().min(0).max(0.1),
  }),
  effects: z.object({
    backgroundPattern: z.string(),
    texture: z.string(),
    shadows: z.object({
      color: z.string(),
      opacity: z.number().min(0).max(1),
      blurRadius: z.number().min(0).max(100),
      offsetX: z.number().min(0).max(100),
      offsetY: z.number().min(0).max(100),
      spread: z.number().min(0).max(100),
    }),
  }),
  icons: z.object({
    library: z.string(),
    strokeWidth: z.number().min(0.5).max(3),
  }),
  variants: z.record(z.string(), z.string()),
});

export type StyleFormData = z.infer<typeof createStyleSchema>;

interface StyleFormContextType {
  form: UseFormReturn<StyleFormData>;
  resetForm: () => void;
  generatedTheme: ContrastColor[];
  generatedStyle: Style;
  isSuccess: boolean;
  resolvedMode: "light" | "dark";
}

const StyleFormContext = createContext<StyleFormContextType | null>(null);

export function useStyleForm() {
  const context = useContext(StyleFormContext);

  if (!context) {
    throw new Error("useStyleForm must be used within a StyleFormProvider");
  }
  return context;
}

interface StyleFormProviderProps {
  children: React.ReactNode;
}

export function StyleFormProvider({ children }: StyleFormProviderProps) {
  const { currentMode } = usePreferences();
  const { style: slug } = useParams<{ style: string }>();

  const trpc = useTRPC();
  const { data: style, isSuccess } = useQuery(
    trpc.style.bySlug.queryOptions({
      slug,
    }),
  );
  const { updateLiveStyle } = useLiveStyleProducer(slug);

  const form = useForm<StyleFormData>({
    resolver: zodResolver(createStyleSchema),
    defaultValues: {
      name: "Minimalist",
      slug: "minimalist",
      description: "",
      colors: {
        mode: "light-dark",
        light: {
          lightness: 97,
          saturation: 100,
          contrast: 100,
          colors: {
            neutral: {
              colorKeys: [{ id: 0, color: "#000000" }],
              ratios: [1.05, 1.25, 1.7, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
            },
            accent: {
              colorKeys: [{ id: 0, color: "#0091FF" }],
              ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
            },
            success: {
              colorKeys: [{ id: 0, color: "#1A9338" }],
              ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
            },
            warning: {
              colorKeys: [{ id: 0, color: "#E79D13" }],
              ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
            },
            danger: {
              colorKeys: [{ id: 0, color: "#D93036" }],
              ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
            },
            info: {
              colorKeys: [{ id: 0, color: "#0091FF" }],
              ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
            },
          },
        },
        dark: {
          lightness: 3,
          saturation: 100,
          contrast: 100,
          colors: {
            neutral: {
              colorKeys: [{ id: 0, color: "#ffffff" }],
              ratios: [1.05, 1.25, 1.7, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
            },
            accent: {
              colorKeys: [{ id: 0, color: "#0091FF" }],
              ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
            },
            success: {
              colorKeys: [{ id: 0, color: "#1A9338" }],
              ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
            },
            warning: {
              colorKeys: [{ id: 0, color: "#E79D13" }],
              ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
            },
            danger: {
              colorKeys: [{ id: 0, color: "#D93036" }],
              ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
            },
            info: {
              colorKeys: [{ id: 0, color: "#0091FF" }],
              ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
            },
          },
        },
      },
      layout: {
        radius: 1,
        spacing: 0.25,
      },
      typography: {
        fonts: {
          heading: "Inter",
          body: "Inter",
        },
        letterSpacing: 0,
      },
      effects: {
        backgroundPattern: "none",
        texture: "none",
        shadows: {
          color: "#000000",
          opacity: 0.1,
          blurRadius: 10,
          offsetX: 0,
          offsetY: 1,
          spread: 0,
        },
      },
      icons: {
        library: "lucide",
        strokeWidth: 1.5,
      },
      variants: {
        loader: "ring",
        "focus-style": "basic",
        buttons: "basic",
        inputs: "basic",
        pickers: "basic",
        selection: "basic",
        calendars: "basic",
        "list-box-and-menu": "basic",
        overlays: "basic",
        checkboxes: "basic",
        radios: "basic",
        switch: "basic",
        slider: "basic",
        "badge-and-tag-group": "basic",
        tooltip: "basic",
      },
    },
    values: style
      ? {
          name: style.name,
          slug: "minimalist",
          description: "",
          colors: {
            mode: "light-dark",
            light: {
              lightness: 97,
              saturation: 100,
              contrast: 100,
              colors: {
                neutral: {
                  colorKeys: [{ id: 0, color: "#000000" }],
                  ratios: [
                    1.05, 1.25, 1.7, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                  ],
                  overrides: {},
                },
                accent: {
                  colorKeys: [{ id: 0, color: "#0091FF" }],
                  ratios: [
                    1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                  ],
                  overrides: {},
                },
                success: {
                  colorKeys: [{ id: 0, color: "#1A9338" }],
                  ratios: [
                    1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                  ],
                  overrides: {},
                },
                warning: {
                  colorKeys: [{ id: 0, color: "#E79D13" }],
                  ratios: [
                    1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                  ],
                  overrides: {},
                },
                danger: {
                  colorKeys: [{ id: 0, color: "#D93036" }],
                  ratios: [
                    1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                  ],
                  overrides: {},
                },
                info: {
                  colorKeys: [{ id: 0, color: "#0091FF" }],
                  ratios: [
                    1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                  ],
                  overrides: {},
                },
              },
            },
            dark: {
              lightness: 3,
              saturation: 100,
              contrast: 100,
              colors: {
                neutral: {
                  colorKeys: [{ id: 0, color: "#ffffff" }],
                  ratios: [
                    1.05, 1.25, 1.7, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                  ],
                  overrides: {},
                },
                accent: {
                  colorKeys: [{ id: 0, color: "#0091FF" }],
                  ratios: [
                    1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                  ],
                  overrides: {},
                },
                success: {
                  colorKeys: [{ id: 0, color: "#1A9338" }],
                  ratios: [
                    1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                  ],
                  overrides: {},
                },
                warning: {
                  colorKeys: [{ id: 0, color: "#E79D13" }],
                  ratios: [
                    1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                  ],
                  overrides: {},
                },
                danger: {
                  colorKeys: [{ id: 0, color: "#D93036" }],
                  ratios: [
                    1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                  ],
                  overrides: {},
                },
                info: {
                  colorKeys: [{ id: 0, color: "#0091FF" }],
                  ratios: [
                    1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                  ],
                  overrides: {},
                },
              },
            },
            theme: {},
          },
          layout: {
            radius: 1,
            spacing: 0.25,
          },
          typography: {
            fonts: {
              heading: "Inter",
              body: "Inter",
            },
            letterSpacing: 0,
          },
          effects: {
            backgroundPattern: "none",
            texture: "none",
            shadows: {
              color: "#000000",
              opacity: 0.1,
              blurRadius: 10,
              offsetX: 0,
              offsetY: 1,
              spread: 0,
            },
          },
          icons: {
            library: "lucide",
            strokeWidth: 1.5,
          },
          variants: {
            loader: "ring",
            "focus-style": "basic",
            buttons: "basic",
            inputs: "basic",
            pickers: "basic",
            selection: "basic",
            calendars: "basic",
            "list-box-and-menu": "basic",
            overlays: "basic",
            checkboxes: "basic",
            radios: "basic",
            switch: "basic",
            slider: "basic",
            "badge-and-tag-group": "basic",
            tooltip: "basic",
          },
        }
      : undefined,
  });

  const colorMode = form.watch("colors.mode");
  const resolvedMode = "dark";

  console.log("resolvedMode", resolvedMode);

  const neutralColorKeys = form
    .watch(`colors.${resolvedMode}.colors.neutral.colorKeys`)
    .map((color) => color.color) as CssColor[];
  const neutralRatios = form.watch(
    `colors.${resolvedMode}.colors.neutral.ratios`,
  );
  const lightness = form.watch(`colors.${resolvedMode}.lightness`);
  const saturation = form.watch(`colors.${resolvedMode}.saturation`);
  const contrast = form.watch(`colors.${resolvedMode}.contrast`) / 100;

  const accentColorKeys = form
    .watch(`colors.${resolvedMode}.colors.accent.colorKeys`)
    .map((color) => color.color) as CssColor[];
  const accentRatios = form.watch(
    `colors.${resolvedMode}.colors.accent.ratios`,
  );
  const successColorKeys = form
    .watch(`colors.${resolvedMode}.colors.success.colorKeys`)
    .map((color) => color.color) as CssColor[];
  const successRatios = form.watch(
    `colors.${resolvedMode}.colors.success.ratios`,
  );
  const warningColorKeys = form
    .watch(`colors.${resolvedMode}.colors.warning.colorKeys`)
    .map((color) => color.color) as CssColor[];
  const warningRatios = form.watch(
    `colors.${resolvedMode}.colors.warning.ratios`,
  );
  const dangerColorKeys = form
    .watch(`colors.${resolvedMode}.colors.danger.colorKeys`)
    .map((color) => color.color) as CssColor[];
  const dangerRatios = form
    .watch(`colors.${resolvedMode}.colors.danger.ratios`)
    .map((ratio) => ratio);
  const infoColorKeys = form
    .watch(`colors.${resolvedMode}.colors.info.colorKeys`)
    .map((color) => color.color) as CssColor[];
  const infoRatios = form.watch(`colors.${resolvedMode}.colors.info.ratios`);

  const generatedTheme = useMemo(() => {
    const neutral = new LeonardoBgColor({
      name: "neutral-",
      colorKeys: neutralColorKeys,
      ratios: neutralRatios,
    });

    const colors = [
      {
        name: "neutral-",
        colorKeys: neutralColorKeys,
        ratios: neutralRatios,
      },
      {
        name: "accent-",
        colorKeys: accentColorKeys,
        ratios: accentRatios,
      },
      {
        name: "success-",
        colorKeys: successColorKeys,
        ratios: successRatios,
      },
      {
        name: "warning-",
        colorKeys: warningColorKeys,
        ratios: warningRatios,
      },
      {
        name: "danger-",
        colorKeys: dangerColorKeys,
        ratios: dangerRatios,
      },
      {
        name: "info-",
        colorKeys: infoColorKeys,
        ratios: infoRatios,
      },
    ].map((color) => new LeonardoColor(color));

    const theme = new LeonardoTheme({
      backgroundColor: neutral,
      colors,
      lightness,
      saturation,
      contrast,
      output: "HEX",
    });

    return (theme.contrastColors.slice(1) as ContrastColor[]).map((color) => {
      return {
        name: color.name.replace("-", ""),
        values: color.values.map((value) => ({
          name: value.name,
          contrast: value.contrast,
          value: value.value,
        })),
      };
    });
  }, [
    neutralColorKeys,
    neutralRatios,
    lightness,
    saturation,
    contrast,
    accentColorKeys,
    accentRatios,
    successColorKeys,
    successRatios,
    warningColorKeys,
    warningRatios,
    dangerColorKeys,
    dangerRatios,
    infoColorKeys,
    infoRatios,
  ]);

  const generatedStyle: Style = {
    name: "styleTest",
    slug: "style-test",
    description: "",
    iconLibrary: "lucide",
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
    variants: DEFAULT_VARIANTS,
    theme: {
      css: {},
      cssVars: {
        light: generatedTheme.reduce(
          (acc, colorGroup) => {
            colorGroup.values.forEach((colorValue) => {
              acc[`--${colorValue.name}`] = colorValue.value;
            });
            return acc;
          },
          {} as Record<string, string>,
        ),
        dark: generatedTheme.reduce(
          (acc, colorGroup) => {
            colorGroup.values.forEach((colorValue) => {
              acc[`${colorValue.name}`] = colorValue.value;
            });
            return acc;
          },
          {} as Record<string, string>,
        ),
        theme: DEFAULT_THEME,
      },
    },
  };

  const debouncedLiveStyleData = useDebounce(generatedStyle, 10);

  React.useEffect(() => {
    updateLiveStyle(debouncedLiveStyleData);
  }, [debouncedLiveStyleData, updateLiveStyle]);

  const value: StyleFormContextType = {
    form,
    resetForm: () => form.reset(),
    generatedTheme,
    generatedStyle,
    isSuccess,
    resolvedMode,
  };

  return <StyleFormContext value={value}>{children}</StyleFormContext>;
}
