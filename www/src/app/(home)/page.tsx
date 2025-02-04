import React from "react";
import { LayoutTemplateIcon } from "lucide-react";
import { Button } from "@/components/core/button";
import { Link } from "@/components/core/link";
import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { source } from "@/app/source";
import { siteConfig } from "@/config";
import { ThemesPreview } from "./themes-preview";

export default function HomePage() {
  return (
    <div>
      <Header className="hidden md:block" />
      <MobileNav items={source.pageTree.children} className="md:hidden" />
      <div className="isolate grid grid-cols-[50px_1fr_50px]">
        <div className="border-x-(--pattern-fg) h-full border-x bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px]" />
        <div>
          <section className="container relative max-w-screen-xl pb-44 pt-24">
            <Button
              prefix={<LayoutTemplateIcon />}
              variant="outline"
              className="bg-bg-inverse/5 text-fg-muted mb-4 h-7 rounded-lg text-xs [&_svvg]:size-4"
            >
              Introducing themes
            </Button>
            <h1 className="text-balance text-4xl tracking-tighter max-lg:font-medium max-sm:px-4 sm:text-5xl lg:text-6xl">
              Quickly build your component library with a{" "}
              <span className="font-bold italic">unique</span> look.
            </h1>
            <p className="text-fg-muted mt-5 max-w-5xl text-balance text-lg">
              Over 40 components available in multiple variants ready to match
              your brand identity.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Button
                size="lg"
                variant="primary"
                href="/docs/getting-started/introduction"
                className="h-11 px-8"
              >
                Get started
              </Button>
              <Button
                href="/themes"
                size="lg"
                variant="outline"
                className="bg-bg-inverse/5 h-11 px-8"
                // prefix={<PaletteIcon />}
              >
                Explore themes
              </Button>
            </div>
          </section>
          <ThemesPreview />
          {/* Footer */}
          <div className="mt-20 border-t py-6">
            <div className="container space-y-3">
              {/* <p className="text-fg font-josefin text-sm font-extrabold">.</p> */}
              <span className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  className="rounded-xs"
                  viewBox="0 0 300 300"
                >
                  <defs>
                    <clipPath id="a">
                      <path d="M24 0h252c13.254 0 24 10.746 24 24v252c0 13.254-10.746 24-24 24H24c-13.254 0-24-10.746-24-24V24C0 10.746 10.746 0 24 0Zm0 0" />
                    </clipPath>
                    <clipPath id="b">
                      <path d="M187.5 194.418h66.145v66.144H187.5Zm0 0" />
                    </clipPath>
                    <clipPath id="c">
                      <path d="M220.57 194.418c-18.261 0-33.07 14.809-33.07 33.074 0 18.266 14.809 33.07 33.07 33.07 18.266 0 33.075-14.804 33.075-33.07 0-18.265-14.81-33.074-33.075-33.074Zm0 0" />
                    </clipPath>
                  </defs>
                  <g clipPath="url(#a)">
                    <path fill="#fff" d="M-30-30h360v360H-30z" />
                  </g>
                  <g clipPath="url(#b)">
                    <g clipPath="url(#c)">
                      <path
                        fill="#1d1d1d"
                        d="M187.5 194.418h66.145v66.144H187.5Zm0 0"
                      />
                    </g>
                  </g>
                </svg>
                <p className="text-fg font-josefin text-sm font-bold">dotUI.</p>{" "}
              </span>
              <p className="text-fg-muted text-xs">
                Built by{" "}
                <Link
                  variant="quiet"
                  href={siteConfig.links.twitter}
                  target="_blank"
                >
                  mehdibha
                </Link>
                . The source code is available on{" "}
                <Link
                  variant="quiet"
                  href={siteConfig.links.github}
                  target="_blank"
                >
                  GitHub
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="border-x-(--pattern-fg) h-full border-x bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px]" />
      </div>
    </div>
  );
}
