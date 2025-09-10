"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import type { ContrastColor } from "@adobe/leonardo-contrast-colors";
import type { UseFormReturn } from "react-hook-form";

import { COLOR_TOKENS } from "@dotui/registry-definition/registry-tokens";
import { createColorScales } from "@dotui/style-engine/core";
import { styleDefinitionSchema } from "@dotui/style-engine/schemas";
import { toast } from "@dotui/ui/components/toast";

import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { useTRPC, useTRPCClient } from "@/lib/trpc/react";
import { useLiveStyleProducer } from "../atoms/live-style-atom";
import { usePreferences } from "../atoms/preferences-atom";

const formSchema = styleDefinitionSchema.extend({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().nullable().optional(),
  id: z.string().optional(),
  userId: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().nullable().optional(),
  isFeatured: z.boolean().optional(),
  visibility: z.enum(["public", "unlisted", "private"]).optional(),
});

export type StyleFormData = z.infer<typeof formSchema>;

interface StyleFormContextType {
  form: UseFormReturn<StyleFormData>;
  styleId: string;
  slug: string;
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

const ResolvedModeContext = React.createContext<"light" | "dark" | null>(null);
export function useResolvedMode() {
  const value = React.useContext(ResolvedModeContext);
  if (!value) throw new Error("useResolvedMode must be used within StyleEditorProvider");
  return value;
}

const GeneratedThemeContext = React.createContext<ContrastColor[] | null>(null);
export function useGeneratedTheme() {
  const value = React.useContext(GeneratedThemeContext);
  if (!value) throw new Error("useGeneratedTheme must be used within StyleEditorProvider");
  return value;
}

export function StyleEditorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const username = segments[2] ?? "";
  const styleName = segments[3] ?? "";

  const { activeMode } = usePreferences();
  const { updateLiveStyle } = useLiveStyleProducer(`${username}/${styleName}`);

  const trpc = useTRPC();
  const {
    data: style,
    isLoading,
    isError,
    isSuccess,
  } = useQuery(
    trpc.style.getByNameAndUsername.queryOptions({
      name: styleName,
      username,
    }),
  );

  const form = useForm<StyleFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: fakeData,
    values: style ? { ...style, slug: style.name } : undefined,
  });

  const publishLiveStyle = useDebouncedCallback(
    (values: StyleFormData) => {
      updateLiveStyle(values);
    },
    60,
  );
  const watchedActiveModes = useWatch({
    name: "theme.colors.activeModes",
    control: form.control,
  });

  const resolvedMode: "light" | "dark" = React.useMemo(() => {
    if (
      watchedActiveModes.includes("light") &&
      watchedActiveModes.includes("dark")
    )
      return activeMode;
    return watchedActiveModes[0]!;
  }, [watchedActiveModes, activeMode]);

  const currentModeDefinition = useWatch({
    name: `theme.colors.modes.${resolvedMode}`,
    control: form.control,
  });

  const generatedTheme = React.useMemo(() => {
    const theme = createColorScales(currentModeDefinition);
    return theme;
  }, [currentModeDefinition]);

  React.useEffect(() => {
    if (!isSuccess) return;
    const subscription = form.watch((values) => {
      publishLiveStyle((values as StyleFormData) ?? form.getValues());
    });
    return () => subscription.unsubscribe();
  }, [form, publishLiveStyle, isSuccess]);

  const contextValue = React.useMemo(
    () => ({
      form,
      slug: (style?.visibility === "public"
        ? `${username}/${style?.name}`
        : style?.name)!,
      styleId: style?.id ?? "",
      isLoading,
      isError,
      isSuccess,
    }),
    [form, style?.visibility, style?.name, style?.id, username, isLoading, isError, isSuccess],
  );

  return (
    <StyleFormContext.Provider value={contextValue}>
      <ResolvedModeContext.Provider value={resolvedMode}>
        <GeneratedThemeContext.Provider value={generatedTheme}>
          {children}
        </GeneratedThemeContext.Provider>
      </ResolvedModeContext.Provider>
    </StyleFormContext.Provider>
  );
}

export function StyleEditorForm({ children }: { children: React.ReactNode }) {
  const { form, styleId } = useStyleForm();
  const trpc = useTRPC();
  const trpcClient = useTRPCClient();
  const queryClient = useQueryClient();

  const pathname = usePathname();
  const segments = pathname.split("/");
  const username = segments[2] ?? "";
  const styleName = segments[3] ?? "";

  const updateStyleMutation = useMutation({
    mutationFn: async (data: StyleFormData) => {
      if (!styleId) throw new Error("Missing style id");
      return await trpcClient.style.update.mutate({
        id: styleId,
        theme: data.theme,
        icons: data.icons,
        variants: data.variants,
      });
    },
    onMutate: async (variables: StyleFormData) => {
      const queryKey = trpc.style.getByNameAndUsername.queryKey({
        name: styleName,
        username,
      });

      await queryClient.cancelQueries({ queryKey });

      const previousStyle = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          theme: variables.theme,
          icons: variables.icons,
          variants: variables.variants,
          updatedAt: new Date(),
        };
      });

      return { previousStyle, queryKey } as const;
    },
    onError: (error: unknown, _variables, context) => {
      if (context?.previousStyle) {
        queryClient.setQueryData(context.queryKey, context.previousStyle);
      }
      toast.add({
        title: "Failed to update style",
        variant: "danger",
      });
    },
    onSuccess: (updated: any) => {
      const queryKey = trpc.style.getByNameAndUsername.queryKey({
        name: styleName,
        username,
      });
      queryClient.setQueryData(queryKey, updated);
      if (updated) {
        const nextValues = { ...updated, slug: updated.name } as StyleFormData;
        form.reset(
          {
            ...nextValues,
            description:
              nextValues.description ?? form.getValues("description"),
            userId: nextValues.userId ?? form.getValues("userId"),
          },
          { keepDirty: false },
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.style.getByNameAndUsername.queryKey({
          name: styleName,
          username,
        }),
      });
    },
  });

  const handleSubmit = form.handleSubmit(
    async (data) => {
      try {
        console.log("🔄 Submitting style update...");
        await updateStyleMutation.mutateAsync(data);
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
