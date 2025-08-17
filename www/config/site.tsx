import { env } from "@/env";

export const siteConfig = {
  url: env.VERCEL_URL ? `https://${env.VERCEL_URL}` : "http://dotui.org",
  name: "dotUI",
  logo: "https://dotui.org/images/logo.png",
  title: "dotUI",
  description:
    "Build your component library with a unique style. Powered by React, Tailwind CSS, and react-aria. Free and open source.",
  keywords: [
    "dotUI",
    "Next.js",
    "React",
    "Tailwind CSS",
    "React components",
    "React Aria",
    "Accessible components",
  ],
  authors: [
    {
      name: "mehdibha",
      url: "https://www.mehdibha.com",
    },
  ],
  creator: "mehdibha",
  thumbnail: "https://dotui.org/images/thumbnail.png",
  twitter: {
    creator: "@mehdibha_",
  },
  links: {
    github: "https://github.com/mehdibha/dotUI",
    twitter: "https://x.com/mehdibha_",
    discord: "https://discord.gg/DXpj5V2fU8",
    creatorGithub: "https://github.com/mehdibha",
  },
};
