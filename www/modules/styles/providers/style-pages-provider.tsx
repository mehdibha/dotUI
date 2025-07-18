"use client";

import React from "react";
import { useParams } from "next/navigation";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod/v4";
import type { UseFormReturn } from "react-hook-form";

import { COLOR_TOKENS } from "@dotui/registry-definition/registry-tokens";
import { styleDefinitionSchema } from "@dotui/style-engine/schemas";

import { useTRPC } from "@/lib/trpc/react";
import { useLiveStyleProducer } from "../atoms/live-style-atom";
import { usePreferences } from "../atoms/preferences-atom";

const formSchema = styleDefinitionSchema.extend({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
});

export type StyleFormData = z.infer<typeof formSchema>;

interface StyleFormContextType {
  form: UseFormReturn<StyleFormData>;
  resolvedMode: "light" | "dark";
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}

const StyleFormContext = React.createContext<StyleFormContextType | null>(null);

export function useStyleForm() {
  const context = React.useContext(StyleFormContext);

  if (!context) {
    throw new Error("useStyleForm must be used within a StyleFormProvider");
  }
  return context;
}

export function StylePagesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { style: slug } = useParams<{ style: string }>();
  const { currentMode } = usePreferences();
  const { updateLiveStyle } = useLiveStyleProducer(slug);

  const trpc = useTRPC();
  const {
    data: style,
    isSuccess,
    isLoading,
    isError,
  } = useQuery(
    trpc.style.bySlug.queryOptions({
      slug,
    }),
  );

  const form = useForm<StyleFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: fakeData,
    // values: style ?? undefined,
  });

  const watchedValues = useWatch({ control: form.control }) as
    | StyleFormData
    | undefined;

  const watchedModes = useWatch({
    name: "theme.colors.modes",
    control: form.control,
  });

  const resolvedMode: "light" | "dark" = React.useMemo(() => {
    if (!watchedModes.dark && !watchedModes.light) return currentMode;
    if (watchedModes.light && watchedModes.dark) return currentMode;
    if (watchedModes.light) return "light";
    return "dark";
  }, [watchedModes, currentMode]);

  React.useEffect(() => {
    if (isSuccess && watchedValues) {
      updateLiveStyle(watchedValues);
    }
  }, [watchedValues, updateLiveStyle, isSuccess]);

  return (
    <StyleFormContext.Provider
      value={{
        form,
        resolvedMode,
        isLoading,
        isError,
        isSuccess,
      }}
    >
      {children}
    </StyleFormContext.Provider>
  );
}

export default function StylePageForm({
  children,
}: {
  children: React.ReactNode;
}) {
  const { form } = useStyleForm();

  return (
    <>
      <form
        onSubmit={form.handleSubmit(
          (data) => {
            console.log("data", data);
          },
          (errors) => {
            console.log("errors", errors);
          },
        )}
      >
        {children}
      </form>
      {/* <DevTool control={form.control} /> */}
    </>
  );
}

const fakeData: StyleFormData = {
  name: "Minimalist",
  slug: "minimalist",
  description: "",
  theme: {
    colors: {
      modes: {
        light: {
          lightness: 97,
          saturation: 100,
          contrast: 100,
          scales: {
            neutral: {
              name: "neutral",
              colorKeys: [{ id: 0, color: "#000000" }],
              ratios: [1.05, 1.25, 1.7, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
              overrides: {},
              smooth: false,
            },
            accent: {
              name: "accent",
              colorKeys: [{ id: 0, color: "#0091FF" }],
              ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
              overrides: {},
              smooth: false,
            },
            success: {
              name: "success",
              colorKeys: [{ id: 0, color: "#1A9338" }],
              ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
              overrides: {},
              smooth: false,
            },
            warning: {
              name: "warning",
              colorKeys: [{ id: 0, color: "#E79D13" }],
              ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
              overrides: {},
              smooth: false,
            },
            danger: {
              name: "danger",
              colorKeys: [{ id: 0, color: "#D93036" }],
              ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
              overrides: {},
              smooth: false,
            },
            info: {
              name: "info",
              colorKeys: [{ id: 0, color: "#0091FF" }],
              ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
              overrides: {},
              smooth: false,
            },
          },
        },
        dark: {
          lightness: 3,
          saturation: 100,
          contrast: 100,
          scales: {
            neutral: {
              name: "neutral",
              colorKeys: [{ id: 0, color: "#ffffff" }],
              ratios: [1.05, 1.25, 1.7, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
              overrides: {},
              smooth: false,
            },
            accent: {
              name: "accent",
              colorKeys: [{ id: 0, color: "#0091FF" }],
              ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
              overrides: {},
              smooth: false,
            },
            success: {
              name: "success",
              colorKeys: [{ id: 0, color: "#1A9338" }],
              ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
              overrides: {},
              smooth: false,
            },
            warning: {
              name: "warning",
              colorKeys: [{ id: 0, color: "#E79D13" }],
              ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
              overrides: {},
              smooth: false,
            },
            danger: {
              name: "danger",
              colorKeys: [{ id: 0, color: "#D93036" }],
              ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
              overrides: {},
              smooth: false,
            },
            info: {
              name: "info",
              colorKeys: [{ id: 0, color: "#0091FF" }],
              ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
              overrides: {},
              smooth: false,
            },
          },
        },
      },
      tokens: COLOR_TOKENS.map((token) => ({
        id: token.name,
        name: token.name,
        value: token.defaultValue,
      })),
    },
    radius: 1,
    spacing: 0.25,
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
    letterSpacing: 0,
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
    alert: "basic",
    buttons: "basic",
    loader: "ring",
    "focus-style": "basic",
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
};
