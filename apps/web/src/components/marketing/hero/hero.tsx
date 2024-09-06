import React from "react";
import { ArrowRightIcon, PinIcon, SparklesIcon } from "lucide-react";
import Balancer from "react-wrap-balancer";
import { SearchDocs } from "@/components/docs/search-docs";
import { GitHubIcon } from "@/components/icons";
import Calendar from "@/lib/demos/components/core/calendar/default";
import { siteConfig } from "@/config";
import { Avatar } from "@/registry/ui/default/core/avatar";
import { AvatarGroup } from "@/registry/ui/default/core/avatar-group";
import { Button } from "@/registry/ui/default/core/button";
import { Switch } from "@/registry/ui/default/core/switch";
import { ToggleButton } from "@/registry/ui/default/core/toggle-button";
import { cn } from "@/registry/ui/default/lib/cn";

export const Hero = ({ className }: { className?: string }) => {
  return (
    <section
      className={cn(
        "w-full items-start justify-between md:flex md:max-w-7xl",
        className
      )}
    >
      <div className="pt-4">
        <Button
          href="https://github.com/mehdibha/dotUI"
          target="_blank"
          prefix={<SparklesIcon />}
          suffix={<ArrowRightIcon />}
          size="sm"
          className="h-7 rounded-md font-mono text-sm text-fg-muted active:text-fg hover:text-fg"
        >
          Star us on GitHub
        </Button>
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
          <Balancer>
            Everything you need to build your{" "}
            <span className="bg-gradient bg-clip-text text-transparent">
              React app
            </span>
          </Balancer>
        </h1>
        <p className="text-md mt-6 text-fg-muted md:text-lg lg:text-xl">
          Accessible, mobile friendly, modern UI components.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button href="/docs/installation" variant="primary" size="lg">
            Read the docs
          </Button>
          <SearchDocs size="lg" className="w-auto max-md:hidden" />
          <Button
            href={siteConfig.links.github}
            prefix={<GitHubIcon />}
            variant="outline"
            size="lg"
            className="md:hidden"
          >
            GitHub
          </Button>
        </div>
      </div>
      <div className="hidden px-10 lg:block xl:px-20">
        <Illustration />
      </div>
    </section>
  );
};

const Illustration = () => {
  return (
    <div className="min-h-[450px] space-y-4 animate-in fade-in slide-in-from-bottom-3">
      <AvatarGroup max={6} total={12}>
        {[
          { name: "@mehdibha", src: "https://github.com/mehdibha.png" },
          { name: "@devongovett", src: "https://github.com/devongovett.png" },
          { name: "@kentcdodds", src: "https://github.com/kentcdodds.png" },
          { name: "@t3dotgg", src: "https://github.com/t3dotgg.png" },
          { name: "@leerob", src: "https://github.com/leerob.png" },
          {
            name: "@joshwcomeau",
            src: "https://github.com/joshwcomeau.png",
          },
        ].map((user) => (
          <Avatar
            key={user.name}
            src={user.src}
            alt={user.name}
            fallback={user.name[1].toUpperCase()}
          />
        ))}
      </AvatarGroup>
      <div className="flex items-center space-x-4">
        <Switch defaultSelected />
        <Button>Button</Button>
        <ToggleButton>
          <PinIcon className="rotate-45" />
        </ToggleButton>
      </div>
      <Calendar />
    </div>
  );
};
