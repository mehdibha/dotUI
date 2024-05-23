import React from "react";
import Image from "next/image";
import NavLink from "next/link";
import Link from "next/link";
import { GitHubIcon, TwitterIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/lib/components/core/default/separator";
import { siteConfig } from "@/config";

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
        label: "Blocks",
        href: "/blocks",
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
        href: siteConfig.links.github,
      },
      {
        label: "Discord",
        href: siteConfig.links.discord,
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
      {
        label: "Request a feature",
        href: "https://github.com/mehdibha/rcopy/discussions/new?category=ideas",
      },
      {
        label: "Request an element",
        href: "https://github.com/mehdibha/rcopy/discussions/new?category=requests",
      },
    ],
  },
];

const socialLinks = [
  { icon: TwitterIcon, href: siteConfig.links.twitter, label: "Twitter" },
  { icon: GitHubIcon, href: siteConfig.links.github, label: "GitHub" },
];

export const Footer = () => {
  return (
    <div>
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
            <p className="text-md mt-4 text-fg-muted">
              Ship your React app in days, not weeks
            </p>
            <div className="mt-4 flex items-center space-x-4">
              {socialLinks.map((Link, index) => (
                <NavLink
                  href={Link.href}
                  key={index}
                  target="_blank"
                  className="text-fg-muted transition-colors duration-200 hover:text-foreground"
                >
                  <Link.icon size={20} />
                  <span className="sr-only">{Link.label}</span>
                </NavLink>
              ))}
            </div>
            <ThemeToggle className="mt-8" />
          </div>
          <div className="flex gap-4 sm:gap-16">
            {links.map((group, index) => (
              <div key={index}>
                <h2 className="font-bold">{group.label}</h2>
                <ul className="mt-2 space-y-2">
                  {group.links.map((link, index) => (
                    <li key={index}>
                      <NavLink
                        href={link.href}
                        className="text-fg-muted transition-colors duration-200 hover:text-foreground"
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
        <p className="text-sm text-fg-muted">
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
