import React from "react";
import { Button } from "@/components/core/button";
import { Link } from "@/components/core/link";
import { Header } from "@/components/header";
import { siteConfig } from "@/config";
import { ThemesPreview } from "./themes-preview";

export default function HomePage() {
  return (
    <div>
      <Header />
      <div className="container">
        <section className="mx-auto max-w-3xl pt-28">
          <h1 className="text-center text-3xl tracking-tight md:text-5xl lg:text-5xl">
            Build your component library
            <br /> with a <span className="font-bold italic">unique</span>{" "}
            style.
          </h1>
          <p className="text-fg-muted mt-5 max-w-5xl text-balance text-center text-lg">
            Over 40 components available in multiple variants ready to match
            your brand identity.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
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
        <section className="mt-35 relative">
          <div className="animate-in fade-in-50 zoom-in-75 slide-in-from-bottom-10 duration-2000 absolute -top-5 left-1/2 z-0 h-[450px] w-[900px] max-w-[80%] -translate-x-1/2 rounded-full bg-[radial-gradient(at_0%_0%,#0894ff_0,rgba(0,0,0,0)_40%),radial-gradient(at_50%_30%,#ff2e54_0,rgba(0,0,0,0)_60%),radial-gradient(at_100%_0%,#ff9004_0,rgba(0,0,0,0)_40%)] blur-[70px] ease-in-out dark:blur-[100px]" />
          <div className="z-2 relative">
            <ThemesPreview />
          </div>
        </section>
      </div>
      {/* Footer */}
      <div className="container mt-20">
        <div className="border-t p-4">
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
  );
}
