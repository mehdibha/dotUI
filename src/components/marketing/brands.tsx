import React from "react";
import { cn } from "@/utils/classes";
import { FramerLogo } from "@/assets/images/brands/framer";
import { NextjsLogo } from "@/assets/images/brands/nextjs";
import { ShadcnLogo } from "@/assets/images/brands/shadcn";
import { TailwindLogo } from "@/assets/images/brands/tailwind";
import { UseHooksLogo } from "@/assets/images/brands/usehooks";

export const Brands = ({ className }: { className?: string }) => {
  return (
    <div>
      <h2
        className={cn(
          "text-center text-lg font-semibold text-muted-foreground/70",
          className
        )}
      >
        We use the latest technologies.
      </h2>
      <div className="mt-4 flex items-center justify-center space-x-8">
        <TailwindLogo height={30} className="fill-muted-foreground" />
        <NextjsLogo height={25} className="fill-muted-foreground" />
        {/* <span className="font-display font-bold tracking-tighter">Framer Motion</span> */}
        <div className="flex items-center space-x-3">
          <FramerLogo height={30} className="fill-muted-foreground" />
          <span className="font-display text-2xl font-bold tracking-tighter text-muted-foreground">
            Motion
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <ShadcnLogo height={30} className="fill-muted-foreground" />
          <span className="font-sans text-3xl font-bold text-muted-foreground">
            shadcn/ui
          </span>
        </div>
        <UseHooksLogo height={25} className="fill-muted-foreground" />
      </div>
    </div>
  );
};
