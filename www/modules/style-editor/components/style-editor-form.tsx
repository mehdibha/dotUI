"use client";

import React from "react";

import { toast } from "@dotui/ui/components/toast";

import { useStyleEditorForm } from "@/modules/style-editor/context/style-editor-provider";
import { useEditorStyle } from "@/modules/style-editor/hooks/use-editor-style";
import { useStyleEditorParams } from "../hooks/use-style-editor-params";
import { useUpdateStyleMutation } from "../hooks/use-update-style-mutation";

export function StyleEditorForm({ children }: { children: React.ReactNode }) {
  const { data: style } = useEditorStyle();
  const { username, style: styleName } = useStyleEditorParams();

  const form = useStyleEditorForm();
  const updateStyleMutation = useUpdateStyleMutation(
    {
      styleId: style?.id,
      name: styleName,
      username,
    },
    {
      onSuccess: (updated) => {
        if (updated) {
          form.reset(updated, { keepDirty: false });
        }
      },
      onError: () => {
        toast.add({
          title: "Failed to update style",
          variant: "danger",
        });
      },
    },
  );

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
