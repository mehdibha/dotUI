import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/classes";
import { siteConfig } from "@/config";

interface CallToActionProps {
  logo?: boolean;
  className?: string;
}

export const CallToAction = (props: CallToActionProps) => {
  const { className } = props;
  return (
    <section className={cn("px-6 text-center", className)}>
      <Link
        href="/"
        className={cn(
          "inline-flex items-center space-x-3 transition-all duration-300 hover:opacity-80"
        )}
        suppressHydrationWarning
      >
        <Image
          src={siteConfig.global.logo}
          alt={siteConfig.global.name}
          loading="lazy"
          width={60}
          height={60}
        />
      </Link>
      <h2 className="mx-auto max-w-2xl text-5xl font-bold leading-[75px]">
        Proudly open-source
      </h2>
      <p className="mt-2 text-lg text-muted-foreground">subheadline</p>
      <Button variant="default" size="lg" className="mt-12">
        Star on GitHub
      </Button>
    </section>
  );
};
