import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/classes";
import { siteConfig } from "@/config";

const headline = siteConfig.homePage.cta.headline;
const subheadline = siteConfig.homePage.cta.subheadline;
const cta = siteConfig.homePage.cta.cta;

interface CallToActionProps {
  logo?: boolean;
  className?: string;
}

export const CallToAction = (props: CallToActionProps) => {
  const { logo = true, className } = props;
  return (
    <section className={cn("px-6 text-center", className)}>
      {logo && (
        <Image
          src={siteConfig.global.logo}
          alt={siteConfig.global.name}
          loading="lazy"
          width={80}
          height={80}
          className="mx-auto mb-12 h-[60px] object-contain"
        />
      )}
      <h2 className="mx-auto max-w-2xl text-5xl font-bold leading-[75px]">{headline}</h2>
      <p className="mt-2 text-lg text-muted-foreground">{subheadline}</p>
      <Button variant="default" size="lg" className="mt-12">
        {cta.label}
      </Button>
    </section>
  );
};
