import React from "react";
import NavLink from "next/link";
import Link from "next/link";
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
        href: "/docs/components/buttons/button",
      },
      {
        label: "Styles",
        href: "/styles",
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
        href: `${siteConfig.links.github}/issues/new`,
      },
      {
        label: "Request a feature",
        href: `${siteConfig.links.github}/discussions/new?category=ideas`,
      },
      {
        label: "Request an element",
        href: `${siteConfig.links.github}/discussions/new?category=requests`,
      },
    ],
  },
];

export const Footer = () => {
  return (
    <div className="container max-w-screen-2xl border-t py-12">
      <div className="flex flex-col items-start justify-between gap-10 lg:flex-row">
        <div className="space-y-1">
          <Logo type="span" />
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
      <div className="px-0 pt-6">
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
