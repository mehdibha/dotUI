import React from "react";
import { CallToAction } from "@/components/marketing/cta";
import { Hero } from "@/components/marketing/hero";

export default function HomePage() {
  return (
    <main>
      <Hero/>
      <CallToAction logo={false} className="mt-40" />
    </main>
  );
}
