"use client";

import React from "react";
import { useStore } from "@tanstack/react-form";

import { useDraftStyleProducer } from "@/modules/style-editor/atoms/draft-style-atom";
import { useStyleEditorForm } from "@/modules/style-editor/context/style-editor-provider";
import { useStyleEditorParams } from "@/modules/style-editor/hooks/use-style-editor-params";
import { useEditorStyle } from "../hooks/use-editor-style";

export function DraftStyleSync() {
  const { slug } = useStyleEditorParams();
  const { isSuccess } = useEditorStyle();
  const form = useStyleEditorForm();

  const name = useStore(form.store, (state) => state.values.name);

  const { updateDraftStyle } = useDraftStyleProducer(slug);

  React.useEffect(() => {
    if (isSuccess && name !== "random-fake") {
      updateDraftStyle({
        theme: form.getFieldValue("theme"),
        variants: form.getFieldValue("variants"),
        icons: form.getFieldValue("icons"),
      });
    }
  }, [form, name, updateDraftStyle, isSuccess]);

  return null;
}
