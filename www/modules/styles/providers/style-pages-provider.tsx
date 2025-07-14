"use client";

import React from "react";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import type { UseFormReturn } from "react-hook-form";

import { COLOR_TOKENS } from "@dotui/registry-definition/registry-tokens";
import { styleDefinitionSchema } from "@dotui/style-engine/schemas-v2";

import { useTRPC } from "@/lib/trpc/react";
import { useDebounce } from "@/hooks/use-debounce";
import { useLiveStyleProducer } from "../atoms/live-style-atom";

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
    values: style ? fakeData : undefined,
  });

  const debouncedLiveStyleData = useDebounce(form.watch(), 10);

  React.useEffect(() => {
    updateLiveStyle(debouncedLiveStyleData);
    console.log("debouncedLiveStyleData", debouncedLiveStyleData);
  }, [debouncedLiveStyleData, updateLiveStyle]);

  const test = form.watch();
  console.log("test", test);

  return (
    <StyleFormContext.Provider
      value={{ form, resolvedMode: "light", isLoading, isError, isSuccess }}
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
  );
}

const fakeData: StyleFormData = {
  name: "Minimalist",
  slug: "minimalist",
  description: "",
  theme: {
    colors: {
      modes: [
        {
          mode: "light",
          lightness: 97,
          saturation: 100,
          contrast: 100,
          scales: {
            neutral: {
              colorKeys: [{ id: 0, color: "#000000" }],
              ratios: [1.05, 1.25, 1.7, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
              overrides: {},
            },
            accent: {
              colorKeys: [{ id: 0, color: "#0091FF" }],
              ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
              overrides: {},
            },
            success: {
              colorKeys: [{ id: 0, color: "#1A9338" }],
              ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
              overrides: {},
            },
            warning: {
              colorKeys: [{ id: 0, color: "#E79D13" }],
              ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
              overrides: {},
            },
            danger: {
              colorKeys: [{ id: 0, color: "#D93036" }],
              ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
              overrides: {},
            },
            info: {
              colorKeys: [{ id: 0, color: "#0091FF" }],
              ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
              overrides: {},
            },
          },
        },
        {
          mode: "dark",
          lightness: 3,
          saturation: 100,
          contrast: 100,
          scales: {
            neutral: {
              colorKeys: [{ id: 0, color: "#ffffff" }],
              ratios: [1.05, 1.25, 1.7, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
              overrides: {},
            },
            accent: {
              colorKeys: [{ id: 0, color: "#0091FF" }],
              ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
              overrides: {},
            },
            success: {
              colorKeys: [{ id: 0, color: "#1A9338" }],
              ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
              overrides: {},
            },
            warning: {
              colorKeys: [{ id: 0, color: "#E79D13" }],
              ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
              overrides: {},
            },
            danger: {
              colorKeys: [{ id: 0, color: "#D93036" }],
              ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
              overrides: {},
            },
            info: {
              colorKeys: [{ id: 0, color: "#0091FF" }],
              ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
              overrides: {},
            },
          },
        },
      ],
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
