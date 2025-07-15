import React from "react";
import { useAtom } from "jotai";
import { withImmer } from "jotai-immer";
import { atomWithStorage } from "jotai/utils";

import type { StyleDefinition } from "@dotui/style-engine/types";

type LiveStyleState = Record<string, StyleDefinition>;

const liveStyleAtom = withImmer(
  atomWithStorage<LiveStyleState>("live-styles", {}),
);

export const useLiveStyle = (styleSlug: string) => {
  const [state, setState] = useAtom(liveStyleAtom);

  const currentLiveStyle = React.useMemo(() => {
    return state[styleSlug] || null;
  }, [state, styleSlug]);

  const updateLiveStyle = React.useCallback(
    (style: StyleDefinition) => {
      setState((draft) => {
        draft[styleSlug] = style;
      });
    },
    [setState, styleSlug],
  );

  const clearLiveStyle = React.useCallback(() => {
    setState((draft) => {
      delete draft[styleSlug];
    });
  }, [setState, styleSlug]);

  return {
    liveStyle: currentLiveStyle,
    updateLiveStyle,
    clearLiveStyle,
  };
};

export const useLiveStyleProducer = (styleSlug: string) => {
  const { updateLiveStyle, clearLiveStyle } = useLiveStyle(styleSlug);

  React.useEffect(() => {
    return () => {
      clearLiveStyle();
    };
  }, [clearLiveStyle]);

  return { updateLiveStyle };
};

export const useLiveStyleConsumer = (styleSlug: string) => {
  const { liveStyle } = useLiveStyle(styleSlug);

  return { liveStyle };
};
