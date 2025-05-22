import React from "react";
import { useAtom } from "jotai";
import { withImmer } from "jotai-immer";
import { atomWithStorage } from "jotai/utils";
import { styles } from "@/modules/registry/registry-styles";
import { StyleFoudations } from "@/modules/styles/types";

type State = {
  currentStyleName: string;
  currentMode: "light" | "dark";
  userStyles: StyleFoudations[];
};

const stylesAtom = withImmer(
  atomWithStorage<State>("new-styles", {
    currentStyleName: "material",
    currentMode: "dark",
    userStyles: [],
  })
);

export const useStyles = () => {
  const [state, setState] = useAtom(stylesAtom);
  const allStyles = [...state.userStyles, ...styles];

  const currentStyle = allStyles.find(
    (style) => (style.name === state.currentStyleName)
  )!;

  const setCurrentMode = async (mode: "light" | "dark") => {
    setState((draft) => {
      draft.currentMode = mode;
    });
  };

  const setCurrentStyle = async (styleName: string) => {
    setState((draft) => {
      draft.currentStyleName = styleName;
    });
  };

  const createStyle = async (style: StyleFoudations) => {
    setState((draft) => {
      draft.userStyles.push(style);
    });
  };

  const updateStyle = async (style: StyleFoudations) => {
    setState((draft) => {
      const index = draft.userStyles.findIndex((s) => s.name === style.name);
      if (index !== -1) {
        draft.userStyles[index] = style;
      }
    });
  };

  const deleteStyle = async (styleName: string) => {
    setState((draft) => {
      draft.userStyles = draft.userStyles.filter((s) => s.name !== styleName);
    });
  };

  return {
    currentMode: state.currentMode,
    setCurrentMode,
    currentStyle,
    setCurrentStyle,
    createStyle,
    updateStyle,
    deleteStyle,
  };
};
