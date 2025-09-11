import React from "react";
import { useAtom } from "jotai";
import { withImmer } from "jotai-immer";
import { atomWithStorage } from "jotai/utils";

import type { StyleDefinition } from "@dotui/style-engine/types";

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

export const useDraftStyleProducer = (styleSlug: string) => {
  const { updateDraftStyle, clearDraftStyle } = useDraftStyle(styleSlug);

  React.useEffect(() => {
    return () => {
      clearDraftStyle();
    };
  }, [clearDraftStyle]);

  return { updateDraftStyle };
};

export const useDraftStyleConsumer = (styleSlug: string) => {
  const { draftStyle } = useDraftStyle(styleSlug);

  return { draftStyle };
};
