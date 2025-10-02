"use client";

import React from "react";
import type { ContrastColor } from "@adobe/leonardo-contrast-colors";
import type { Color } from "react-aria-components";
import type z from "zod/v4";

import { createStyleSchema } from "@dotui/db/schemas";
import {
  DEFAULT_LIGHT_MODE,
  DEFAULT_STYLE,
} from "@dotui/registry/style-system/constants";
import { createColorScales } from "@dotui/registry/style-system/core";
import { useAppForm } from "@dotui/registry/ui/form";
import { toast } from "@dotui/registry/ui/toast";

import { NavigationBlocker } from "../components/navigation-blocker";
import { useEditorStyle } from "../hooks/use-editor-style";
import { useResolvedModeState } from "../hooks/use-resolved-mode";
import { useStyleEditorParams } from "../hooks/use-style-editor-params";
import { useUpdateStyleMutation } from "../hooks/use-update-style-mutation";

const styleEditorFormSchema = createStyleSchema.extend({});

export type StyleFormData = z.infer<typeof styleEditorFormSchema>;

const defaultValues: StyleFormData = {
  name: "random-fake",
  ...DEFAULT_STYLE,
};

const convertColorObjectsToStrings = (data: StyleFormData): StyleFormData => {
  const converted = structuredClone(data);

  (["light", "dark"] as const).forEach((mode) => {
    const modeData = converted.theme.colors.modes[mode];
    (Object.keys(modeData.scales) as (keyof typeof modeData.scales)[]).forEach(
      (scaleKey) => {
        const scale = modeData.scales[scaleKey];
        scale.colorKeys = scale.colorKeys.map((color: string | Color) =>
          typeof color === "string" ? color : color.toString("hex"),
        );
      },
    );
  });

  return converted;
};

const useForm = () => {
  const { data: style, refetch, isError } = useEditorStyle();
  const { username, style: styleName } = useStyleEditorParams();

  const updateStyleMutation = useUpdateStyleMutation(
    {
      styleId: style?.id,
      name: styleName,
      username,
    },
    {
      onSuccess: (updated) => {
        // if (updated) {
        //   form.reset(updated, { keepDirty: false });
        // }
      },
      onError: () => {
        toast.add({
          title: "Failed to update style",
          variant: "danger",
        });
      },
    },
  );

  return useAppForm({
    defaultValues: style ?? defaultValues,
    validators: {
      onSubmit: styleEditorFormSchema,
    },

    onSubmit: async ({ formApi, value }) => {
      // Convert Color objects to strings before submission
      const convertedValue = convertColorObjectsToStrings(value);
      await updateStyleMutation.mutateAsync(convertedValue);
      await refetch();
      formApi.reset();
    },
  });
};

const StyleEditorFormContext = React.createContext<ReturnType<
  typeof useForm
> | null>(null);

export function StyleEditorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const form = useForm();

  return (
    <StyleEditorFormContext value={form}>
      <NavigationBlocker />
      <GeneratedThemeProvider>{children}</GeneratedThemeProvider>
    </StyleEditorFormContext>
  );
}

// Overload signatures
export function useStyleEditorForm(
  disableWarning: true,
): ReturnType<typeof useForm> | null;
export function useStyleEditorForm(
  disableWarning?: false,
): ReturnType<typeof useForm>;

export function useStyleEditorForm(disableWarning = false) {
  const context = React.use(StyleEditorFormContext);
  if (!context && !disableWarning) {
    throw new Error(
      "useStyleEditorForm must be used within a StyleEditorFormProvider",
    );
  }
  return context;
}

type GeneratedTheme = ContrastColor[];

const defaultGeneratedTheme: GeneratedTheme = createColorScales({
  lightness: DEFAULT_LIGHT_MODE.lightness,
  saturation: DEFAULT_LIGHT_MODE.saturation,
  contrast: DEFAULT_LIGHT_MODE.contrast,
  neutralScale: DEFAULT_LIGHT_MODE.scales.neutral,
  scales: Object.values(DEFAULT_LIGHT_MODE.scales),
});

const GeneratedThemeContext = React.createContext<GeneratedTheme>(
  defaultGeneratedTheme,
);

const SyncThemeContext = React.createContext<() => void>(() => {});

export function GeneratedThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSuccess } = useEditorStyle();
  const form = useStyleEditorForm();
  const [generatedTheme, setGeneratedTheme] = React.useState<GeneratedTheme>(
    defaultGeneratedTheme,
  );
  const { resolvedMode } = useResolvedModeState();

  const syncTheme = React.useCallback(() => {
    const generatedTheme = createColorScales({
      lightness: form.getFieldValue(
        `theme.colors.modes.${resolvedMode}.lightness`,
      ),
      saturation: form.getFieldValue(
        `theme.colors.modes.${resolvedMode}.saturation`,
      ),
      contrast: form.getFieldValue(
        `theme.colors.modes.${resolvedMode}.contrast`,
      ),
      neutralScale: form.getFieldValue(
        `theme.colors.modes.${resolvedMode}.scales.neutral`,
      ),
      scales: Object.values(
        form.getFieldValue(`theme.colors.modes.${resolvedMode}.scales`),
      ),
    });
    setGeneratedTheme(generatedTheme);
  }, [form, resolvedMode]);

  React.useEffect(() => {
    syncTheme();
  }, [isSuccess, syncTheme]);

  return (
    <SyncThemeContext value={syncTheme}>
      <GeneratedThemeContext value={generatedTheme}>
        {children}
      </GeneratedThemeContext>
    </SyncThemeContext>
  );
}

export const useGeneratedTheme = () => {
  const ctx = React.use(GeneratedThemeContext);
  if (!ctx) {
    throw new Error(
      "useGeneratedTheme must be used within a GeneratedThemeProvider",
    );
  }
  return ctx;
};

export const useSyncTheme = () => {
  const ctx = React.use(SyncThemeContext);
  if (!ctx) {
    throw new Error(
      "useSyncTheme must be used within a GeneratedThemeProvider",
    );
  }
  return ctx;
};
