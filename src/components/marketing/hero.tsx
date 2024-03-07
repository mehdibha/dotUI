"use client";

import React from "react";
import { ArrowRightIcon, SearchIcon, SparklesIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/classes";

export const Hero = () => {
  return (
    <section className="bg-dot-black px-32 pt-14">
      <div className="animate-element-in opacity-0 delay-200">
        <Badge
          size="md"
          variant="outline"
          className="cursor-pointer space-x-2 font-mono delay-75 duration-200 hover:bg-secondary"
        >
          <SparklesIcon size={18} />
          <span>Star us on GitHub</span> <ArrowRightIcon size={15} />
        </Badge>
      </div>
      <h1
        className={cn(
          "font-display mt-4 text-5xl font-bold leading-tight",
          "animate-element-in opacity-0 delay-300 duration-700"
        )}
      >
        Copy and paste <span className="text-primary">components</span>
        <br />
        for you React App
      </h1>
      <h2
        className={cn(
          "text-md mt-6 text-muted-foreground md:text-lg lg:text-xl",
          "animate-element-in opacity-0 delay-400 duration-700"
        )}
      >
        Copy the code, paste it, customize it, own it. Done.
      </h2>
      <div className="mt-10 flex animate-element-in space-x-4 opacity-0 delay-500 duration-700">
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
};
