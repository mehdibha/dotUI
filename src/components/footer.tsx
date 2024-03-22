import React from "react";
import Image from "next/image";
import NavLink from "next/link";
import Link from "next/link";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config";
import { ThemeToggle } from "./theme-toggle";

const links = [
  {
    label: "Product",
    links: [
      {
        label: "Components",
        href: "/components",
      },
      {
        label: "Hooks",
        href: "/hooks",
      },
      {
        label: "Icons",
        href: "/icons",
      },
      {
        label: "Pages",
        href: "/pages",
      },
      {
        label: "Templates",
        href: "/templates",
      },
    ],
  },
  {
    label: "Community",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/mehdibha/rcopy",
      },
      {
        label: "Discord",
        href: "https://discord.gg/DXpj5V2fU8",
      },
    ],
  },
  {
    label: "Support",
    links: [
      {
        label: "Open an issue",
        href: "https://github.com/mehdibha/rcopy/issues/new",
      },
    ],
  },
];

const socialLinks = [
  { icon: GithubIcon, href: "https://github.com/mehdibha/rcopy" },
  { icon: TwitterIcon, href: "#" },
  { icon: LinkedinIcon, href: "#" },
];

export const Footer = () => {
  return (
    <div className="">
      <div className="container py-8">
        <div className="flex flex-col items-start justify-between gap-10 lg:flex-row">
          <div className="max-w-sm">
            <NavLink
              href="/"
              className="mr-8 flex items-center space-x-2 transition-all duration-300 hover:opacity-80"
            >
              <Image
                src={siteConfig.global.logo}
                alt={siteConfig.global.name}
                loading="lazy"
                width={20}
                height={20}
              />
              <span className="inline-block font-bold">{siteConfig.global.name}</span>
            </NavLink>
            <p className="text-md mt-4 text-muted-foreground">
              Ship your React app in days, not weeks
            </p>
            <div className="mt-4 flex items-center space-x-4">
              {socialLinks.map((Link, index) => (
                <NavLink
                  href={Link.href}
                  key={index}
                  target="_blank"
                  className="text-muted-foreground transition-colors duration-200 hover:text-foreground"
                >
                  <Link.icon size={20} />
                </NavLink>
              ))}
            </div>
            <ThemeToggle className="mt-8" />
          </div>
          <div className="grid grid-cols-3 gap-4 sm:gap-16">
            {links.map((group, index) => (
              <div key={index}>
                <h4 className="font-bold">{group.label}</h4>
                <ul className="mt-2 space-y-2">
                  {group.links.map((link, index) => (
                    <li key={index}>
                      <NavLink
                        href={link.href}
                        className="text-muted-foreground transition-colors duration-200 hover:text-foreground"
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                      >
                        {link.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <Separator className="mb-4 mt-12" />
        <p className="text-sm text-muted-foreground">
          Built by{" "}
          <Link href="https://github.com/mehdibha" target="_blank" className="underline">
            mehdibha
          </Link>
          . The source code is available on{" "}
          <Link href="https://github.com/mehdibha" target="_blank" className="underline">
            GitHub.
          </Link>
        </p>
      </div>
    </div>
  );
};
