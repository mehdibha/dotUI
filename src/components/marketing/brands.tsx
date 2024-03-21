import React from "react";
import { cn } from "@/utils/classes";
import { FramerLogo } from "@/assets/images/brands/framer";
import { NextjsLogo } from "@/assets/images/brands/nextjs";
import { ShadcnLogo } from "@/assets/images/brands/shadcn";
import { TailwindLogo } from "@/assets/images/brands/tailwind";
import { UseHooksLogo } from "@/assets/images/brands/usehooks";

export const Brands = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-8 ", className)}>
      <TailwindLogo className="h-6 fill-muted-foreground md:h-8" />
      <NextjsLogo className="h-5 fill-muted-foreground md:h-7" />
      <div className="flex items-center space-x-3">
        <FramerLogo className="h-6 fill-muted-foreground md:h-8" />
        <span className="font-display text-2xl font-bold tracking-tighter text-muted-foreground">
          Motion
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <ShadcnLogo className="h-6 fill-muted-foreground md:h-8" />
        <span className="font-sans text-3xl font-bold text-muted-foreground">
          shadcn/ui
        </span>
      </div>
      <UseHooksLogo className="h-5 fill-muted-foreground md:h-7" />
    </div>
  );
};
