import { Brands } from "@/components/marketing/brands";
import { CallToAction } from "@/components/marketing/cta";
import { Explore } from "@/components/marketing/explore";
import { Hero } from "@/components/marketing/hero";
import { CodeBlock } from "@/lib/components/core/default/code-block";

const code = `function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}`;

export default function HomePage() {
  return (
    <main className="container pb-36 pt-16">
      <Hero />
      <Brands className="mt-24" />
      <Explore className="mx-auto mt-24 max-w-6xl" />
      <CallToAction className="mt-40" />
    </main>
  );
}
