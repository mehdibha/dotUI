import React from "react";
import { ArrowRightIcon, SearchIcon, SparklesIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section className="pt-14">
      <Badge
        size="md"
        variant="outline"
        className="cursor-pointer space-x-2 font-mono delay-75 duration-200 hover:bg-secondary"
      >
        <SparklesIcon size={18} />
        <span>Star us on GitHub</span> <ArrowRightIcon size={15} />
      </Badge>
      <h1 className="font-display mt-4 text-5xl font-bold leading-tight">
        Copy and paste <span className="text-primary">components</span>
        <br />
        for you React App
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
};
