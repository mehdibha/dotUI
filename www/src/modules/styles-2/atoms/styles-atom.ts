import { useAtom } from "jotai";
import { withImmer } from "jotai-immer";
import { atomWithStorage } from "jotai/utils";
import { styles } from "@/modules/registry/registry-styles-2";
import { StyleFoudations } from "@/modules/styles-2/types";

type State = {
  currentStyleName: string;
  currentMode: "light" | "dark";
  userStyles: StyleFoudations[];
};

const stylesAtom = withImmer(
  atomWithStorage<State>("new-styles", {
    currentStyleName: "forest",
    currentMode: "light",
    userStyles: [],
  })
);

export const useStyles = () => {
  const [state, setState] = useAtom(stylesAtom);

  const allStyles = [...state.userStyles, ...styles];

  const currentStyle = allStyles.find(
    (style) => (style.name = state.currentStyleName)
  )!;

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
    currentStyle: currentStyle,
    currentMode: state.currentMode,
    setCurrentStyle,
    createStyle,
    updateStyle,
    deleteStyle,
  };
};
