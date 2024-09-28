import React from "react";
import { TerminalSquareIcon } from "lucide-react";
import { Code } from "@/components/code";
import { CommandMenu } from "@/components/command-menu";
import { siteConfig } from "@/config";
import { Badge } from "@/registry/ui/default/core/badge";
import { Link } from "@/registry/ui/default/core/link";
import { cn } from "@/registry/ui/default/lib/cn";

export default function HomePage() {
  return (
    <div className="relative h-full overflow-hidden">
      <div className="container flex flex-col items-center justify-center h-full">
        <div className="-translate-y-10">
          <h1 className="font-heading text-pretty text-xl font-semibold tracking-tighter sm:text-3xl md:text-4xl">
            Scaffold. implement. ship.
          </h1>
          <h2 className="text-balance mt-3 text-sm text-fg-muted">
            Add components, hooks, themes and much more to your <span className="font-bold">React app</span>.
          </h2>
          <div className="relative w-full">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 opacity-70">
              <div className="z-[-1] h-[350px] w-[700px] animate-pulse-hero-bg bg-[radial-gradient(at_0%_0%,#0894ff_0,rgba(0,0,0,0)_40%),radial-gradient(at_50%_30%,#ff2e54_0,rgba(0,0,0,0)_60%),radial-gradient(at_100%_0%,#ff9004_0,rgba(0,0,0,0)_40%)] blur-[100px] delay-400" />
            </div>
            <CommandMenu className="mt-6 w-full md:min-w-[600px]" />
          </div>
        </div>
        {/* Version */}
        <Badge
          size="md"
          variant="neutral"
          className="absolute right-3 top-3 border text-[#e9e5e5]"
        >
          v0.1.0 beta
        </Badge>
        {/* footer */}
        <div className="absolute bottom-5 left-0 right-0 flex flex-col items-center justify-center gap-6">
          <Terminal />
          <p className="px-4 text-xs text-fg-muted">
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

const Terminal = () => {
  return (
    <div className="w-56 rounded-md border">
      <div className="rounded-t-[inherit] border-b bg-bg-muted p-1">
        <TerminalSquareIcon className="size-3 text-fg-muted" />
      </div>
      <Code
        lang="bash"
        colorReplacements={{
          "#96d0ff": "#ffffff",
        }}
        className="rounded-t-none bg-black/20"
      >
        {`npx dotui@latest init`}
      </Code>
    </div>
  );
};
