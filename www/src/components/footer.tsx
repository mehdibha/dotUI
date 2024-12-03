import React from "react";
import NavLink from "next/link";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { focusRing } from "@/lib/focus-styles";
import { Avatar } from "@/components/core/avatar";
import { Badge } from "@/components/core/badge";
import { Separator } from "@/components/core/separator";
import { GitHubIcon, TwitterIcon } from "@/components/icons";
import { siteConfig } from "@/config";

const links = [
  {
    label: "Product",
    links: [
      {
        label: "Docs",
        href: "/docs/installation",
      },
      {
        label: "Components",
        href: "/components",
      },
      {
        label: "Hooks",
        href: "/hooks",
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
        href: "https://github.com/mehdibha/dotUI/issues/new",
      },
      {
        label: "Request a feature",
        href: "https://github.com/mehdibha/dotUI/discussions/new?category=ideas",
      },
      {
        label: "Request an element",
        href: "https://github.com/mehdibha/dotUI/discussions/new?category=requests",
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
          <div className="flex max-w-sm flex-col items-start">
            <NavLink
              href="/"
              className={cn(focusRing(), "flex items-center gap-2 rounded")}
            >
              <Avatar
                src={siteConfig.global.logo}
                alt={siteConfig.global.name}
                loading="lazy"
                width={24}
                height={24}
                className="size-6 rounded-sm"
              />
              <div className="font-josephin mt-1 font-bold leading-normal tracking-tighter">
                {siteConfig.global.name}
              </div>
              <Badge size="sm" variant="neutral" className="border">
                beta
              </Badge>
            </NavLink>
            <p className="text-md text-fg-muted mt-2">
              {siteConfig.global.description}
            </p>
            <div className="mt-4 flex items-center gap-4">
              {socialLinks.map((Link, index) => (
                <NavLink
                  href={Link.href}
                  key={index}
                  target="_blank"
                  className="text-fg-muted hover:text-fg transition-colors duration-200"
                >
                  <Link.icon size={20} />
                  <span className="sr-only">{Link.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-6 sm:gap-16">
            {links.map((group, index) => (
              <div key={index}>
                <h2 className="font-bold">{group.label}</h2>
                <ul className="mt-2 space-y-2">
                  {group.links.map((link, index) => (
                    <li key={index}>
                      <NavLink
                        href={link.href}
                        className="text-fg-muted hover:text-fg transition-colors duration-200"
                        target={
                          link.href.startsWith("http") ? "_blank" : undefined
                        }
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
        <p className="text-fg-muted text-sm">
          Built by{" "}
          <Link
            href="https://github.com/mehdibha"
            target="_blank"
            className="underline"
          >
            mehdibha
          </Link>
          . The source code is available on{" "}
          <Link
            href="https://github.com/mehdibha"
            target="_blank"
            className="underline"
          >
            GitHub.
          </Link>
        </p>
      </div>
    </div>
  );
};
