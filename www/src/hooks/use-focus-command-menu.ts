import { create } from "zustand";
import { RefObject } from "react";

type FocusCommandMenuStore = {
  inputRef: RefObject<HTMLInputElement> | null;
  setInputRef: (ref: RefObject<HTMLInputElement>) => void;
  focusInput: () => void;
};

export const useCommandMenuInputRef = create<FocusCommandMenuStore>(
  (set, get) => ({
    inputRef: null,
    setInputRef: (ref) => set({ inputRef: ref }),
    focusInput: () => {
      const { inputRef } = get();
      console.log("focusInput", inputRef);
      if (inputRef && inputRef.current) {
        inputRef.current.focus();
      }
    },
  })
);
