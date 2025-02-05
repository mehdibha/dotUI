import React from "react";
import NavLink from "next/link";
import Link from "next/link";
import { focusRing } from "@/lib/focus-styles";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
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

export const Footer = () => {
  return (
    <div className="border-t py-12">
      <div className="container flex flex-col items-start justify-between gap-10 lg:flex-row">
        <div className="space-y-1">
          <NavLink href="/" className={cn(focusRing(), "flex gap-2 rounded")}>
            <Logo className="translate-y-0.5" />
            <div className="font-josefin font-bold tracking-tighter">
              dotUI.
            </div>
          </NavLink>
          <p className="text-fg-muted text-base">
            Bringing singularity to the web.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm sm:gap-16">
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
      <div className="container px-0 pt-6">
        <p className="text-fg-muted container text-sm">
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
