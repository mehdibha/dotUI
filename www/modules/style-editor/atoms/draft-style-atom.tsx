import React from "react";
import { useAtom } from "jotai";
import { withImmer } from "jotai-immer";
import { atomWithStorage } from "jotai/utils";

import type { StyleDefinition } from "@dotui/style-engine/types";

import { useStyleEditorForm } from "@/modules/style-editor/context/style-editor-provider";
import { useStyleEditorParams } from "@/modules/style-editor/hooks/use-style-editor-params";

type DraftStyleState = Record<string, StyleDefinition>;

const draftStyleAtom = withImmer(
  atomWithStorage<DraftStyleState>("draft-styles", {}),
);

export const useDraftStyle = (styleSlug: string) => {
  const [state, setState] = useAtom(draftStyleAtom);

  const currentDraftStyle = React.useMemo(() => {
    return state[styleSlug] || null;
  }, [state, styleSlug]);

  const updateDraftStyle = React.useCallback(
    (style: StyleDefinition) => {
      setState((draft) => {
        draft[styleSlug] = style;
      });
    },
    [setState, styleSlug],
  );

  const clearDraftStyle = React.useCallback(() => {
    setState((draft) => {
      delete draft[styleSlug];
    });
  }, [setState, styleSlug]);

  return {
    draftStyle: currentDraftStyle,
    updateDraftStyle,
    clearDraftStyle,
  };
};

export const useDraftStyleProducer = (styleSlug?: string) => {
  const { slug } = useStyleEditorParams();
  const form = useStyleEditorForm();
  const { updateDraftStyle, clearDraftStyle } = useDraftStyle(
    styleSlug ?? slug,
  );

  React.useEffect(() => {
    return () => {
      clearDraftStyle();
    };
  }, [clearDraftStyle]);

  return () =>
    updateDraftStyle({
      theme: form.getFieldValue("theme"),
      variants: form.getFieldValue("variants"),
      icons: form.getFieldValue("icons"),
    });
};

export const useDraftStyleConsumer = (styleSlug: string) => {
  const { draftStyle } = useDraftStyle(styleSlug);

  return { draftStyle };
};
