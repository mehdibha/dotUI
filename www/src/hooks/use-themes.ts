import { create } from "zustand";
import { persist } from "zustand/middleware";

type Config = {
  themes: Theme[];
};

export const useConfig = create<Config>()(
  persist((set) => ({}), {
    name: "preview-theme",
  })
);
