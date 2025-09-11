"use client";

import React from "react";
import { useWatch } from "react-hook-form";

import { useDebounce } from "@/hooks/use-debounce";
import { useDraftStyleProducer } from "@/modules/style-editor/atoms/draft-style-atom";
import { useStyleEditorForm } from "@/modules/style-editor/context/style-editor-provider";
import { useStyleEditorParams } from "@/modules/style-editor/hooks/use-style-editor-params";
import { useEditorStyle } from "../hooks/use-editor-style";

export function DraftStyleSync() {
  const { slug } = useStyleEditorParams();
  const { isSuccess } = useEditorStyle();
  const form = useStyleEditorForm();

  const watchedValues = useWatch({
    control: form.control,
    name: ["theme", "variants", "icons"],
  });

  const debouncedWatchedValues = useDebounce(watchedValues, 50);

  const { updateDraftStyle } = useDraftStyleProducer(slug);

  React.useEffect(() => {
    if (isSuccess && debouncedWatchedValues) {
      updateDraftStyle({
        theme: debouncedWatchedValues[0],
        variants: debouncedWatchedValues[1],
        icons: debouncedWatchedValues[2],
      });
    }
  }, [debouncedWatchedValues, updateDraftStyle, isSuccess]);

  return null;
}
