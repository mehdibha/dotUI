import { FacebookIcon, GithubIcon, MailIcon } from "lucide-react";

export const siteConfig = {
  global: {
    url: "https://rCopy.com",
    name: "rCopy",
    logo: "/images/logo.png",
    title: "rCopy - You AI compagnion",
    description: "",
    keywords: [],
    authors: [
      {
        name: "mehdibha",
        url: "https://www.mehdibha.com",
      },
    ],
    creator: "mehdibha",
    thumbnail: "/images/thumbnail.jpg",
    twitter: {
      creator: "@mehdibha_",
    },
    externalLinks: [
      { icon: FacebookIcon, url: "https://www.facebook.com/groups/160143328137207" },
      { icon: MailIcon, url: "mailto:hello@mehdibha.com" },
      { icon: GithubIcon, url: "https://github.com/mehdibha/vapi.tn" },
    ],
  },
  header: {
    nav: {
      links: [
        { href: "/templates", label: "Templates" },
        { href: "/pages", label: "Pages" },
        { href: "/components", label: "Components" },
        { href: "/hooks", label: "Hooks" },
        { href: "/icons", label: "Icons" },
      ],
    },
    cta: {
      primary: {
        label: "Get started",
        href: "#",
      },
      // secondary: {
      //   label: "Sign in",
      //   href: "/login",
      // },
    },
  },
  homePage: {
    hero: {
      headline: "Copy and paste **components** for your react app.",
      subheadline: "",
      cta: [
        { label: "Go to playground", href: "/playground" },
        { label: "Star on GitHub", href: "https://github.com/mehdibha/vapi" },
      ],
    },
    features: {
      headline: "supported libraries",
      features: [
        {
          title: "MUI",
          description: "Discover our theme previewer for MUI",
          image: "https://mui.com/static/logo.svg",
          cta: {
            label: "Go to playground",
            href: "/playground?library=mui",
          },
          soon: true,
        },
        {
          title: "shadcn-ui",
          description: "Discover our theme previewer for shadcn",
          image: "/images/shadcn.svg",
          cta: {
            label: "Go to playground",
            href: "/playground?library=shadcn",
          },
        },
      ],
    },
    cta: {
      headline: "Proudly open-source",
      subheadline: "rCopy is open source and available on GitHub",
      cta: {
        label: "Star on GitHub",
        href: "https://github.com/mehdibha/rcopy",
      },
    },
  },
  pricingPage: {
    headline: "Simple pricing.",
    subheadline:
      "Use vapi for free. Upgrade to enable custom domains and more advanced features.",
    pricingPlans: [
      {
        name: "Free",
        price: { monthly: "$0", yearly: "$0" },
        description: "Good for getting started.",
        href: "#",
        features: [
          "Free hosting on 'vapi.co'",
          "Optimized SEO",
          "Has 'Built with vapi' branding",
        ],
      },
      {
        featured: true,
        name: "Pro",
        price: { monthly: "$19", yearly: "$15" },
        billing: "per month",
        description: "Perfect for small / medium sized businesses.",
        href: "#",
        features: [
          "Everything in Free.",
          "Basic analytics",
          "Remove 'Built with vapi' branding",
        ],
      },
      {
        name: "Entreprise",
        price: { monthly: "$39", yearly: "$31" },
        billing: "per month",
        description: "For even the biggest enterprise companies.",
        href: "#",
        features: [
          "Everything in Personal site.",
          "Advanced analytics",
          "Priority support",
        ],
      },
    ],
    faq: [
      {
        question: "How does vapi works?",
        answer:
          "vapi is a monorepo starter that comes with Next.js, Tailwind CSS, Shadcn-ui, Server components, and more. It's a great way to start your next project.",
      },
      {
        question: "How do I create a website with vapi?",
        answer: "You can create a website with vapi by following the documentation.",
      },
      {
        question: "How much does vapi cost?",
        answer: "It's free to use vapi",
      },
      {
        question: "Can I use vapi for free?",
        answer: "Yes, you can use vapi for free.",
      },
    ],
    cta: {
      headline: "Proudly **open-source**",
      subheadline: "vapi is open source and available on GitHub",
      cta: { label: "Star on GitHub", href: "https://github.com/mehdibha/vapi" },
    },
  },
  blogPage: {
    headline: "Blog",
    subheadline: "Learn more about vapi and write your posts with MDX.",
  },
};
