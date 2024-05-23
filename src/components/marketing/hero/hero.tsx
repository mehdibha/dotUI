import React from "react";
import Link from "next/link";
import { ArrowRightIcon, SparklesIcon } from "lucide-react";
import Balancer from "react-wrap-balancer";
import { SearchDocs } from "@/components/docs/search-docs";
import { badgeVariants } from "@/lib/components/core/default/badge";
import { LinkButton } from "@/lib/components/core/default/button";
import { cn } from "@/lib/utils/classes";
import { Animation } from "./animation";

export const Hero = ({ className }: { className?: string }) => {
  return (
    <section
      className={cn("mx-auto flex max-w-7xl items-start justify-between", className)}
    >
      <div className="pt-4">
        <Link
          href="https://github.com/mehdibha/rcopy"
          target="_blank"
          className={cn(
            badgeVariants({ variant: "outline" }),
            "cursor-pointer space-x-2 font-mono delay-75 duration-200 hover:bg-bg-muted"
          )}
        >
          <SparklesIcon size={18} />
          <span>Star us on GitHub</span> <ArrowRightIcon size={15} />
        </Link>
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
          <Balancer>
            Everything you need to build your{" "}
            <span className="bg-gradient bg-clip-text text-transparent">React app</span>
          </Balancer>
        </h1>
        <p className="text-md mt-6 text-fg-muted md:text-lg lg:text-xl">
          Copy the code, paste it, customize it, own it. Done.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <LinkButton href="/docs" type="primary" size="lg">
            Read the docs
          </LinkButton>
          <SearchDocs className="w-auto" size="lg" />
        </div>
      </div>
      <div className="hidden px-10 lg:block xl:px-20">
        <Animation />
      </div>
    </section>
  );
};
