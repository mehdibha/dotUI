import { useAtom } from "jotai";
import { withImmer } from "jotai-immer";
import { atomWithStorage } from "jotai/utils";
// import { nanoid } from "nanoid";
import { themes } from "@/registry/registry-themes";
import { Theme } from "@/modules/themes/types";

type State = {
  userThemes: Theme[];
  currentTheme: string;
  currentMode: "light" | "dark";
};

const themesAtom = withImmer(
  atomWithStorage<State>("new-themes", {
    userThemes: [],
    currentTheme: "minimalist",
    currentMode: "dark",
  })
);

export const useUserThemes = () => {
  // const [state, setState] = useAtom(themesAtom);
};

export const useCurrentTheme = (): { currentTheme: Theme } => {
  const [state] = useAtom(themesAtom);
  const { currentTheme: currentThemeName } = state;

  const allThemes = [...state.userThemes, ...themes];

  const currentTheme = allThemes.find((t) => t.name === currentThemeName)!;

  return { currentTheme };
};
