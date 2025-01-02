import React from "react";
import { PaletteIcon, TerminalSquareIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { Code } from "@/components/code";
import { Button } from "@/components/core/button";
import { Link } from "@/components/core/link";
import { ToggleButton } from "@/components/core/toggle-button";
import { ToggleGroup } from "@/components/core/toggle-group";
import { Header } from "@/components/header";
import { Preview } from "@/app/(app)/(docs)/themes/components/preview";
import { siteConfig } from "@/config";

export default function HomePage() {
  return (
    <div>
      <Header />
      <div className="container min-h-screen">
        <section className="mx-auto max-w-6xl pt-32">
          <h1 className="text-center text-3xl font-bold md:text-5xl lg:text-6xl">
            Craft your component library
            <br /> with a unique style.
          </h1>
          <p className="text-fg-muted mt-5 text-balance text-center text-lg">
            Over 40 components with built-in behavior, adaptive interactions,
            top-tier accessibility, and internationalization out of the box,
            ready for your styles.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button
              size="lg"
              variant="primary"
              href="/docs/getting-started/introduction"
              className="h-12 px-8 text-base font-semibold"
            >
              Get started
            </Button>
            <Button
              href="/themes"
              size="lg"
              variant="outline"
              className="bg-bg-inverse/5 h-12 px-8 text-base font-semibold"
              prefix={<PaletteIcon />}
            >
              Explore themes
            </Button>
          </div>
        </section>
        <section className="relative mt-40">
          <div className="animate-in fade-in-50 zoom-in-50 duration-2000 slide-in-from-bottom-48 absolute left-1/2 top-0 z-0 h-[450px] w-[700px] max-w-[80%] -translate-x-1/2 bg-[radial-gradient(at_0%_0%,#0894ff_0,rgba(0,0,0,0)_40%),radial-gradient(at_50%_30%,#ff2e54_0,rgba(0,0,0,0)_60%),radial-gradient(at_100%_0%,#ff9004_0,rgba(0,0,0,0)_40%)] blur-[100px] ease-in-out" />
          <div className="z-2 relative">
            <ToggleGroup
              className="justify-center"
              defaultSelectedKeys={["default"]}
              disallowEmptySelection
            >
              {[
                { id: "default", label: "Default" },
                { id: "vercel", label: "Vercel" },
                { id: "github", label: "Github" },
                { id: "retro", label: "Retro" },
                { id: "brutalism", label: "Brutalism" },
              ].map((theme) => (
                <ToggleButton
                  key={theme.id}
                  id={theme.id}
                  shape="rectangle"
                  size="sm"
                  className="px-4"
                >
                  {theme.label}
                </ToggleButton>
              ))}
            </ToggleGroup>
            <div className="mt-10 h-[calc(100svh-calc(var(--spacing)*20))] px-20">
              <Preview />
            </div>
          </div>
        </section>
      </div>
      {/* Footer */}
      <div className="container mt-10 border-t p-4">
        <p className="text-fg-muted text-xs">
          Built by{" "}
          <Link variant="quiet" href={siteConfig.links.twitter} target="_blank">
            mehdibha
          </Link>
          . The source code is available on{" "}
          <Link variant="quiet" href={siteConfig.links.github} target="_blank">
            GitHub
          </Link>
        </p>
      </div>
    </div>
  );
}

const Terminal = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("w-[245px] rounded-md border", className)}>
      <div className="bg-bg-muted rounded-t-[inherit] border-b p-1">
        <TerminalSquareIcon className="text-fg-muted size-3" />
      </div>
      <Code
        lang="bash"
        colorReplacements={{
          "#96d0ff": "#ffffff",
        }}
        className="rounded-t-none bg-black/20"
      >
        {children}
      </Code>
    </div>
  );
};
