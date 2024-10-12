import React from "react";
import { TerminalSquareIcon } from "lucide-react";
import { Code } from "@/components/code";
import { SearchCommand } from "@/components/search-command";
import { TypewriterAnimation } from "@/components/typewriter-animation";
import { Link } from "@/registry/ui/default/core/link";
import { cn } from "@/registry/ui/default/lib/cn";
import { siteConfig } from "@/config";

export default function HomePage() {
  return (
    <div className="absolute inset-0 h-full overflow-hidden">
      <div className="relative size-full">
        <div className="container flex h-full flex-col items-center justify-center">
          <div className="-translate-y-10">
            {/* <h1 className="font-heading xs:text-2xl text-pretty text-xl font-semibold tracking-tighter sm:text-3xl md:text-4xl">
              Scaffold. implement. ship.
            </h1> */}
            <TypewriterAnimation />
            <h2 className="text-fg-muted mt-3 text-sm">
              Add components, hooks, themes and much more to your{" "}
              <span className="font-bold">React app</span>.
            </h2>
            <div className="relative w-full">
              <div className="absolute left-1/2 top-0 -translate-x-1/2">
                <div className="z-[-1] h-[450px] w-[700px] bg-[radial-gradient(at_0%_0%,#0894ff_0,rgba(0,0,0,0)_40%),radial-gradient(at_50%_30%,#ff2e54_0,rgba(0,0,0,0)_60%),radial-gradient(at_100%_0%,#ff9004_0,rgba(0,0,0,0)_40%)] blur-[100px]" />
              </div>
              <SearchCommand
                context
                animated
                className="mt-6 h-64 w-full lg:min-w-[600px]"
              />
            </div>
          </div>
          {/* footer */}
          <div className="absolute bottom-5 left-0 right-0 z-0 flex flex-col items-center justify-center gap-6">
            <Terminal>{`npx dotui@latest init`}</Terminal>
            <p className="text-fg-muted px-4 text-xs">
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
    <div className={cn("w-56 rounded-md border", className)}>
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
