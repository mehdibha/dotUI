import type { Route } from "next";
import { IconBlocks, IconIcons } from "@tabler/icons-react";
import { BookIcon, BoxIcon } from "lucide-react";

export const siteConfig = {
  url: "https://dotui.org",
  name: "dotUI",
  logo: "https://dotui.org/images/logo.png",
  title: "dotUI",
  description:
    "Build your design system in seconds, so your app look like your brand, not a preset.",
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
  og: {
    title: "Ship unique.",
    description:
      "Build your design system in seconds, so your app look like your brand, not a preset.",
  },
  links: {
    github: "https://github.com/mehdibha/dotUI",
    twitter: "https://x.com/mehdibha_",
    discord: "https://discord.gg/DXpj5V2fU8",
    creatorGithub: "https://github.com/mehdibha",
  } as const,
};

export const navItems = [
  {
    icon: <BookIcon />,
    name: "Docs",
    url: "/docs",
  },
  {
    icon: <BoxIcon />,
    name: "Components",
    url: "/docs/components",
  },
  {
    icon: <IconBlocks />,
    name: "Blocks",
    url: "/blocks",
  },
  {
    icon: <IconIcons />,
    name: "Styles",
    url: "/styles",
  },
] as { icon: React.ReactNode; name: string; url: Route }[];
