"use server";

import { codeToHtml as shikiCodeToHtml, type BundledLanguage } from "shiki";

export const codeToHtml = async (
  code: string,
  _options?: { lang?: BundledLanguage; structure?: "classic" | "inline" }
) => {
  const defaultOptions = { lang: "tsx", structure: "classic" } as const;
  const options = { ...defaultOptions, ..._options };
  const html = await shikiCodeToHtml(code, {
    lang: options?.lang,
    themes: {
      light: "github-light",
      dark: "github-dark-dimmed",
    },
    structure: options?.structure,
  });
  return html;
};
