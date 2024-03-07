import React from "react";
import Image from "next/image";
import NavLink from "next/link";
import {
  CopyIcon,
  FacebookIcon,
  GithubIcon,
  LinkedinIcon,
  MailIcon,
  TwitterIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config";
import { ThemeToggle } from "../theme-toggle";

// const links = siteConfig.global.externalLinks;

const links = [
  {
    label: "Product",
    links: [
      {
        label: "VSCode extension",
        url: "#",
      },
      {
        label: "Features",
        url: "#",
      },
      {
        label: "Pricing",
        url: "#",
      },
      {
        label: "Ressources",
        url: "#",
      },
      {
        label: "GitHub",
        url: "#",
      },
    ],
  },
  {
    label: "Company",
    links: [
      {
        label: "About",
        url: "#",
      },
      {
        label: "Careers",
        url: "#",
      },
      {
        label: "Contact us",
        url: "#",
      },
    ],
  },
  {
    label: "Support",
    links: [
      {
        label: "Docs",
        url: "#",
      },
      {
        label: "Status",
        url: "#",
      },
    ],
  },
];

const socialLinks = [
  { icon: GithubIcon, url: "https://github.com/quack-ai" },
  { icon: TwitterIcon, url: "#" },
  { icon: LinkedinIcon, url: "#" },
];

export const Footer = () => {
  return (
    <div className="container mt-36 pb-8">
      <div className="flex items-start justify-between">
        <div className="max-w-sm">
          <NavLink
            href="/"
            className="mr-8 flex items-center space-x-2 transition-all duration-300 hover:opacity-80"
          >
            {/* <Image
              src={siteConfig.global.logo}
              alt={siteConfig.global.name}
              loading="lazy"
              width={20}
              height={20}
            /> */}
            <CopyIcon size={20} />
            <span className="inline-block font-bold">{siteConfig.global.name}</span>
          </NavLink>
          <p className="text-md mt-4 text-muted-foreground">
            Build you React app fast and easy with rCopy. Copy and paste components,
            hooks, and more.
          </p>
          <div className="mt-4 flex items-center space-x-4">
            {socialLinks.map((Link, index) => (
              <NavLink
                href={Link.url}
                key={index}
                target="_blank"
                className="text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                <Link.icon size={20} />
              </NavLink>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-16">
          {links.map((group, index) => (
            <div key={index}>
              <h4 className="font-bold">{group.label}</h4>
              <ul className="mt-2 space-y-2">
                {group.links.map((link, index) => (
                  <li key={index}>
                    <NavLink
                      href={link.url}
                      className="text-muted-foreground transition-colors duration-200 hover:text-foreground"
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
        Copyright © 2024 rCopy - All rights reserved.
      </p>
    </div>
  );
};
