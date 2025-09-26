"use client";

import React from "react";
import type { FormApi } from "@tanstack/react-form";
import type z from "zod/v4";

import { createStyleSchema } from "@dotui/db/schemas";
import { DEFAULT_STYLE } from "@dotui/style-engine/constants";
import { useAppForm } from "@dotui/ui/components/form";
import { SelectItem } from "@dotui/ui/components/select";
import { toast } from "@dotui/ui/components/toast";

import { useEditorStyle } from "../hooks/use-editor-style";
import { useStyleEditorParams } from "../hooks/use-style-editor-params";
import { useUpdateStyleMutation } from "../hooks/use-update-style-mutation";

const styleEditorFormSchema = createStyleSchema.extend({});

export type StyleFormData = z.infer<typeof styleEditorFormSchema>;

const defaultValues: StyleFormData = {
  name: "random-fake",
  ...DEFAULT_STYLE,
};

const useForm = () => {
  const { data: style, refetch } = useEditorStyle();
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
      onChange: styleEditorFormSchema,
    },
    
    onSubmit: async ({ formApi, value }) => {
      await updateStyleMutation.mutateAsync(value);
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
    <StyleEditorFormContext value={form}>{children}</StyleEditorFormContext>
  );
}

export const useStyleEditorForm = () => {
  const context = React.useContext(StyleEditorFormContext);
  if (!context) {
    throw new Error(
      "useStyleEditorForm must be used within a StyleEditorFormProvider",
    );
  }
  return context;
};
