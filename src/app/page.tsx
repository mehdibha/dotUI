import { Brands } from "@/components/marketing/brands";
import { CallToAction } from "@/components/marketing/cta";
import { Explore } from "@/components/marketing/explore";
import { Features } from "@/components/marketing/features";
import { Hero } from "@/components/marketing/hero";

export default function HomePage() {
  return (
    <main className="container pb-36 pt-16">
      <Hero />
      <Brands className="mt-24 lg:mt-16" />
      {/* <Features className="mt-24" /> */}
      <Explore className="mt-24" />
      <CallToAction className="mt-40" />
    </main>
  );
}
