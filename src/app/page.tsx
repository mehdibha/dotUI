import { Brands } from "@/components/marketing/brands";
import { CallToAction } from "@/components/marketing/cta";
import { Features } from "@/components/marketing/features";
import { Hero } from "@/components/marketing/hero";

export default function HomePage() {
  return (
    <main className="container pb-36 pt-24">
      <Hero />
      <Brands className="mt-24" />
      <Features className="mt-32" />
      <CallToAction className="mt-40" />
    </main>
  );
}
