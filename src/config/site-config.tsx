import { FacebookIcon, GithubIcon, MailIcon } from "lucide-react";

export const siteConfig = {
  global: {
    url: "https://rCopy.com",
    name: "rCopy",
    logo: "/images/logo.png",
    title: "rCopy",
    description:
      "Copy and paste components, hooks, icons, pages, templates and more for your react app.",
    keywords: [],
    authors: [
      {
        name: "mehdibha",
        url: "https://www.mehdibha.com",
      },
    ],
    creator: "mehdibha",
    thumbnail: "/images/thumbnail.jpg",
    twitter: {
      creator: "@mehdibha_",
    },
    externalLinks: [
      { icon: FacebookIcon, url: "https://www.facebook.com/groups/160143328137207" },
      { icon: MailIcon, url: "mailto:hello@mehdibha.com" },
      { icon: GithubIcon, url: "https://github.com/mehdibha/vapi.tn" },
    ],
  },
  header: {
    nav: {
      links: [
        { href: "/components", label: "Components", disabled: true },
        { href: "/hooks", label: "Hooks" },
        { href: "/icons", label: "Icons" },
        { href: "/pages", label: "Pages", disabled: true },
        { href: "/templates", label: "Templates" },
      ],
    },
  },
};
