import type { RegistryTheme } from "@dotui/registry";

export const getRegistryThemes = async () => {
  return [
    { id: "darky", label: "Darky" },
    { id: "versel", label: "Versel" },
    { id: "githoub", label: "Githoub" },
  ];
};

// eslint-disable-next-line no-unused-vars
export const getRegistryTheme = async (themeId: string):Promise<RegistryTheme> => {
  return {
    id: "darky",
    label: "Darky",
    iconLibrary: "lucide-icons",
    styles: {
      button: "basic",
      "toggle-button": "basic",
      input: "basic",
      modal: "basic",
    },
  };
};
