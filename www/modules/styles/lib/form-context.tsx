"use client";

import React, { createContext, useContext, useMemo } from "react";
import {
  BackgroundColor as LeonardoBgColor,
  Color as LeonardoColor,
  Theme as LeonardoTheme,
} from "@adobe/leonardo-contrast-colors";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import type { ContrastColor, CssColor } from "@adobe/leonardo-contrast-colors";
import type { UseFormReturn } from "react-hook-form";

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
    spacing: z.number().min(0.1).max(0.35).step(0.05),
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

type StyleFormData = z.infer<typeof createStyleSchema>;

interface StyleFormContextType {
  form: UseFormReturn<StyleFormData>;
  resetForm: () => void;
  generatedTheme: ContrastColor[];
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
  const form = useForm<StyleFormData>({
    resolver: zodResolver(createStyleSchema),
    defaultValues: {
      name: "",
      slug: "",
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
  });

  const neutralColorKeys = form
    .watch(`colors.${currentMode}.colors.neutral.colorKeys`)
    .map((color) => color.color) as CssColor[];
  const neutralRatios = form.watch(
    `colors.${currentMode}.colors.neutral.ratios`,
  );
  const lightness = form.watch(`colors.${currentMode}.lightness`);
  const saturation = form.watch(`colors.${currentMode}.saturation`);
  const contrast = form.watch(`colors.${currentMode}.contrast`) / 100;

  const accentColorKeys = form
    .watch(`colors.${currentMode}.colors.accent.colorKeys`)
    .map((color) => color.color) as CssColor[];
  const accentRatios = form.watch(`colors.${currentMode}.colors.accent.ratios`);
  const successColorKeys = form
    .watch(`colors.${currentMode}.colors.success.colorKeys`)
    .map((color) => color.color) as CssColor[];
  const successRatios = form.watch(
    `colors.${currentMode}.colors.success.ratios`,
  );
  const warningColorKeys = form
    .watch(`colors.${currentMode}.colors.warning.colorKeys`)
    .map((color) => color.color) as CssColor[];
  const warningRatios = form.watch(
    `colors.${currentMode}.colors.warning.ratios`,
  );
  const dangerColorKeys = form
    .watch(`colors.${currentMode}.colors.danger.colorKeys`)
    .map((color) => color.color) as CssColor[];
  const dangerRatios = form
    .watch(`colors.${currentMode}.colors.danger.ratios`)
    .map((ratio) => ratio);
  const infoColorKeys = form
    .watch(`colors.${currentMode}.colors.info.colorKeys`)
    .map((color) => color.color) as CssColor[];
  const infoRatios = form.watch(`colors.${currentMode}.colors.info.ratios`);

  const generatedTheme = useMemo(() => {
    const neutral = new LeonardoBgColor({
      name: "neutral",
      colorKeys: neutralColorKeys,
      ratios: neutralRatios,
    });

    const colors = [
      {
        name: "neutral",
        colorKeys: neutralColorKeys,
        ratios: neutralRatios,
      },
      {
        name: "accent",
        colorKeys: accentColorKeys,
        ratios: accentRatios,
      },
      {
        name: "success",
        colorKeys: successColorKeys,
        ratios: successRatios,
      },
      {
        name: "warning",
        colorKeys: warningColorKeys,
        ratios: warningRatios,
      },
      {
        name: "danger",
        colorKeys: dangerColorKeys,
        ratios: dangerRatios,
      },
      {
        name: "info",
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

    return theme.contrastColors.slice(1) as ContrastColor[];
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

  const value: StyleFormContextType = {
    form,
    resetForm: () => form.reset(),
    generatedTheme,
  };

  return <StyleFormContext value={value}>{children}</StyleFormContext>;
}
