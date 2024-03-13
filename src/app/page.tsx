import React from "react";
import { Brands } from "@/components/marketing/brands";
import { CallToAction } from "@/components/marketing/cta";
import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";

export default function HomePage() {
  return (
    <main className="py-14">
      <Hero />
      <Brands className="mt-24"/>
      <Features className="mt-24"/>
      <CallToAction className="mt-40" />
    </main>
  );
}
