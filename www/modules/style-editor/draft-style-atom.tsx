import React from "react";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { withImmer } from "jotai-immer";

import type { StyleDefinition } from "@dotui/registry/style-system/types";

import { useStyleEditorForm } from "@/modules/style-editor/style-editor-provider";
import { convertThemeColorObjects } from "@/modules/style-editor/theme-utils";
import { useStyleEditorParams } from "@/modules/style-editor/use-style-editor-params";

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
