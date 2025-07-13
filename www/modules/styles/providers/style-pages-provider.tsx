"use client";

import React from "react";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import type { UseFormReturn } from "react-hook-form";

import { useTRPC } from "@/lib/trpc/react";
import { styleDefinitionSchema } from "@dotui/style-engine/schemas-v2";

// const formV2Schema = styleDefintionSchema;

const formSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
});

export type StyleFormData = z.infer<typeof formSchema>;

interface StyleFormContextType {
  form: UseFormReturn<StyleFormData>;
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
    defaultValues: {
      name: "Minimalist",
      slug: "minimalist",
      description: "",
    },
    values: style
      ? {
          name: style.name,
          slug: "minimalist",
          description: "",
        }
      : undefined,
  });

  return (
    <StyleFormContext.Provider value={{ form, isLoading, isError, isSuccess }}>
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
