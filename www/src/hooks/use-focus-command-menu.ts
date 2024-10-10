import { RefObject } from "react";
import { create } from "zustand";

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
      
      if (inputRef && inputRef.current) {
        inputRef.current.focus();
      }
    },
  })
);
