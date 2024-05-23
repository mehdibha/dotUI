import React from "react";
import { CallToAction } from "./cta";
import { FAQ } from "./faq";
import { PricingComparaison } from "./pricing-comparaison";
import type { Plan } from "./types";

const headline = "Simple pricing";
const subheadline = "Use rCopy for free. Upgrade to enable to access premium templates.";
const pricingPlans: Plan[] = [
  {
    name: "Free",
    description: "Use rCopy for free",
    featured: false,
    price: {
      monthly: "$0",
      yearly: "$0",
    },
    features: [
      "Free hosting on 'turbocharger.cc'",
      "Optimized SEO",
      "Has 'Built with Turbocharger' branding",
    ],
    cta: {
      label: "Get started",
      href: "#",
    },
  },
  {
    name: "Pro",
    featured: true,
    price: { monthly: "$19", yearly: "$190" },
    description: "Perfect for small / medium sized businesses.",
    features: [
      "Everything in Free.",
      "Basic analytics",
      "Remove 'Built with Turbocharger' branding",
    ],
    cta: {
      label: "Get started",
      href: "#",
    },
  },
  {
    name: "Entreprise",
    price: { monthly: "$39", yearly: "$390" },
    description: "For even the biggest enterprise companies.",
    featured: false,
    features: ["Everything in Personal site.", "Advanced analytics", "Priority support"],
    cta: {
      label: "Get started",
      href: "#",
    },
  },
];
const questions = [
  {
    question: "How does turbocharger works?",
    answer:
      "Turbocharger is a monorepo starter that comes with Next.js, Tailwind CSS, Shadcn-ui, Server components, and more. It's a great way to start your next project.",
  },
  {
    question: "How do I create a website with turbocharger?",
    answer: "You can create a website with turbocharger by following the documentation.",
  },
  {
    question: "How much does turbocharger cost?",
    answer: "It's free to use turbocharger",
  },
  {
    question: "Can I use turbocharger for free?",
    answer: "Yes, you can use turbocharger for free.",
  },
];
const cta = {
  headline: "Get started today",
  subheadline: "Start creating your own react project today.",
  cta: {
    label: "Get started",
    href: "#",
  },
};

export default function PricingPage() {
  return (
    <div className="container py-24">
      <h2 className="text-center font-display text-5xl font-bold tracking-tight">
        {headline}
      </h2>
      <p className="mt-2 text-center text-lg text-fg-muted">{subheadline}</p>
      <PricingComparaison plans={pricingPlans} className="mt-8" />
      <FAQ questions={questions} className="mt-32" />
      <CallToAction
        headline={cta.headline}
        subheadline={cta.subheadline}
        cta={cta.cta}
        className="mt-32"
      />
    </div>
  );
}
