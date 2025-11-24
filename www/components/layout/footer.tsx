import NavLink from "next/link";
import Link from "next/link";

import { Logo } from "@/components/logo";
import { siteConfig } from "@/config/site";

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
] as const;

export const Footer = () => {
  return (
    <div className="@container mt-6 border-t md:mt-10 lg:mt-16">
      <div className="container space-y-10 py-6 md:py-12">
        <div className="flex @3xl:flex-row flex-col items-start justify-between gap-10">
          <div className="space-y-1">
            <Logo type="span" />
            <p className="text-base text-fg-muted">
              Bringing singularity to the web.
            </p>
          </div>
          <div className="flex flex-wrap @2xl:gap-10 gap-6 text-sm">
            {links.map((group, index) => (
              <div key={index}>
                <h2 className="font-bold">{group.label}</h2>
                <ul className="mt-2 space-y-2">
                  {group.links.map((link, index) => (
                    <li key={index}>
                      <NavLink
                        href={link.href}
                        className="text-fg-muted transition-colors duration-200 hover:text-fg"
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
        <p className="text-fg-muted text-sm">
          Built with passion by{" "}
          <Link
            href="https://x.com/mehdibha"
            target="_blank"
            className="underline underline-offset-4"
          >
            @mehdibha
          </Link>
          .
        </p>
      </div>
    </div>
  );
};
