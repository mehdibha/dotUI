import React from "react";
import { produce } from "immer";
import { useAtom } from "jotai";
import { withImmer } from "jotai-immer";
import { atomWithStorage } from "jotai/utils";
import type { Color } from "react-aria-components";

import type {
  StyleDefinition,
  ThemeDefinition,
} from "@dotui/registry/style-system/types";

import { useStyleEditorForm } from "@/modules/style-editor/context/style-editor-provider";
import { useStyleEditorParams } from "@/modules/style-editor/hooks/use-style-editor-params";

type DraftStyleState = Record<string, StyleDefinition>;

const draftStyleAtom = withImmer(
  atomWithStorage<DraftStyleState>("draft-styles", {}),
);

const convertColorObjectsToStrings = (
  theme: ThemeDefinition,
): ThemeDefinition => {
  return produce(theme, (draft) => {
    (["light", "dark"] as const).forEach((mode) => {
      const modeData = draft.colors.modes[mode];
      (
        Object.keys(modeData.scales) as (keyof typeof modeData.scales)[]
      ).forEach((scaleKey) => {
        const scale = modeData.scales[scaleKey];
        scale.colorKeys = scale.colorKeys.map((colorKey: string | Color) =>
          typeof colorKey === "string" ? colorKey : colorKey.toString("hex"),
        );
      });
    });
  });
};

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
        theme: convertColorObjectsToStrings(form.getFieldValue("theme")),
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
