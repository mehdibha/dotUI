import React from "react";
import { useAtom } from "jotai";
import { withImmer } from "jotai-immer";
import { atomWithStorage } from "jotai/utils";

import type { StyleDefinition } from "@dotui/registry/style-system/types";

import { useStyleEditorForm } from "@/modules/style-editor/context/style-editor-provider";
import { useStyleEditorParams } from "@/modules/style-editor/hooks/use-style-editor-params";
import { convertThemeColorObjects } from "@/modules/style-editor/lib/convert-theme-color-objects";

type DraftStyleState = Record<string, StyleDefinition>;

const draftStyleAtom = withImmer(
  atomWithStorage<DraftStyleState>("draft-styles", {}),
);

export const useDraftStyle = (styleSlug?: string) => {
  const { slug } = useStyleEditorParams();
  const form = useStyleEditorForm(true);
  const [state, setState] = useAtom(draftStyleAtom);

  const finalSlug = styleSlug ?? slug;

  const draftStyle = React.useMemo(() => {
    return state[finalSlug] || null;
  }, [state, finalSlug]);

  const saveDraft = React.useCallback(() => {
    if (!form) return;
    setState((draft) => {
      draft[finalSlug] = {
        theme: convertThemeColorObjects(form.getFieldValue("theme")),
        variants: form.getFieldValue("variants"),
        icons: form.getFieldValue("icons"),
      };
    });
  }, [setState, finalSlug, form]);

  const clearDraft = React.useCallback(() => {
    setState((draft) => {
      delete draft[finalSlug];
    });
  }, [setState, finalSlug]);

  return {
    draftStyle,
    saveDraft,
    clearDraft,
  };
};
