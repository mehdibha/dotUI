"use client";

import React from "react";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod/v4";
import type { ContrastColor } from "@adobe/leonardo-contrast-colors";
import type { UseFormReturn } from "react-hook-form";

import { COLOR_TOKENS } from "@dotui/registry-definition/registry-tokens";
import { createColorScales } from "@dotui/style-engine/core";
import { styleDefinitionSchema } from "@dotui/style-engine/schemas";
import { toast } from "@dotui/ui/components/toast";

import { useDebounce } from "@/hooks/use-debounce";
import { useTRPC, useTRPCClient } from "@/lib/trpc/react";
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
  generatedTheme: ContrastColor[];
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
    values: style ?? undefined,
  });

  const watchedValues = useWatch({ control: form.control }) as
    | StyleFormData
    | undefined;

  const debouncedWatchedValues = useDebounce(watchedValues, 30);
  const watchedActiveModes = useWatch({
    name: "theme.colors.activeModes",
    control: form.control,
  });

  const resolvedMode: "light" | "dark" = React.useMemo(() => {
    if (
      watchedActiveModes.includes("light") &&
      watchedActiveModes.includes("dark")
    )
      return currentMode;
    return watchedActiveModes[0]!;
  }, [watchedActiveModes, currentMode]);

  const currentModeDefinition = useWatch({
    name: `theme.colors.modes.${resolvedMode}`,
    control: form.control,
  });

  const generatedTheme = React.useMemo(() => {
    const theme = createColorScales(currentModeDefinition);
    return theme;
  }, [currentModeDefinition]);

  React.useEffect(() => {
    if (isSuccess && debouncedWatchedValues) {
      updateLiveStyle(debouncedWatchedValues);
    }
  }, [debouncedWatchedValues, updateLiveStyle, isSuccess]);

  return (
    <StyleFormContext.Provider
      value={{
        form,
        resolvedMode,
        generatedTheme,
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
  const { style: slug } = useParams<{ style: string }>();
  const trpc = useTRPC();
  const trpcClient = useTRPCClient();
  const queryClient = useQueryClient();

  const updateStyleMutation = useMutation({
    mutationFn: async (data: StyleFormData) => {
      return await trpcClient.style.update.mutate({
        ...data,
        slug,
      });
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: trpc.style.bySlug.queryKey({ slug }),
      });

      const previousStyle = queryClient.getQueryData(
        trpc.style.bySlug.queryKey({ slug }),
      );

      queryClient.setQueryData(trpc.style.bySlug.queryKey({ slug }), {
        ...variables,
        slug,
      });

      return { previousStyle };
    },
    onError: (error: any, variables, context) => {
      if (context?.previousStyle) {
        queryClient.setQueryData(
          trpc.style.bySlug.queryKey({ slug }),
          context.previousStyle,
        );
      }
      console.error("Failed to update style:", {
        error: error.message || error,
        data: variables,
        slug,
      });
    },
    onSuccess: () => {
      console.log("✅ Style updated successfully:");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.style.bySlug.queryKey({ slug }),
      });
    },
  });

  const handleSubmit = form.handleSubmit(
    async (data) => {
      try {
        console.log("🔄 Submitting style update...");
        toast.add({
          title: "Style updated",
          description: "Your style has been updated successfully",
          variant: "success",
        });
        // await updateStyleMutation.mutateAsync(data);
      } catch (error) {
        console.error("Submission failed:", error);
      }
    },
    (errors) => {
      console.error("❌ Form validation errors:", errors);
    },
  );

  return <form onSubmit={handleSubmit}>{children}</form>;
}

const fakeData: StyleFormData = {
  name: "Minimalist",
  slug: "minimalist",
  description: "",
  theme: {
    colors: {
      activeModes: ["light", "dark"],
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
