import React from "react";
import { LayoutTemplateIcon } from "lucide-react";
import { Button } from "@/components/core/button";
import { ThemesOverview } from "@/modules/themes/components/themes-overview";

export default function HomePage() {
  return (
    <div>
      {/* Hero section */}
      <div className="container">
        <section className="max-w-3xl pb-28 pt-8 sm:pt-24">
          <Button
            prefix={<LayoutTemplateIcon />}
            variant="outline"
            className="bg-bg-inverse/5 text-fg-muted mb-3 h-7 rounded-lg text-xs [&_svvg]:size-4"
          >
            Introducing themes
          </Button>
          <h1 className="text-balance text-3xl tracking-tighter max-lg:font-medium sm:text-4xl md:text-5xl lg:text-6xl">
            Quickly build your component library with a{" "}
            <span className="font-bold italic">unique</span> look.
          </h1>
          <p className="text-fg-muted text-balace mt-4 text-lg">
            Over 40 components available in multiple variants ready to match
            your brand identity.
          </p>
          <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <Button
              href="/docs/getting-started/introduction"
              variant="primary"
              size="lg"
              className="h-11 px-8"
            >
              Get started
            </Button>
            <Button
              href="/themes"
              variant="outline"
              size="lg"
              className="bg-bg-inverse/5 h-11 px-8"
            >
              Explore themes
            </Button>
          </div>
        </section>
      </div>
      {/* Components overview */}
      <section>
        <ThemesOverview />
      </section>
    </div>
  );
}
