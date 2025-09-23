"use client";

import React from "react";
import type { FieldErrors } from "react-hook-form";

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
        await updateStyleMutation.mutateAsync(data);
      } catch (error) {
        toast.add({
          title: "Failed to update style: " + JSON.stringify(error),
          variant: "danger",
        });
      }
    },
    (errors) => {
      const { head, more } = formatValidationErrors(errors);
      toast.add({
        title: "Validation errors: ",
        description: more
          ? `${head.join("\n")}\n+${more} more`
          : head.join("\n"),
        variant: "danger",
      });
    },
  );

  return <form onSubmit={handleSubmit}>{children}</form>;
}

function formatValidationErrors(errors: FieldErrors, max = 10) {
  const out: string[] = [];
  const walk = (node: any, path: string[] = []) => {
    if (!node || typeof node !== "object") return;
    if (node.message)
      out.push(
        (path.length ? `${path.join(".")}: ` : "") + String(node.message),
      );
    if (node.types && typeof node.types === "object") {
      for (const msg of Object.values(node.types)) {
        out.push((path.length ? `${path.join(".")}: ` : "") + String(msg));
      }
    }
    for (const [k, v] of Object.entries(node)) {
      if (k === "type" || k === "ref" || k === "message" || k === "types")
        continue;
      walk(v as any, [...path, k]);
    }
  };
  walk(errors);
  const uniq = Array.from(new Set(out)).filter(Boolean);
  const head = uniq.slice(0, max);
  const more = Math.max(0, uniq.length - head.length);
  return { head, more };
}
