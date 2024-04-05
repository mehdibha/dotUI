import React from "react";
import { cn } from "@/lib/utils/classes";
import { FramerLogo } from "@/assets/images/brands/framer";
import { NextjsLogo } from "@/assets/images/brands/nextjs";
import { ReactIcon } from "@/assets/images/brands/reactjs";
import { ShadcnLogo } from "@/assets/images/brands/shadcn";
import { TailwindLogo } from "@/assets/images/brands/tailwind";
import { UseHooksLogo } from "@/assets/images/brands/usehooks";

export const Brands = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-4 sm:gap-8 ",
        className
      )}
    >
      <TailwindLogo className="h-4 fill-muted-foreground md:h-6" />
      <ReactIcon className="h-4 fill-muted-foreground md:h-6" />
      <NextjsLogo className="h-4 fill-muted-foreground md:h-6" />
      <FramerLogo className="h-4 fill-muted-foreground md:h-6" />
      <ShadcnLogo className="h-4 fill-muted-foreground md:h-6" />
      <UseHooksLogo className="h-4 fill-muted-foreground md:h-6" />
    </div>
  );
};
