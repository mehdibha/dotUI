import React from "react";
import Link from "next/link";
import { ArrowRightIcon, SearchIcon, SparklesIcon } from "lucide-react";
import { badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/classes";

export default function Demo() {
  return (
    <section>
      <Link
        href="https://github.com/mehdibha/rcopy"
        target="_blank"
        className={cn(
          badgeVariants({ variant: "outline", size: "md" }),
          "cursor-pointer space-x-2 font-mono delay-75 duration-200 hover:bg-secondary"
        )}
      >
        <SparklesIcon size={18} />
        <span>Star us on GitHub</span> <ArrowRightIcon size={15} />
      </Link>
      <h1 className="font-display mt-4 max-w-2xl text-5xl font-bold leading-tight">
        Copy and paste components for you React App
      </h1>
      <h2 className="text-md mt-6 text-muted-foreground md:text-lg lg:text-xl">
        Copy the code, paste it, customize it, own it. Done.
      </h2>
      <div className="mt-10 flex space-x-4">
        <Button size="lg" variant="default">
          Explore components
        </Button>
        <Button size="lg" variant="outline">
          <SearchIcon size={20} className="mr-2" />
          Quick search
        </Button>
      </div>
    </section>
  );
}
