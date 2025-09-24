"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import type z from "zod/v4";

import { createStyleSchema } from "@dotui/db/schemas";
import { DEFAULT_STYLE } from "@dotui/style-engine/constants";

import { useEditorStyle } from "../hooks/use-editor-style";

const styleEditorFormSchema = createStyleSchema.extend({});

export type StyleFormData = z.infer<typeof styleEditorFormSchema>;

export function StyleEditorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: style } = useEditorStyle();

  const form = useForm<StyleFormData>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    resolver: zodResolver(styleEditorFormSchema),
    defaultValues: fakeData,
    values: style ?? undefined,
    criteriaMode: "all",
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}

export const useStyleEditorForm = () => {
  const context = useFormContext<StyleFormData>();
  if (!context) {
    throw new Error(
      "useStyleEditorForm must be used within a StyleEditorFormProvider",
    );
  }
  return context;
};

const fakeData: StyleFormData = {
  name: "random-fake",
  ...DEFAULT_STYLE,
};
