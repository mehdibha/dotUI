"use client";

import React from "react";
import { usePathname } from "next/navigation";
import type { ContrastColor } from "@adobe/leonardo-contrast-colors";
import type { UseFormReturn } from "react-hook-form";

import {
  fakeData,
  formSchema,
  type StyleFormData,
} from "@/modules/styles/editor/core/schema";
import { useStyleQuery } from "@/modules/styles/editor/core/useStyleQuery";
import { useStyleForm as useStyleFormCore } from "@/modules/styles/editor/core/useStyleForm";
import { useResolvedMode } from "@/modules/styles/editor/core/useResolvedMode";
import { useGeneratedTheme } from "@/modules/styles/editor/core/useGeneratedTheme";
import { useLivePreviewSync } from "@/modules/styles/editor/core/useLivePreviewSync";
import { useSaveStyle } from "@/modules/styles/editor/core/useSaveStyle";

interface StyleFormContextType {
  form: UseFormReturn<StyleFormData>;
  styleId: string;
  slug: string;
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

export function StyleEditorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: style, isLoading, isError, isSuccess, username, styleName } =
    useStyleQuery();

  const form = useStyleFormCore(style ?? undefined);

  const resolvedMode = useResolvedMode(form);
  const generatedTheme = useGeneratedTheme(form, resolvedMode);

  useLivePreviewSync(form, `${username}/${styleName}`, isSuccess);

  return (
    <StyleFormContext.Provider
      value={{
        form,
        slug:
          (style?.visibility === "public"
            ? `${username}/${style?.name}`
            : style?.name) ?? "",
        styleId: style?.id ?? "",
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

export function StyleEditorForm({ children }: { children: React.ReactNode }) {
  const { form, styleId } = useStyleForm();
  const pathname = usePathname();
  const segments = pathname.split("/");
  const username = segments[2] ?? "";
  const styleName = segments[3] ?? "";

  const updateStyleMutation = useSaveStyle({
    styleId,
    styleName,
    username,
  });

  const handleSubmit = form.handleSubmit(
    async (data) => {
      try {
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
