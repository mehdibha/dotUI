import type { RegistryTheme } from "@dotui/schemas";

export const getRegistryThemes = async () => {
  return [
    { id: "darky", label: "Darky" },
    { id: "versel", label: "Versel" },
    { id: "githoub", label: "Githoub" },
  ];
};

export const getRegistryTheme = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  themeId: string
): Promise<RegistryTheme> => {
  return {
    name: "darky",
    label: "Darky",
    iconLibrary: "lucide-icons",
    primitives: {
      button: "basic",
      "toggle-button": "basic",
      input: "basic",
      modal: "basic",
    },
    css: {}, // TODO
  };
};
