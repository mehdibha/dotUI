/* The shadcn registry directory, mirrored for the internal browser at
   /internal/registries. Source: ui.shadcn.com/r/registries.json (264 entries,
   identical to shadcn-ui/ui apps/v4/registry/directory.json), fetched
   2026-08-01. */

export type Category =
  | "3d"
  | "ai"
  | "animations"
  | "blocks"
  | "charts"
  | "components"
  | "editor"
  | "forms"
  | "icons"
  | "maps"
  | "media"
  | "product-sdk"
  | "specialty"
  | "theming"
  | "utilities"

export type Framework =
  | "angular"
  | "other"
  | "react"
  | "solid"
  | "svelte"
  | "vue"
export type BaseLayer =
  | "base-ui"
  | "none"
  | "radix"
  | "react-aria"
  | "shadcn"
  | "unknown"
export type Pricing = "free" | "freemium" | "paid" | "unknown"
export type StyleTag =
  | "accessibility"
  | "brutalism"
  | "clay"
  | "dashboard"
  | "glass"
  | "gsap"
  | "marketing"
  | "minimal"
  | "mobile"
  | "open-source"
  | "playful"
  | "retro"
  | "tailwind-v4"
  | "terminal"
  | "web3"

export interface Registry {
  /** Namespace without the `@` — install as `npx shadcn add @<name>/<item>`. */
  name: string
  homepage: string
  /** One clause, ours. */
  summary: string
  /** The registry's own directory description. */
  description: string
  category: Category
  frameworks: Framework[]
  base: BaseLayer
  pricing: Pricing
  tags: StyleTag[]
}

export const registries: Registry[] = [
  {
    name: "1st-pouf",
    homepage: "https://1st-pouf.worksonmy.dev",
    summary: "Puffy pastel claymorphism components and app blocks",
    description:
      "Puffy, pastel claymorphism components and app blocks for React, built with Tailwind CSS v4 and Radix UI.",
    category: "components",
    frameworks: ["react"],
    base: "radix",
    pricing: "unknown",
    tags: ["clay", "playful", "tailwind-v4"],
  },
  {
    name: "7ovr",
    homepage: "https://7ovr.com",
    summary: "Free UI blocks for marketing pages and app dashboards",
    description:
      "Free, production-ready UI blocks for marketing pages and application dashboards, built on Base UI and installable with the shadcn CLI.",
    category: "blocks",
    frameworks: ["react"],
    base: "base-ui",
    pricing: "free",
    tags: ["marketing", "dashboard"],
  },
  {
    name: "8bitcn",
    homepage: "https://www.8bitcn.com",
    summary: "8-bit styled retro components, open source and open code",
    description:
      "A set of 8-bit styled retro components. Works with your favorite frameworks. Open Source. Open Code.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "free",
    tags: ["retro", "open-source", "playful"],
  },
  {
    name: "8starlabs-ui",
    homepage: "https://ui.8starlabs.com",
    summary: "Niche, high-utility UI elements missing from standard libraries",
    description:
      "A set of beautifully designed components designed for developers who want niche, high-utility UI elements that you won't find in standard libraries.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "abstract",
    homepage: "https://build.abs.xyz",
    summary: "React components for common crypto and wallet patterns",
    description:
      "A collection of React components for the most common crypto patterns",
    category: "specialty",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: ["web3"],
  },
  {
    name: "abui",
    homepage: "https://abui.io",
    summary:
      "Reusable components, blocks and utilities on components.build spec",
    description:
      "A shadcn-compatible registry of reusable components, blocks, and utilities conforming to Vercel's components.build specification",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "aceternity",
    homepage: "https://ui.aceternity.com",
    summary: "Interactive Tailwind and Motion components for landing pages",
    description:
      "A modern component library built with Tailwind CSS and Motion for React, Aceternity UI contains unique and interactive components that can make your landing pages look 100x better.",
    category: "animations",
    frameworks: ["react"],
    base: "unknown",
    pricing: "freemium",
    tags: ["marketing", "playful"],
  },
  {
    name: "aevr",
    homepage: "https://ui.aevr.space",
    summary: "Small set of focused production-ready components and primitives",
    description:
      "A small collection of focused, production‑ready components and primitives for React/Next.js projects—built on shadcn/ui and complementary libraries.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "agentcn",
    homepage: "https://agentcn.vercel.app",
    summary: "Customizable AI agent recipes built on Eve and Flue",
    description:
      "Production-ready agents, made simple. Ready to use, customizable AI agent recipes. Built on Eve and Flue.",
    category: "ai",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "agents-ui",
    homepage: "https://livekit.com/ui",
    summary: "Copy-paste React components for LiveKit AI agent interfaces",
    description:
      "This is a shadcn/ui component registry that distributes copy-paste React components for building LiveKit AI Agent interfaces.",
    category: "ai",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "ai-blocks",
    homepage: "https://webllm.org/blocks",
    summary: "Browser-native AI components on WebLLM, no server or API keys",
    description:
      "AI components for the web. No server. No API keys. Built on WebLLM.",
    category: "ai",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "ai-elements",
    homepage: "https://ai-sdk.dev/elements",
    summary: "Conversation, message and chat primitives for AI SDK apps",
    description:
      "Pre-built components like conversations, messages and more to help you build AI-native applications faster.",
    category: "ai",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "aicanvas",
    homepage: "https://aicanvas.me",
    summary: "54 animated React components with AI reproduction prompts",
    description:
      "54 animated React components with AI reproduction prompts for Claude Code, Lovable, and v0. Free and open source.",
    category: "animations",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["open-source", "playful"],
  },
  {
    name: "algolia",
    homepage: "https://sitesearch.algolia.com",
    summary: "Drop-in site search and Ask AI UI for Algolia's search platform",
    description:
      "Enterprises and developers use Algolia's AI search infrastructure to understand users and show them what they're looking for.",
    category: "product-sdk",
    frameworks: ["react"],
    base: "unknown",
    pricing: "freemium",
    tags: [],
  },
  {
    name: "aliimam",
    homepage: "https://aliimam.in",
    summary: "Personal design-engineering registry of app and website pieces",
    description:
      "I create digital experiences that connect and inspire. I build apps, websites, brands, and products end-to-end.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "amicro",
    homepage: "https://amicro.vercel.app",
    summary: "Open-source React micro-interactions powered by Motion",
    description:
      "Open-source React micro-interactions and UI component registry powered by Motion.",
    category: "animations",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "amplo",
    homepage: "https://amplo.ale.design",
    summary:
      "OKLCH-native color and fill picker with WCAG/APCA contrast metrics",
    description:
      "OKLCH-native, Display-P3-aware composable fill picker with WCAG/APCA contrast metrics, gamut detection, and full keyboard accessibility.",
    category: "theming",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["accessibility", "open-source"],
  },
  {
    name: "animate-ui",
    homepage: "https://animate-ui.com",
    summary: "Animated primitives, components and icons you can install",
    description:
      "A fully animated, open-source React component distribution. Browse a list of animated primitives, components and icons you can install and use in your projects.",
    category: "animations",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "animbits",
    homepage: "https://animbits.dev",
    summary: "Understated Framer Motion components, hooks and page transitions",
    description:
      "AnimBits is a collection animated UI components for React that use Framer Motion. The components provided include buttons, cards, text, icons, lists, loaders, and page transitions, animation hooks all of which have general-purpose effects that are not flashy and easy on the eyes, making them easy to use.",
    category: "animations",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: ["minimal"],
  },
  {
    name: "approvals-ui",
    homepage: "https://approvals-ui.vercel.app",
    summary: "React Flow approval-workflow gates, thresholds and policy lint",
    description:
      "Approval workflow components for React Flow: quorum gates, amount thresholds, a policy lint (segregation of duties, single approver on high value), and plain-language editing behind a human review gate.",
    category: "specialty",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "arc",
    homepage: "https://witharc.co/components",
    summary: "Animated, accessible React and Tailwind CSS components",
    description:
      "Animated, accessible UI components built with React and Tailwind CSS.",
    category: "animations",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: ["accessibility"],
  },
  {
    name: "asanshay",
    homepage: "https://ds.asanshay.com",
    summary: "Clean, simple UI primitives plus AI elements",
    description: "Clean, beautiful, and simple UI primitives and AI elements.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: ["minimal"],
  },
  {
    name: "assistant-ui",
    homepage: "https://www.assistant-ui.com",
    summary: "React chat primitives with AI SDK, LangGraph and Mastra adapters",
    description:
      "Radix-style React primitives for AI chat with adapters for AI SDK, LangGraph, Mastra, and custom backends.",
    category: "ai",
    frameworks: ["react"],
    base: "radix",
    pricing: "freemium",
    tags: ["open-source"],
  },
  {
    name: "auth0",
    homepage: "https://auth0.com",
    summary: "Official Auth0 embeddable UI for SSO, MFA and org management",
    description:
      "Official Auth0 Universal Components for Web. Accelerate development with pre-built, embeddable UI for enterprise SSO, MFA, and organization management",
    category: "product-sdk",
    frameworks: ["react"],
    base: "unknown",
    pricing: "freemium",
    tags: [],
  },
  {
    name: "baraile-loader",
    homepage: "https://shadcn-braille-loader.vercel.app",
    summary: "Braille-inspired loader components for shadcn/ui",
    description: "A simple braille-inspired loader components for shadcn/ui.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: ["minimal"],
  },
  {
    name: "basecn",
    homepage: "https://basecn.dev",
    summary: "shadcn/ui-style components rebuilt on Base UI",
    description: "Beautifully crafted shadcn/ui components powered by Base UI",
    category: "components",
    frameworks: ["react"],
    base: "base-ui",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "baselayer",
    homepage: "https://www.baselayer.dev",
    summary: "React Aria components styled with Tailwind and tailwind-variants",
    description:
      "A collection of components built on React Aria, Tailwind CSS, and tailwind-variants.",
    category: "components",
    frameworks: ["react"],
    base: "react-aria",
    pricing: "unknown",
    tags: ["accessibility"],
  },
  {
    name: "beste-ui",
    homepage: "https://ui.beste.co",
    summary: "Production-ready blocks for landing pages, dashboards and apps",
    description:
      "Production-ready UI blocks for landing pages, dashboards, and web apps.",
    category: "blocks",
    frameworks: ["react"],
    base: "unknown",
    pricing: "freemium",
    tags: ["marketing", "dashboard"],
  },
  {
    name: "better-upload",
    homepage: "https://better-upload.com",
    summary:
      "React file upload components posting direct to S3-compatible storage",
    description:
      "Simple and easy file uploads for React. Upload directly to any S3-compatible service with minimal setup.",
    category: "media",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "beui",
    homepage: "https://beui.dev",
    summary: "Bespoke Motion components with shadcn-compatible installs",
    description:
      "Bespoke motion components for React. Copy-paste components with shadcn-compatible installs, Tailwind CSS v4, and Motion.",
    category: "animations",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["tailwind-v4", "open-source"],
  },
  {
    name: "billingsdk",
    homepage: "https://billingsdk.com",
    summary:
      "SaaS billing UI for subscriptions and invoices on Dodo and Stripe",
    description:
      "BillingSDK is an open-source React and Next.js component library for SaaS billing and payments. It offers ready-to-use, customizable components for subscriptions, invoices, usage-based pricing and billing - fully compatible with Dodo Payments and Stripe.",
    category: "product-sdk",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "bklit",
    homepage: "https://ui.bklit.com",
    summary: "Composable Visx and Motion chart components including maps",
    description:
      "Open-source composable chart components for React — line, area, bar, pie, radar, maps, and more. Built with Visx, Motion, and shadcn/ui.",
    category: "charts",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "free",
    tags: ["open-source", "dashboard"],
  },
  {
    name: "blocks-so",
    homepage: "https://blocks.so",
    summary: "Clean, modern application building blocks, free and open source",
    description:
      "A set of clean, modern application building blocks for you in your applications. Free and Open Source",
    category: "blocks",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["open-source", "dashboard", "minimal"],
  },
  {
    name: "blockus",
    homepage: "https://blockus.lndevui.com",
    summary:
      "Hand-crafted page sections — heroes, pricing, footers — on shadcn/ui and Tailwind",
    description:
      "Production-ready React blocks built on shadcn/ui and Tailwind — drop them in, swap the copy, ship the page. Heroes, pricing and footer sections crafted by hand.",
    category: "blocks",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: ["marketing"],
  },
  {
    name: "boldkit",
    homepage: "https://boldkit.dev",
    summary:
      "43 neubrutalist components plus 42 SVG shapes, thick borders and hard shadows",
    description:
      "Neubrutalism component library with 43 components, 42 SVG shapes, thick borders, and hard shadows. Supports React, Vue, and Nuxt. Built on shadcn/ui.",
    category: "components",
    frameworks: ["react", "vue"],
    base: "shadcn",
    pricing: "free",
    tags: ["brutalism", "open-source"],
  },
  {
    name: "brainless",
    homepage: "https://brainless.swerdlow.dev",
    summary:
      "Claude Code, Codex and Grok terminal-agent interfaces as shadcn components",
    description:
      "Claude Code, Codex, and Grok interfaces as shadcn components — accessible React terminal-agent UI for docs, demos, and product surfaces.",
    category: "ai",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: ["terminal"],
  },
  {
    name: "bundui",
    homepage: "https://bundui.io",
    summary:
      "150+ components spanning marketing, e-commerce, dashboards and real-estate UIs",
    description:
      "A collection of 150+ handcrafted UI components built with Tailwind CSS and shadcn/ui, covering marketing, e-commerce, dashboards, real estate, and more.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "freemium",
    tags: ["marketing", "dashboard"],
  },
  {
    name: "canvas-ui",
    homepage: "https://canvasui.dev/",
    summary: "Creative html-in-canvas components for React, Vue and Svelte",
    description: "Creative html-in-canvas components. React, Vue, Svelte, TS.",
    category: "components",
    frameworks: ["react", "vue", "svelte"],
    base: "unknown",
    pricing: "free",
    tags: [],
  },
  {
    name: "cardcn",
    homepage: "https://cardcn.dev",
    summary: "A free set of beautifully designed shadcn card components",
    description: "A set of beautifully-designed shadcn card components",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "free",
    tags: [],
  },
  {
    name: "chamaac",
    homepage: "https://chamaac.com",
    summary: "Animated components for quickly adding motion to web projects",
    description:
      "A collection of beautiful, animated components to elevate your web projects instantly.",
    category: "animations",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "channel3",
    homepage: "https://trychannel3.com/developers/ui",
    summary:
      "Shopping UI for the Channel3 product API — search, filters, offers, price history",
    description:
      "Open-source React components for building shopping experiences on the Channel3 product API: search, filters, product detail, offer comparison, and price history.",
    category: "product-sdk",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "clerk",
    homepage: "https://clerk.com/docs/guides/development/shadcn-cli",
    summary:
      "Official Clerk auth registry — sign-in/sign-up pages, provider and middleware setup",
    description:
      "The easiest way to add authentication and user management to your application. Purpose-built for React, Next.js, Remix, and The Modern Web.",
    category: "product-sdk",
    frameworks: ["react"],
    base: "unknown",
    pricing: "freemium",
    tags: [],
  },
  {
    name: "cnippet",
    homepage: "https://ui.cnippet.dev/",
    summary:
      "Accessible, composable React components built on Base UI and Tailwind",
    description:
      "Cnippet UI is a production-ready, curated set of accessible and composable React components—built with Base UI and Tailwind CSS. Copy, paste, and ship stunning interfaces faster.",
    category: "components",
    frameworks: ["react"],
    base: "base-ui",
    pricing: "unknown",
    tags: ["accessibility"],
  },
  {
    name: "cognicatch",
    homepage: "https://cognicatch.dev",
    summary:
      "Adaptive error boundaries with banner, modal and toast fallback UIs",
    description:
      "Adaptive Error Boundaries and graceful fallback UIs (Banners, Modals, Toasts).",
    category: "utilities",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "commercn",
    homepage: "https://commercn.com",
    summary: "shadcn UI blocks for building e-commerce websites",
    description: "Shadcn UI Blocks for Ecommerce websites",
    category: "blocks",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "componentry",
    homepage: "https://componentry.fun",
    summary: "Interactive React and Tailwind components for modern product UIs",
    description:
      "Beautiful, interactive React + Tailwind components for modern product UIs.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "contentbit",
    homepage: "https://contentbit.dev",
    summary:
      "Renders Markdown content blocks with schema-validated directives for CMS and LLM copy",
    description:
      "React components that render Content Blocks: plain Markdown with schema-validated directive blocks. Built for content written by humans, CMSes, and LLMs.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "corr",
    homepage: "https://ui.corr.sh",
    summary:
      "A personal grab-bag of shadcn components, charts, animated pieces and blocks",
    description:
      "A collection of shadcn-based React components, charts, animated components, and blocks built over time.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "coss",
    homepage: "https://coss.com/ui",
    summary:
      "Cal.com's official design system — a modern component library on Base UI",
    description:
      "A new, modern UI component library built on top of Base UI. Built for developers and AI.",
    category: "components",
    frameworks: ["react"],
    base: "base-ui",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "creative-tim",
    homepage: "https://www.creative-tim.com/ui",
    summary:
      "Open-source components, blocks and AI agents usable from v0, Lovable or Claude",
    description:
      "A collection of open-source UI components, blocks and AI Agents. Integrate them in v0, Lovable, Claude or in your application.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "freemium",
    tags: ["dashboard", "marketing"],
  },
  {
    name: "cubby-ui",
    homepage: "https://www.cubby-ui.dev",
    summary:
      "Opinionated component library on Base UI and Tailwind v4 with curated styling",
    description:
      "An opinionated component library with curated styling and simplified patterns for common use cases. Built on Base UI and Tailwind CSS 4.",
    category: "components",
    frameworks: ["react"],
    base: "base-ui",
    pricing: "free",
    tags: ["tailwind-v4", "open-source"],
  },
  {
    name: "cult-ui",
    homepage: "https://www.cult-ui.com",
    summary:
      "Curated shadcn-compatible headless components animated with Framer Motion",
    description:
      "Cult UI is a rare, curated set of shadcn-compatible, headless and composable components—tastefully animated with Framer Motion.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "darx",
    homepage: "https://darshitdev.in/arts",
    summary:
      "Magic 3D tabs with mouse-driven rotation, particles and spring motion",
    description:
      "Magic 3D Tabs component featuring mouse-interactive 3D rotation, floating particles background effect, and smooth spring animations.",
    category: "animations",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: ["playful"],
  },
  {
    name: "delego",
    homepage: "https://github.com/Delego-Dev/registry",
    summary:
      "Delego's design system for agent action authorization — OKLCH theme plus signature parts",
    description:
      "Design-system registry for Delego — intent-bound action authorization for AI agents. Theme (OKLCH) plus signature components: decision pill, signed receipt, status badge, field.",
    category: "product-sdk",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "delta",
    homepage: "https://deltacomponents.dev",
    summary:
      "AI and media-rich UI — streaming chat, zoomable images, card decks, maps, blocks",
    description:
      "A shadcn registry for AI and media-rich interfaces — streaming LLM chat, zoomable images, swipeable card decks, interactive maps, plus dashboard and landing-page blocks.",
    category: "ai",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "devl",
    homepage: "https://devl.dev",
    summary:
      "Hand-crafted layouts and UI primitives from a designer's long-running experiments",
    description: "Hand-crafted layouts and UI primitives for shipping fast.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "diceui",
    homepage: "https://www.diceui.com/",
    summary:
      "Accessible copy-paste shadcn components in React, TypeScript and Tailwind",
    description:
      "Accessible shadcn/ui components built with React, TypeScript, and Tailwind CSS. Copy-paste ready, and customizable.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: ["accessibility"],
  },
  {
    name: "diklein",
    homepage: "https://diklein.com",
    summary:
      "Design-forward React components extracted from a designer's personal site",
    description:
      "A growing collection of design-forward React components by Dave Klein, extracted from the components powering diklein.com.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "dominik-ui",
    homepage: "https://dominikkoch.dev/ui",
    summary:
      "Opinionated components and tools for building modern AI interfaces",
    description:
      "Opinionated components and tools for building modern AI interfaces.",
    category: "ai",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "doras-ui",
    homepage: "https://ui.doras.to/",
    summary: "Reusable component blocks built with React",
    description:
      "A collection of beautiful, reusable component blocks built with React",
    category: "blocks",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "dotmatrix",
    homepage: "https://dotmatrix.zzzzshawn.cloud",
    summary:
      "Dot-matrix loaders in square, circular and triangle variants with polished motion",
    description:
      "Production-ready dot-matrix loading components for React, featuring square, circular, and triangle animations with polished motion.",
    category: "animations",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "dsikeres1",
    homepage: "https://dsikeres1.github.io/react-date-range-picker/",
    summary:
      "Headless date and range picker — 5 picker types, 15 locales, zero dependencies",
    description:
      "A headless, composable date & date range picker for React. 5 picker types, 15 locales, dark mode, accessible. Zero dependencies.",
    category: "forms",
    frameworks: ["react"],
    base: "none",
    pricing: "unknown",
    tags: ["accessibility"],
  },
  {
    name: "efferd",
    homepage: "https://efferd.com/",
    summary:
      "Crafted shadcn blocks for modern sites, with paid Pro and Team licences",
    description:
      "A collection of beautifully crafted Shadcn/UI blocks, designed to help developers build modern websites with ease.",
    category: "blocks",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "freemium",
    tags: ["marketing"],
  },
  {
    name: "einui",
    homepage: "https://ui.eindev.ir",
    summary:
      "Responsive shadcn components with frosted glassmorphism and full dark mode",
    description:
      "Beautiful, responsive Shadcn components with frosted glass morphism. Built for modern web applications with full dark mode support.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "free",
    tags: ["glass", "open-source"],
  },
  {
    name: "eldoraui",
    homepage: "https://eldoraui.site",
    summary:
      "Open-source React component library built with TypeScript, Tailwind and Framer Motion",
    description:
      "An open-source, modern UI component library for React, built with TypeScript, Tailwind CSS, and Framer Motion. Eldora UI offers beautifully crafted, reusable components designed for performance and elegance.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "elements",
    homepage: "https://www.tryelements.dev",
    summary:
      "Full-stack shadcn components wiring in auth, monetization, uploads and AI",
    description:
      "Full-stack shadcn/ui components that go beyond UI. Add auth, monetization, uploads, and AI to your app in seconds.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: ["open-source"],
  },
  {
    name: "elevenlabs-ui",
    homepage: "https://ui.elevenlabs.io",
    summary:
      "Open-source agent and audio components from ElevenLabs, built on shadcn/ui",
    description:
      "A collection of Open Source agent and audio components that you can customize and extend.",
    category: "ai",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "emerald-ui",
    homepage: "https://emerald-ui.com",
    summary:
      "Motion- and GSAP-animated components layered on Tailwind and shadcn/ui",
    description:
      "Emerald UI - collection of components built with Motion, GSAP, Tailwind CSS and shadcn/ui.",
    category: "animations",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: ["gsap"],
  },
  {
    name: "ericts",
    homepage: "https://ui.ericts.com",
    summary: "Motion-focused shadcn-compatible components, hooks and blocks",
    description:
      "Motion-focused shadcn-compatible components, hooks, and blocks for polished React interfaces.",
    category: "animations",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "evex",
    homepage: "https://evex.sh",
    summary:
      "Installable AI agent recipes for Eve apps: PR review, data analysis, automation",
    description:
      "Installable AI agent recipes for Eve apps, including PR review, data analysis, and workflow automation agents.",
    category: "ai",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "evilbuttons",
    homepage: "https://evilbuttons.radiumcoders.com/docs",
    summary:
      "Animated button collection built with Motion for punchy interactive feedback",
    description:
      "A shadcn/ui registry featuring a collection of animated buttons built with Motion. Each component is designed to add punchy, interactive feedback to your UI with minimal setup.",
    category: "animations",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: ["playful"],
  },
  {
    name: "evilcharts",
    homepage: "https://evilcharts.com",
    summary:
      "Open-source handcrafted chart components built with shadcn and Recharts",
    description:
      "EvilCharts is an open-source chart UI website built with shadcn and Recharts, beautifully designed and handcrafted.",
    category: "charts",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "exabase",
    homepage: "https://exawizards.com/exabase/design/",
    summary:
      "React and Tailwind components implementing the exaBase design system",
    description:
      "A collection of UI components based on the exaBase Design System, built with React and Tailwind CSS.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "extend",
    homepage: "https://ui.extend.ai",
    summary: "UI for document agents and human-in-the-loop review workflows",
    description:
      "A collection of UI components for building document agents and human-in-the-loop review workflows.",
    category: "ai",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "fab-ui",
    homepage: "https://fab-ui.com",
    summary: "General-purpose designed UI components for modern web apps",
    description:
      "A collection of beautifully designed UI components for building modern web applications.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "flightcn",
    homepage: "https://flightcn.yencheng.dev",
    summary:
      "Flight-route map components with great-circle arcs and airport markers for mapcn",
    description:
      "Flight routes on interactive maps with great-circle arcs, airport markers, multi-leg journeys, and optional animation, built for mapcn.",
    category: "maps",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "flowui",
    homepage: "https://flowui-registry.vercel.app",
    summary:
      "Everyday React components layered on shadcn to speed up development",
    description:
      "Everyday use react components to make the development flow easier for the devs.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "flowkit-ui",
    homepage: "https://flowkit-ui.vzkiss.com",
    summary:
      "Opinionated accessible components on Base UI and shadcn-style primitives",
    description:
      "Opinionated, accessible components on Base UI and shadcn-style primitives — starting with a Creatable Combobox.",
    category: "components",
    frameworks: ["react"],
    base: "base-ui",
    pricing: "unknown",
    tags: ["accessibility"],
  },
  {
    name: "fluid",
    homepage: "https://www.fluidfunctionalism.com",
    summary:
      "Proximity hover, spring motion and animated focus-ring components",
    description:
      "Fluid components used exclusively in service of functional clarity. Proximity hover, spring animations, font-weight transitions, and animated focus rings.",
    category: "animations",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["open-source", "minimal"],
  },
  {
    name: "flx",
    homepage: "https://ui.flexnative.com",
    summary: "Customizable UI blocks with interactive live previews",
    description:
      "A collection of customizable UI blocks with interactive live previews",
    category: "blocks",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "fonttrio",
    homepage: "https://www.fonttrio.xyz",
    summary:
      "Curated heading/body/mono font trios with type scales installable via shadcn add",
    description:
      "Curated font pairing registry for shadcn. Three fonts. One command. Install perfectly configured typography (heading + body + mono) with shadcn add. Includes editorial-grade type scales, CSS variables, and a live preview site.",
    category: "theming",
    frameworks: ["react"],
    base: "none",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "forgeui",
    homepage: "https://forgeui.in/",
    summary:
      "Copy-paste accessible React components, open source and customizable",
    description:
      "Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["open-source", "accessibility"],
  },
  {
    name: "formcn",
    homepage: "https://formcn.dev",
    summary: "Click-to-build form generator producing shadcn form components",
    description:
      "Build production-ready forms with a few clicks using shadcn components and modern tools.",
    category: "forms",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "framecn",
    homepage: "https://framecn.vercel.app",
    summary: "Ready-to-use customizable video components for React",
    description:
      "Beautiful videos, made simple. Ready to use, customizable video components for React.",
    category: "media",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: [],
  },
  {
    name: "gaia",
    homepage: "https://ui.heygaia.io",
    summary:
      "Components for AI assistants and conversational interfaces from the GAIA team",
    description:
      "Production-ready UI components designed for building beautiful AI assistants and conversational interfaces, from the team behind GAIA.",
    category: "ai",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "gamekitui",
    homepage: "https://gamekitui.com",
    summary: "Drop-in themeable browser games like Snake, 2048 and Minesweeper",
    description:
      "Drop-in, themeable browser games for shadcn — Snake, 2048, Minesweeper, and more. Each is a single self-contained file with zero dependencies.",
    category: "specialty",
    frameworks: ["react"],
    base: "none",
    pricing: "unknown",
    tags: ["playful"],
  },
  {
    name: "gamifykit",
    homepage: "https://gamifykit.com",
    summary: "Composable gamification UI patterns extending shadcn/ui",
    description:
      "A collection of fully composable components that extend shadcn/ui with a focus on common gamification UI patterns.",
    category: "specialty",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: ["playful"],
  },
  {
    name: "gammaui",
    homepage: "https://www.gammaui.com",
    summary: "Landing page components built with React, Tailwind and Motion",
    description:
      "Beautifully designed landing page components built with React & Tailwind CSS & Motion.",
    category: "blocks",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: ["marketing"],
  },
  {
    name: "gc-solid",
    homepage: "https://binnodon.github.io/gc-solid-ui",
    summary:
      "SolidJS port of shadcn-ui with 57+ Kobalte-based typed components",
    description:
      "SolidJS port of shadcn-ui components built with Kobalte primitives. 57+ components with full TypeScript support and Vega theme.",
    category: "components",
    frameworks: ["solid"],
    base: "shadcn",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "glass-ui",
    homepage: "https://glass-ui.crenspire.com",
    summary:
      "40+ glassmorphic components with glow, shimmer and ripple effects",
    description:
      "A shadcn-ui compatible registry distributing 40+ glassmorphic React/TypeScript components with Apple-inspired design. Components include enhanced visual effects (glow, shimmer, ripple), theme support, and customizable glassmorphism styling.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: ["glass"],
  },
  {
    name: "glasscn",
    homepage: "https://glasscn-components.vercel.app/",
    summary: "MIT-licensed glassmorphism components inspired by Apple",
    description:
      "A shadcn-compatible registry of glassmorphism components inspired by Apple",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["glass", "open-source"],
  },
  {
    name: "gooseui",
    homepage: "https://gooseui.pro",
    summary:
      "Animated components, effects and custom toasts on Radix UI and Tailwind",
    description:
      "Open source component library with animated components, beautiful effects, and custom toast notifications. Built with Radix UI and Tailwind CSS.",
    category: "animations",
    frameworks: ["react"],
    base: "radix",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "gpt-vis",
    homepage: "https://gpt-vis.antv.vision",
    summary:
      "AI-native visualization rendering 26 chart types from LLM vis syntax",
    description:
      "AI-native visualization components for LLM projects. Render 26 chart types from vis syntax strings or config objects.",
    category: "charts",
    frameworks: ["react"],
    base: "none",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "gymnopedies",
    homepage: "https://gymnopedies.shoota.work",
    summary:
      "Dark serif read-only components for blogs, essays and long-form reading",
    description:
      "A dark, serif, glow-leaning shadcn registry of read-only components for blogs, essays, and long-form reading experiences — inspired by the quiet, candlelit cabaret of Erik Satie's Gymnopédies.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: ["minimal"],
  },
  {
    name: "grootstudio",
    homepage: "https://grootstudio.vercel.app",
    summary:
      "Open-source registry of SEO-friendly, high-performance React components",
    description:
      "A premium, open source component registry for SEO-friendly, high-performance React applications",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "ha-components",
    homepage: "https://hacomponents.keshuac.com",
    summary: "Customisable components for building Home Assistant dashboards",
    description:
      "A collection of customisable components to build Home Assistant dashboards.",
    category: "specialty",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["dashboard", "open-source"],
  },
  {
    name: "headcodecms",
    homepage: "https://headcodecms.com",
    summary: "Minimalistic web CMS for Next.js optimized for Cache Components",
    description:
      "A Minimalistic Web CMS for Next.js, optimized for Cache Components.",
    category: "editor",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: ["minimal"],
  },
  {
    name: "heroicons-animated",
    homepage: "https://www.heroicons-animated.com/",
    summary: "316 open-source animated Heroicons",
    description:
      "An open-source collection of 316 beautifully animated heroicons for your projects.",
    category: "icons",
    frameworks: ["react"],
    base: "none",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "hextaui",
    homepage: "https://hextaui.com",
    summary: "Ready-to-use foundation components and blocks built on shadcn/ui",
    description:
      "Ready-to-use foundation components/blocks built on top of shadcn/ui.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "hexui",
    homepage: "https://hexui.sh",
    summary: "React blocks and page templates packaged as a shadcn registry",
    description:
      "A shadcn/ui registry of high-quality React blocks and templates.",
    category: "blocks",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: ["marketing"],
  },
  {
    name: "hirael",
    homepage: "https://hirael.com",
    summary: "High-utility components filling gaps shadcn/ui doesn't ship",
    description:
      "The components shadcn/ui doesn't ship. A collection of high-utility React components built on top of shadcn/ui.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "hugeicons-animated",
    homepage: "https://hugeicons-animated.com",
    summary: "Open-source animated Hugeicons for React",
    description: "An open-source collection of animated Hugeicons for React.",
    category: "icons",
    frameworks: ["react"],
    base: "none",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "iconiq",
    homepage: "https://iconiqui.com",
    summary: "Clean minimalistic icon set aimed at web applications",
    description:
      "Iconiq is a collection of icons designed for web applications. It is a modern, clean, and minimalistic icon set that is perfect for web applications.",
    category: "icons",
    frameworks: ["react"],
    base: "none",
    pricing: "free",
    tags: ["minimal", "open-source"],
  },
  {
    name: "icons-animated",
    homepage: "https://icons.lndev.me",
    summary: "Animated Tabler and Phosphor icons, lucide-animated style",
    description:
      "An open-source library of meticulously animated icons (Tabler, Phosphor, and more) for your projects, inspired by lucide-animated.com",
    category: "icons",
    frameworks: ["react"],
    base: "none",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "indiacn",
    homepage: "https://indiacn.in",
    summary:
      "UX4G 2.0 India design system with accessible components and theme preset",
    description:
      "UX4G 2.0 design system for India — many accessible React components and an 8-color theme preset for native apps.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["accessibility", "open-source"],
  },
  {
    name: "inferencesh",
    homepage: "https://ui.inference.sh",
    summary:
      "Agent chat UI with streaming, tool calls, markdown and code blocks",
    description:
      "batteries-included agent components by inference.sh. chat interfaces with streaming, tool invocation rendering, syntax-highlighted code blocks, markdown renderer, and more.",
    category: "ai",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "intentui",
    homepage: "https://intentui.com",
    summary: "Accessible copy-and-own React component library",
    description:
      "Accessible React component library to copy, customize, and own your UI.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["accessibility", "open-source"],
  },
  {
    name: "jalco",
    homepage: "https://ui.justinlevine.me",
    summary: "Zero-dependency GitHub, docs and developer-facing components",
    description:
      "A curated collection of GitHub-integrated, documentation, and developer-facing components. Self-contained, zero-dependency, and production-ready.",
    category: "components",
    frameworks: ["react"],
    base: "none",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "jolyui",
    homepage: "https://www.jolyui.dev",
    summary: "React component library in TypeScript and Tailwind CSS",
    description:
      "JolyUI is a modern React component library built with TypeScript and Tailwind CSS.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "joyco",
    homepage: "https://registry.joyco.studio",
    summary:
      "Studio's internal kit: menus, scroll areas, chat UI, HLS player, marquee",
    description:
      "Components including MobileMenu, ScrollArea with gradients, Chat UI, HLSVideoPlayer, and Marquee.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "kanpeki",
    homepage: "https://kanpeki.vercel.app",
    summary: "Carefully designed components on React Aria and Motion",
    description:
      "A set of perfect-designed components built on top of React Aria and Motion.",
    category: "components",
    frameworks: ["react"],
    base: "react-aria",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "kapwa",
    homepage: "https://kapwa-two.vercel.app",
    summary: "Design system components for open-source government portals",
    description:
      "Cleanly designed components purposely built for open-source government portals.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "kibo-ui",
    homepage: "https://www.kibo-ui.com/",
    summary: "Composable accessible components designed to extend shadcn/ui",
    description:
      "Kibo UI is a custom registry of composable, accessible and open source components designed for use with shadcn/ui.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "free",
    tags: ["accessibility", "open-source"],
  },
  {
    name: "kinetic",
    homepage: "https://kinetic.itsjay.in",
    summary: "Figma-like scrub number field with animated digits for shadcn/ui",
    description:
      "A Figma-like scrub number field for shadcn/ui (base-nova). Digit animation by Calligraph.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "kokonutui",
    homepage: "https://kokonutui.com",
    summary: "Tailwind and Motion components built on top of shadcn/ui",
    description:
      "Collection of stunning components built with Tailwind CSS, shadcn/ui and Motion to use on your websites.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "launchui",
    homepage: "https://www.launchuicomponents.com/",
    summary: "Landing page sections and templates with paid tiers",
    description:
      "Carefully crafted landing page components and templates built with React, Shadcn/ui and Tailwind.",
    category: "blocks",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "freemium",
    tags: ["marketing"],
  },
  {
    name: "lens-blocks",
    homepage: "https://lensblocks.com",
    summary: "Social feed components for the Lens Social Protocol",
    description:
      "A collection of social media components for use with Lens Social Protocol.",
    category: "specialty",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: ["web3"],
  },
  {
    name: "limeplay",
    homepage: "https://limeplay.winoffrg.dev",
    summary: "Media player UI library for React powered by Shaka Player",
    description:
      "Modern UI Library for building media players in React. Powered by Shaka Player.",
    category: "media",
    frameworks: ["react"],
    base: "none",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "liquefy-ui",
    homepage: "https://liquefy-ui.com",
    summary:
      "Liquid glass components with WebGL refraction over Base UI primitives",
    description:
      "Liquid Glass components for React: WebGL edge refraction and pointer-driven springs over accessible Base UI primitives. TypeScript, RSC-ready, with an MCP server.",
    category: "components",
    frameworks: ["react"],
    base: "base-ui",
    pricing: "free",
    tags: ["glass", "open-source"],
  },
  {
    name: "lmscn",
    homepage: "https://lmscn.vercel.app",
    summary: "LMS learning components: quizzes, flashcards, spaced repetition",
    description:
      "LMS components for building interactive learning experiences — quiz, flashcards, matching, fill-in-the-blank, word scramble, sequencing, reading comprehension, spaced repetition and more.",
    category: "specialty",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "loading-ui",
    homepage: "https://loading-ui.com",
    summary: "Free spinners, loaders and loading animations for web apps",
    description:
      "Spinners, loaders, and loading animations for modern web apps. Free and open-source.",
    category: "animations",
    frameworks: ["react"],
    base: "none",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "lucide-animated",
    homepage: "https://lucide-animated.com",
    summary: "Open-source smoothly animated Lucide icons",
    description:
      "An open-source collection of smooth animated lucide icons for your projects",
    category: "icons",
    frameworks: ["react"],
    base: "none",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "lumiui",
    homepage: "https://www.lumiui.dev",
    summary: "Composable React components powered by Base UI and Tailwind",
    description:
      "Composable React components powered by Base UI and Tailwind CSS — Build fast, customize everything.",
    category: "components",
    frameworks: ["react"],
    base: "base-ui",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "lytenyte",
    homepage: "https://www.1771technologies.com",
    summary:
      "Headless high-performance React data grid themed for shadcn tokens",
    description:
      "LyteNyte Grid is a high performance, light weight, headless, React data grid. Our registry provides LyteNyte Grid themed using Tailwind and the Shadcn theme variables.",
    category: "components",
    frameworks: ["react"],
    base: "none",
    pricing: "freemium",
    tags: ["dashboard"],
  },
  {
    name: "magicui",
    homepage: "https://magicui.design",
    summary: "150+ animated components and effects companion to shadcn/ui",
    description:
      "UI Library for Design Engineers. 150+ free and open-source animated components and effects built with React, Typescript, Tailwind CSS, and Motion. Perfect companion for shadcn/ui.",
    category: "animations",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "freemium",
    tags: ["marketing", "open-source"],
  },
  {
    name: "manifest",
    homepage: "https://ui.manifest.build",
    summary: "Agentic UI components and blocks for building MCP and chat apps",
    description:
      "Agentic UI toolkit for building MCP Apps. Open-source components and blocks ready to use within your chat app.",
    category: "ai",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "mapcn",
    homepage: "https://mapcn.dev",
    summary: "Customizable React map components built on MapLibre and Tailwind",
    description:
      "Beautiful maps, made simple. Ready to use, customizable map components for React. Built on MapLibre. Styled with Tailwind CSS.",
    category: "maps",
    frameworks: ["react"],
    base: "none",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "mksingh",
    homepage: "https://mksingh.dev/docs",
    summary: "Personal registry of shadcn-ready components and utilities",
    description:
      "A personal registry of production-ready ShadCN components and utilities. Everything is built to drop into your existing ShadCN project with no extra setup.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "moduix-react",
    homepage: "https://moduix.dev",
    summary: "Ark-first components, blocks and themes with native CSS",
    description:
      "Ark-first React components, blocks, and themes with native CSS, available as a package or a shadcn-compatible copy-owned registry.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "moleculeui",
    homepage: "https://www.moleculeui.design/",
    summary: "React component library focused on intuitive interactions",
    description:
      "A modern React component library focused on intuitive interactions and seamless user experiences.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "motion-primitives",
    homepage: "https://www.motion-primitives.com",
    summary: "Copy-paste motion components with a paid pro template tier",
    description:
      "Beautifully designed motions components. Easy copy-paste. Customizable. Open Source. Built for engineers and designers.",
    category: "animations",
    frameworks: ["react"],
    base: "none",
    pricing: "freemium",
    tags: ["open-source"],
  },
  {
    name: "mozaika",
    homepage: "https://mozaika.design",
    summary:
      "Color, type and spacing themes measured from real product UIs, plus MCP server",
    description:
      "Design systems measured from real product UIs — color roles, typography and spacing as themes installable with the shadcn CLI. Free open shelf; companion MCP server for AI coding agents.",
    category: "theming",
    frameworks: ["react"],
    base: "none",
    pricing: "freemium",
    tags: [],
  },
  {
    name: "mui-treasury",
    homepage: "https://www.mui-treasury.com",
    summary: "Hand-crafted interfaces built on top of MUI components",
    description:
      "A collection of hand-crafted interfaces built on top of MUI components",
    category: "components",
    frameworks: ["react"],
    base: "none",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "motokoui",
    homepage: "https://motokoui.com",
    summary:
      "Components, application blocks, templates and starter kits for React",
    description:
      "Components, application blocks, templates, and starter kits for modern React applications.",
    category: "blocks",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "navui",
    homepage: "https://ui.navdeepsingh.dev",
    summary:
      "shadcn-compatible components, blocks and illustrations adapting to your config",
    description:
      "shadcn-compatible components, blocks, and illustrations that adapt to your existing design configuration.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "ncdai",
    homepage: "https://chanhdai.com/components",
    summary: "Pixel-perfect, uniquely crafted personal component collection",
    description: "Pixel-perfect, uniquely crafted.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["minimal", "open-source"],
  },
  {
    name: "neobrutalism",
    homepage: "https://www.neobrutalism.dev",
    summary: "Neobrutalism-styled components based on shadcn/ui",
    description:
      "A collection of neobrutalism-styled components based on shadcn/ui",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "free",
    tags: ["brutalism", "open-source"],
  },
  {
    name: "neon-ui",
    homepage: "https://ui.neon.com",
    summary:
      "Neon Postgres platform UI: branching, connection strings, usage metering",
    description:
      "Production-ready components for agent platforms built on Neon. Database branching, connection strings, usage metering and project management UI, built with Base UI and Tailwind v4.",
    category: "product-sdk",
    frameworks: ["react"],
    base: "base-ui",
    pricing: "unknown",
    tags: ["tailwind-v4", "dashboard"],
  },
  {
    name: "nessra-ui",
    homepage: "https://nessra-ui.vercel.app",
    summary:
      "Accessible components with auth blocks, data tables and TanStack Form",
    description:
      "Beautiful, accessible components built with Tailwind CSS v4 and Radix UI. Includes auth blocks, data tables, and TanStack Form integration.",
    category: "components",
    frameworks: ["react"],
    base: "radix",
    pricing: "unknown",
    tags: ["tailwind-v4", "accessibility"],
  },
  {
    name: "nexus-elements",
    homepage: "https://elements.nexus.availproject.org/docs/view-components",
    summary:
      "Ready-made React components for Avail Nexus chain-abstraction flows",
    description:
      "Ready-made React components for almost any use case. Use as is or customise and go to market fast",
    category: "specialty",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: ["web3"],
  },
  {
    name: "nexus-labs",
    homepage: "https://nexus-ui.com",
    summary:
      "Motion-native animated backgrounds, heroes, inputs and carousels for Next.js",
    description:
      "Motion-native animated components for Next.js — backgrounds, heroes, inputs, carousels, and more. Open source. Copy-ready TypeScript.",
    category: "animations",
    frameworks: ["react"],
    base: "unknown",
    pricing: "freemium",
    tags: ["marketing"],
  },
  {
    name: "nexus-ui",
    homepage: "https://nexus-ui.dev",
    summary:
      "Composable copy-paste primitives for AI chat, streaming and multimodal UIs",
    description:
      "Open-source component library of composable, copy-paste primitives for building AI interfaces (chat, streaming, multimodal)",
    category: "ai",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "nordaun",
    homepage: "https://ui.nordaun.com",
    summary: "Simple components for your extraordinary creations",
    description: "Simple components for your extraordinary creations.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: ["minimal"],
  },
  {
    name: "nteract",
    homepage: "https://nteract-elements.vercel.app/",
    summary: "Components for interactive computing notebooks",
    description: "Components for interactive computing notebooks.",
    category: "specialty",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: ["open-source"],
  },
  {
    name: "nuqs",
    homepage: "https://nuqs.dev/registry",
    summary:
      "Community parsers, adapters and utilities for type-safe URL state",
    description:
      "Custom parsers, adapters and utilities from the community for type-safe URL state management.",
    category: "utilities",
    frameworks: ["react"],
    base: "none",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "nusaiba",
    homepage: "https://nusaiba.dev",
    summary:
      "Motion-first shadcn marketing blocks: heroes, pricing, FAQs, footers",
    description:
      "Motion-first shadcn marketing blocks for landing pages — heroes, pricing, FAQs, footers, and more. Built on base-nova with intentional animation and CLI install.",
    category: "blocks",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: ["marketing"],
  },
  {
    name: "odysseyui",
    homepage: "https://www.odysseyui.com/docs",
    summary:
      "Design-focused component library for Next.js built for speed and DX",
    description:
      "A design focused component library for Next.js, built for speed, flexibility and developer experience.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "ogimagecn",
    homepage: "https://ogimagecn.vercel.app",
    summary: "Customizable Open Graph image components for React",
    description:
      "Beautiful OG images, made simple. Ready to use, customizable Open Graph image components for React.",
    category: "media",
    frameworks: ["react"],
    base: "none",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "openpolicy",
    homepage: "https://www.openpolicy.sh",
    summary: "Components for terms, privacy policies and cookie banners",
    description:
      "Open-source components for building terms, privacy policies and cookie banners.",
    category: "specialty",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "openstatus",
    homepage: "https://openstatus.dev/registry",
    summary: "Accessible components for building status pages, from OpenStatus",
    description:
      "Hand-crafted, accessible components for building beautiful status pages.",
    category: "product-sdk",
    frameworks: ["react"],
    base: "unknown",
    pricing: "freemium",
    tags: ["dashboard", "open-source"],
  },
  {
    name: "optics",
    homepage: "https://optics.agusmayol.com.ar",
    summary:
      "Design system distributing re-styled components, utilities and hooks",
    description:
      "A design system that distributes re-styled components, utilities, and hooks ready to use.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "oui",
    homepage: "https://oui.mw10013.workers.dev",
    summary:
      "React Aria Components with shadcn characteristics, side-by-side with shadcn",
    description:
      "React Aria Components with shadcn characteristics.Copy-and-paste react aria components that run side-by-side with shadcn components.",
    category: "components",
    frameworks: ["react"],
    base: "react-aria",
    pricing: "unknown",
    tags: ["accessibility"],
  },
  {
    name: "paceui",
    homepage: "https://paceui.com",
    summary:
      "UI blocks for real apps and dashboards, from early ideas to production",
    description:
      "Carefully built UI blocks for real apps and dashboards, designed to integrate smoothly from early ideas to production releases.",
    category: "blocks",
    frameworks: ["react"],
    base: "unknown",
    pricing: "paid",
    tags: ["dashboard"],
  },
  {
    name: "pacekit",
    homepage: "https://ui.pacekit.dev",
    summary: "UI blocks for apps and dashboards; same deployment as PaceUI",
    description:
      "Carefully built UI blocks for real apps and dashboards, designed to integrate smoothly from early ideas to production releases.",
    category: "blocks",
    frameworks: ["react"],
    base: "unknown",
    pricing: "paid",
    tags: ["dashboard"],
  },
  {
    name: "paceui-gsap",
    homepage: "https://gsap.paceui.com",
    summary:
      "Animated GSAP components crafted for smooth interaction and rich detail",
    description:
      "Animated GSAP components crafted for smooth interaction and rich detail.",
    category: "animations",
    frameworks: ["react"],
    base: "none",
    pricing: "unknown",
    tags: ["gsap"],
  },
  {
    name: "paddle",
    homepage: "https://developer.paddle.com/",
    summary:
      "Drop-in checkout, pricing and subscription screens for Paddle Billing",
    description:
      "Drop-in components for building checkouts, pricing pages, and subscription management screens using Paddle Billing.",
    category: "product-sdk",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "paletteui",
    homepage: "https://paletteui.xyz",
    summary: "Curated OKLCH themes for shadcn/ui plus a visual theme editor",
    description:
      "Curated OKLCH color themes for shadcn/ui + visual theme editor with CSS, Tailwind v4, and Figma export.",
    category: "theming",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "free",
    tags: ["tailwind-v4", "open-source"],
  },
  {
    name: "payload-components",
    homepage: "https://www.payload-components.xyz",
    summary:
      "Typed Payload CMS v3 blocks with a CLI that wires config and types",
    description:
      "MIT registry of typed Payload CMS blocks for Payload v3 + Next.js. Each block installs as reviewable source; the companion CLI also wires collection config, RenderBlocks, types, and the admin import map.",
    category: "product-sdk",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "pastecn",
    homepage: "https://pastecn.com",
    summary:
      "Pastebin that turns pasted code into a shadcn-compatible registry URL",
    description:
      "pastebin + shadcn = pastecn. Paste your code and get a shadcn-compatible registry URL instantly.",
    category: "utilities",
    frameworks: ["react"],
    base: "none",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "paykit-sdk",
    homepage: "https://www.usepaykit.dev",
    summary:
      "Unified payments SDK UI for checkout, billing and webhooks across gateways",
    description:
      "Unified payments SDK for builders — handle checkout, billing, and webhooks across Stripe, PayPal, Adyen, and regional gateways with a single integration.",
    category: "product-sdk",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "phucbm",
    homepage: "https://phucbm.com/components",
    summary: "Modern React UI components animated with GSAP",
    description:
      "A collection of modern React UI components with GSAP animations.",
    category: "animations",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: ["gsap"],
  },
  {
    name: "pixelact-ui",
    homepage: "https://pixelactui.com",
    summary:
      "Pixel-art style components on top of shadcn for retro projects and games",
    description:
      "Playful pixel art style components library built on top of shadcn. Perfect for retro style projects and games.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "free",
    tags: ["retro", "playful", "open-source"],
  },
  {
    name: "plate",
    homepage: "https://platejs.org",
    summary: "AI-powered rich text editor for React, with paid pro templates",
    description: "AI-powered rich text editor for React.",
    category: "editor",
    frameworks: ["react"],
    base: "unknown",
    pricing: "freemium",
    tags: ["open-source"],
  },
  {
    name: "prompt-kit",
    homepage: "https://www.prompt-kit.com",
    summary: "Accessible building blocks for AI app and chat interfaces",
    description:
      "Core building blocks for AI apps. High-quality, accessible, and customizable components for AI interfaces.",
    category: "ai",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["accessibility", "open-source"],
  },
  {
    name: "prosekit",
    homepage: "https://prosekit.dev",
    summary: "Rich text editor for React, Vue, Preact, Svelte and SolidJS",
    description:
      "Powerful and flexible rich text editor for React, Vue, Preact, Svelte, and SolidJS.",
    category: "editor",
    frameworks: ["react", "vue", "svelte", "solid", "other"],
    base: "none",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "pulkitxm",
    homepage: "https://pulkit.page",
    summary: "Animated shadcn components built with GSAP and Framer Motion",
    description:
      "Animated shadcn components powered by GSAP and Framer Motion. Built for expressive UIs.",
    category: "animations",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: ["gsap"],
  },
  {
    name: "pulld",
    homepage: "https://pulld.pages.dev",
    summary:
      "Typed, accessible React/Tailwind atoms plus paid composed Pro blocks",
    description:
      "Typed, accessible, theme-aware React/Tailwind components installable by the shadcn CLI or your AI coding agent. Free atoms plus composed Pro blocks.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "freemium",
    tags: ["accessibility"],
  },
  {
    name: "pureui",
    homepage: "https://pure.kam-ui.com/",
    summary:
      "Refined animated accessible components on Base UI, Tailwind and Motion",
    description:
      "Pure UI is a curated collection of refined, animated, and accessible components built with Base UI, Tailwind CSS, Motion, and other high-quality open source libraries.",
    category: "components",
    frameworks: ["react"],
    base: "base-ui",
    pricing: "unknown",
    tags: ["accessibility"],
  },
  {
    name: "ramonclaudio-coderabbit",
    homepage: "https://ramonclaudio.com/registries/coderabbit",
    summary:
      "Unofficial CodeRabbit API client, storage adapters and dev activity report UI",
    description:
      "A framework-agnostic API client, pluggable storage adapters (LocalStorage, Convex, Supabase, PostgreSQL, MySQL), and React components for generating developer activity reports.",
    category: "product-sdk",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "react-aria",
    homepage: "https://react-aria.adobe.com",
    summary:
      "Adobe's Tailwind and vanilla CSS components with top-tier a11y and i18n",
    description:
      "Customizable Tailwind and Vanilla CSS components with adaptive interactions, top-tier accessibility, and internationalization.",
    category: "components",
    frameworks: ["react"],
    base: "react-aria",
    pricing: "free",
    tags: ["accessibility", "open-source"],
  },
  {
    name: "react-bits",
    homepage: "https://reactbits.dev",
    summary:
      "Large set of animated text, background and interactive React components",
    description:
      "A large collection of animated, interactive & fully customizable React components for building memorable websites. From smooth text animations all the way to eye-catching backgrounds, you can find it here.",
    category: "animations",
    frameworks: ["react"],
    base: "unknown",
    pricing: "freemium",
    tags: ["open-source", "playful"],
  },
  {
    name: "react-easy-modals",
    homepage: "https://react-easy-modals-docs.vercel.app",
    summary:
      "Promise-based modal system layered on the shadcn Dialog component",
    description:
      "Modal component for react-easy-modals. Integrates with shadcn Dialog for a simple, powerful modal system with TypeScript support and promise-based API.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "react-slot",
    homepage: "https://react-slot.vercel.app/",
    summary:
      "Vue-style slot composition primitives for fine-grained React composition",
    description:
      "Vue-style slot composition for React - Fine-grained control over component composition",
    category: "utilities",
    frameworks: ["react"],
    base: "none",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "remocn",
    homepage: "https://www.remocn.dev/",
    summary:
      "Remotion text animations, backgrounds, transitions and scene compositions",
    description:
      "Production-ready components for Remotion - text animations, backgrounds, transitions, UI blocks, and full scene compositions",
    category: "animations",
    frameworks: ["react"],
    base: "none",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "rescript-shadcn",
    homepage: "https://rescript-shadcn.miriad.studio",
    summary:
      "shadcn/ui components rewritten in ReScript, installable via the shadcn CLI",
    description:
      "Shadcn components rewritten in Rescript, compatible with shadcn CLI.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "retab",
    homepage: "https://ui.retab.com",
    summary:
      "Retab document-processing UI: OCR viewers, schema builders, extraction blocks",
    description:
      "Document-processing UI components for Retab — file, OCR, and data viewers, schema builders, dropzones, and extraction blocks, built on shadcn/ui.",
    category: "product-sdk",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "retroui",
    homepage: "https://retroui.dev",
    summary:
      "Neobrutalist React and Tailwind component library with a Pro tier and Figma kit",
    description:
      "A Neobrutalism styled React + TailwindCSS UI library for building bold, modern web apps. Perfect for any project using Shadcn/ui.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "freemium",
    tags: ["brutalism", "retro"],
  },
  {
    name: "reui",
    homepage: "https://reui.io",
    summary:
      "1,000+ free open-source components and patterns for shadcn projects",
    description:
      "Free & open-source library of 1,000+ components and patterns to 10x your productivity in shadcn projects.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "roiui",
    homepage: "https://roiui.com",
    summary:
      "Open-source components and blocks on Base UI primitives with Motion",
    description:
      "Roi UI is a library that offers UI components and blocks built with Base UI primitives. Some blocks and components use motion (framer). Everything is open-source and will be forever.",
    category: "components",
    frameworks: ["react"],
    base: "base-ui",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "sabraman",
    homepage: "https://sabraman.ru/components",
    summary: "Legacy skeuomorphic components and blocks for shadcn",
    description: "Legacy skeuomorphic UI components and blocks for shadcn.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "free",
    tags: ["retro", "open-source"],
  },
  {
    name: "satoriui",
    homepage: "https://satoriui.site",
    summary:
      "High-fidelity motion-driven interaction components using motion-react and Tailwind",
    description:
      "A comprehensive suite of high-fidelity interaction components. It offers motion-driven components that designed with motion-react and tailwindcss, that blends seamlessly.",
    category: "animations",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "scrollxui",
    homepage: "https://www.scrollxui.dev",
    summary:
      "Open-source animated, interactive components that blend into shadcn setups",
    description:
      "ScrollX UI is an open-source React and shadcn-compatible component library for animated, interactive, and customizable user interfaces. It offers motion-driven components that blend seamlessly with modern ShadCN setups.",
    category: "animations",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "seamui",
    homepage: "https://seamui.dev",
    summary:
      "Base UI components with spring/touch feel plus an AI agent-workbench tier",
    description:
      "Own-your-code components rebuilt on Base UI with a motion.dev feel layer — springs, touch feedback, and depth — plus an agent-workbench tier (composer, voice, status, connectors) for AI-era interfaces.",
    category: "components",
    frameworks: ["react"],
    base: "base-ui",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "shadcn-editor",
    homepage: "https://shadcn-editor.vercel.app",
    summary: "Accessible rich-text editor built with Lexical and shadcn/ui",
    description:
      "Accessible, Customizable, Rich Text Editor. Made with Lexical and Shadcn/UI. Open Source. Open Code.",
    category: "editor",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "free",
    tags: ["open-source", "accessibility"],
  },
  {
    name: "shadcn-map",
    homepage: "https://shadcn-map.vercel.app",
    summary: "Map component for shadcn/ui built on Leaflet and React Leaflet",
    description:
      "A map component for shadcn/ui. Built with Leaflet and React Leaflet.",
    category: "maps",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "shadcn-space",
    homepage: "https://shadcnspace.com",
    summary:
      "Customizable shadcn/ui components, blocks and themes from the WrapPixel team",
    description:
      "ShadcnSpace is a collection of extra-ordinary, highly customizable shadcn/ui components, blocks, and themes to build modern UIs with speed and clarity.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: ["dashboard"],
  },
  {
    name: "shadcn-studio",
    homepage: "https://shadcnstudio.com",
    summary:
      "Open-source shadcn/ui components, blocks and templates with a theme generator",
    description:
      "An open-source set of shadcn/ui components, blocks, and templates with a powerful theme generator.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "shadcn-ui-blocks",
    homepage: "https://www.shadcn-ui-blocks.com",
    summary:
      "Free and premium shadcn block collections plus templates, Pro unlocks more",
    description:
      "Shadcn blocks across standard collections and handcrafted premium collections, plus a beautiful templates. Start free, then unlock more with Pro.",
    category: "blocks",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "freemium",
    tags: ["marketing"],
  },
  {
    name: "shadcnblocks",
    homepage: "https://shadcnblocks.com",
    summary:
      "1,400+ blocks, component variants, templates and admin dashboard patterns",
    description:
      "A shadcn/ui registry with 1429 blocks, 1189 component variants, 14 templates, themes, and admin dashboard patterns.",
    category: "blocks",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: ["marketing", "dashboard"],
  },
  {
    name: "shadcncraft",
    homepage: "https://shadcncraft.com",
    summary:
      "Production-standard shadcn components and blocks from a Figma + React system",
    description:
      "A starter collection of polished shadcn/ui components and blocks built to production standards. Part of a larger Figma + React system designed to scale with your product.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "freemium",
    tags: ["minimal"],
  },
  {
    name: "shadcndesign",
    homepage: "https://www.shadcndesign.com",
    summary:
      "High-quality shadcn/ui blocks and themes with a paid Figma kit and Pro blocks",
    description:
      "A growing collection of high-quality blocks and themes for shadcn/ui.",
    category: "blocks",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "freemium",
    tags: ["marketing"],
  },
  {
    name: "shadcnhooks",
    homepage: "https://shadcn-hooks.com",
    summary: "Comprehensive collection of React hooks distributed shadcn-style",
    description: "A comprehensive React Hooks Collection built with Shadcn.",
    category: "utilities",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "shadcnmaps",
    homepage: "https://shadcnmaps.com",
    summary:
      "Interactive SVG map components for React, no map library required",
    description: "Beautiful map components powered by pure SVG.",
    category: "maps",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: ["open-source"],
  },
  {
    name: "shadcnstore",
    homepage: "https://www.shadcnstore.com",
    summary: "Growing set of shadcn/ui components, blocks and app templates",
    description:
      "A growing collection of shadcn/ui components, blocks, and templates for building modern web apps.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: ["dashboard"],
  },
  {
    name: "shadcnui-blocks",
    homepage: "https://shadcnui-blocks.com",
    summary:
      "Premium production-ready shadcn/ui blocks, components and templates",
    description:
      "A collection of premium, production-ready shadcn/ui blocks, components and templates.",
    category: "blocks",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: ["marketing"],
  },
  {
    name: "shadcnuikit",
    homepage: "https://shadcnuikit.com",
    summary:
      "Admin dashboards, website templates, blocks and real-world example pages",
    description:
      "Launch your projects faster with admin dashboards, website templates, components, blocks, and pre-built real-world examples.",
    category: "blocks",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "freemium",
    tags: ["dashboard", "marketing"],
  },
  {
    name: "shark",
    homepage: "https://shark.vini.one",
    summary: "shadcn/ui-style components built on Ark UI primitives",
    description: "shadcn/ui-style components built on Ark UI.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "shieldcn",
    homepage: "https://shieldcn.dev",
    summary:
      "Drop-in SVG README badge components, a shields.io alternative styled like shadcn",
    description:
      "Beautiful README badges as a service. A shields.io alternative with the visual quality of shadcn/ui. Drop-in SVG badge components for npm, GitHub, Discord, and more.",
    category: "specialty",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: ["open-source", "minimal"],
  },
  {
    name: "skiper-ui",
    homepage: "https://skiper-ui.com/",
    summary:
      "Uncommon Next.js components and collections installable via shadcn CLI 3.0",
    description:
      "Brand new uncommon components for your Next.js project. Use with ease through shadcn CLI 3.0, featuring fast-growing components and collections that are easy to edit and use.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "freemium",
    tags: ["playful"],
  },
  {
    name: "slide-cn",
    homepage: "https://slide-cn.com",
    summary: "Component library for building slide decks in code",
    description: "A component library to build slide decks using code.",
    category: "specialty",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "smoothui",
    homepage: "https://smoothui.dev",
    summary:
      "Motion components built with React, Framer Motion and Tailwind for microinteractions",
    description:
      "A collection of beautifully crafted motion components built with React, Framer Motion, and TailwindCSS. Designed to elevate microinteractions, each component focuses on smooth animations, subtle feedback, and delightful UX. Perfect for designers and developers who want to add refined motion to their interfaces — copy, paste, and make your UI come alive.",
    category: "animations",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["open-source", "playful"],
  },
  {
    name: "solaceui",
    homepage: "https://www.solaceui.com",
    summary:
      "Sections, animated components and full-page templates for Next.js and Motion",
    description:
      "Production-ready and tastefully crafted sections, animated components, and full-page templates for Next.js, Tailwind CSS & Motion",
    category: "blocks",
    frameworks: ["react"],
    base: "unknown",
    pricing: "freemium",
    tags: ["marketing"],
  },
  {
    name: "sona-ui",
    homepage: "https://sona-ui.vercel.app",
    summary: "Modern React and Tailwind component library for accessible apps",
    description:
      "A modern UI component library built with React and TailwindCSS to help you build beautiful and accessible web applications faster.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["open-source", "accessibility"],
  },
  {
    name: "soralabs",
    homepage: "https://ui.soralabs.io.vn",
    summary:
      "Motion-first React primitives and animated components for shadcn/ui",
    description:
      "Motion-first React primitives and animated UI components for shadcn/ui. Copy, customize, and ship fluid interfaces.",
    category: "animations",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "soundcn",
    homepage: "https://soundcn.xyz",
    summary:
      "700+ curated game, interface, retro and voice sound effects for web apps",
    description:
      "Large collection of game, interface, retro, and voice sound effects for web applications",
    category: "media",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["open-source", "retro"],
  },
  {
    name: "spectrumui",
    homepage: "https://ui.spectrumhq.in",
    summary:
      "Elegant responsive components and animations built on shadcn/ui and Tailwind",
    description:
      "A modern component library built with shadcn/ui and Tailwind CSS. Spectrum UI offers elegant, responsive components and smooth animations designed for high-quality interfaces.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "spell",
    homepage: "https://spell.sh",
    summary:
      "Sophisticated UI components for modern React and Tailwind applications",
    description:
      "Beautiful, sophisticated UI components designed for modern React and Tailwind CSS applications.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "square-ui",
    homepage: "https://square.lndev.me",
    summary:
      "Open-source layout collections built with shadcn/ui, with paid Pro tier",
    description:
      "Collection of beautifully crafted open-source layouts UI built with shadcn/ui.",
    category: "blocks",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "freemium",
    tags: ["open-source", "dashboard"],
  },
  {
    name: "stepper",
    homepage: "https://francozeta-stepper.vercel.app",
    summary:
      "Composable accessible Stepper component with registry-first distribution",
    description:
      "A modern, accessible and composable Stepper component for React and Tailwind CSS. Built for shadcn/ui-style workflows with registry-first distribution.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "free",
    tags: ["accessibility", "open-source"],
  },
  {
    name: "supabase",
    homepage: "https://supabase.com/ui",
    summary:
      "Official blocks wiring front-ends to Supabase auth, realtime and storage",
    description:
      "A collection of React components and blocks built on the shadcn/ui library that connect your front-end to your Supabase back-end via a single command.",
    category: "product-sdk",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "svgl",
    homepage: "https://svgl.app",
    summary: "Library of SVG brand logos",
    description: "A beautiful library with SVG logos.",
    category: "icons",
    frameworks: ["react"],
    base: "none",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "systaliko-ui",
    homepage: "https://systaliko-ui.vercel.app",
    summary:
      "Customizable component library built to scale across variants and use cases",
    description:
      "UI component library, Designed for flexibility, built for customization, and crafted to scale across variants and use cases.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "tailark",
    homepage: "https://tailark.com",
    summary: "shadcn blocks for modern marketing websites, with paid pro tier",
    description:
      "Shadcn blocks designed for building modern marketing websites.",
    category: "blocks",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "freemium",
    tags: ["marketing"],
  },
  {
    name: "tailgrids",
    homepage: "https://tailgrids.com",
    summary:
      "React UI components powered by Tailwind CSS from the Pimjo/TailGrids suite",
    description: "React UI Components, Powered by Tailwind CSS",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "freemium",
    tags: ["marketing"],
  },
  {
    name: "tailwind-admin",
    homepage: "https://tailwind-admin.com/",
    summary:
      "Free admin dashboard templates and UI blocks for React, Next.js and shadcn/ui",
    description:
      "Tailwind Builder provides free tailwind admin dashboard templates, components and ui-blocks built with React, Next.js, Tailwind CSS, and shadcn/ui to help you build admin panels quickly and efficiently.",
    category: "blocks",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "freemium",
    tags: ["dashboard"],
  },
  {
    name: "tailwind-builder",
    homepage: "https://tailwindbuilder.ai/",
    summary: "Free UI blocks plus AI tools generating forms, tables and charts",
    description:
      "Tailwind Builder is a collection of free ui blocks and components and provide ai tools to generate production-ready forms, tables, and charts in seconds. Built with React, Next.js, Tailwind & ShadCN.",
    category: "blocks",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "freemium",
    tags: ["dashboard", "marketing"],
  },
  {
    name: "taki",
    homepage: "https://taki-ui.com",
    summary:
      "Copy-paste accessible components using React Aria and shadcn tokens",
    description:
      "Beautifully designed, accessible components that you can copy and paste into your apps. Made with React Aria Components and Shadcn tokens.",
    category: "components",
    frameworks: ["react"],
    base: "react-aria",
    pricing: "free",
    tags: ["accessibility", "open-source"],
  },
  {
    name: "termcn",
    homepage: "https://termcn.vercel.app",
    summary: "Customizable terminal-style UI components for React",
    description:
      "Beautiful terminal UIs, made simple. Ready to use, customizable terminal UI components for React.",
    category: "specialty",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "free",
    tags: ["terminal", "open-source"],
  },
  {
    name: "tuiparts",
    homepage: "https://tuiparts.sh",
    summary: "OpenTUI recipes for Core, React and Solid terminal interfaces",
    description:
      "OpenTUI recipes, made simple. Ready to use, customizable terminal UI recipes for Core, React, and Solid.",
    category: "specialty",
    frameworks: ["react", "solid", "other"],
    base: "none",
    pricing: "free",
    tags: ["terminal", "open-source"],
  },
  {
    name: "terrae",
    homepage: "https://www.terrae.dev",
    summary:
      "Animated Mapbox GL and MapLibre map components companion to shadcn/ui",
    description:
      "Composable, animated map components for React. Built with TypeScript, Tailwind CSS, Mapbox GL JS, and MapLibre GL. Perfect companion for shadcn/ui.",
    category: "maps",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "tetra-ui",
    homepage: "https://tetra-ui.com",
    summary: "Clean accessible component library for React Native",
    description:
      "Delightful components for a clean, accessible and modern component library for React Native.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["mobile", "accessibility"],
  },
  {
    name: "text-ui",
    homepage: "https://joelachance.github.io/text-ui/docs",
    summary: "EchoText layered stroke text that follows the pointer",
    description:
      "A shadcn/ui registry with EchoText (`echo-text`): layered stroke text that follows the pointer—minimal setup, drop-in component.",
    category: "animations",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "thegridcn",
    homepage: "https://thegridcn.com",
    summary:
      "Tron-inspired shadcn theme system with glow levels and sci-fi components",
    description:
      "A Tron-inspired shadcn/ui theme system with Greek god color schemes, glow intensity levels, and sci-fi components like DataCard, HUD, Radar, and more.",
    category: "theming",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "free",
    tags: ["retro", "glass"],
  },
  {
    name: "toc-cn",
    homepage: "https://tocn.vercel.app",
    summary:
      "In-page table of contents with scroll spy and animated SVG tree indicator",
    description:
      "Documentation-style in-page table of contents with scroll spy, animated SVG tree indicator, and mobile sticky collapsible.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: ["minimal"],
  },
  {
    name: "tokenui",
    homepage: "https://www.tokenui.dev",
    summary: "Interactive documentation components for design tokens",
    description:
      "Beautiful, interactive documentation components for your design tokens following industry standards.",
    category: "theming",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: [],
  },
  {
    name: "tool-ui",
    homepage: "https://www.tool-ui.com",
    summary:
      "Open-source components for rendering AI tool call widgets and assistant output",
    description:
      "Open source React components for rendering AI tool call widgets and rich assistant outputs.",
    category: "ai",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "tour",
    homepage: "https://onboarding-tour.vercel.app",
    summary: "Onboarding tour component designed to integrate with shadcn/ui",
    description:
      "A component for building onboarding tours. Designed to integrate with shadcn/ui.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "trophy-ui",
    homepage: "https://ui.trophy.so",
    summary:
      "Gamification components for streaks, achievements, leaderboards and points",
    description:
      "Open-source gamification UI components for streaks, achievements, leaderboards, points, and more. Built on shadcn/ui and Tailwind CSS.",
    category: "product-sdk",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "turbopills-ui",
    homepage: "https://www.turbopills.com/ui/docs",
    summary: "Accessible React components for telehealth applications",
    description:
      "Beautiful, accessible, and customizable React components for your telehealth applications.",
    category: "specialty",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: ["accessibility"],
  },
  {
    name: "typedora-ui",
    homepage: "https://typedora-ui.netlify.app",
    summary:
      "Extension layer bringing full type-safety to shadcn/ui components",
    description:
      "Typedora UI is a next-generation extension layer for shadcn/ui, designed to bring full type-safety to your UI components.",
    category: "utilities",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "ui-layouts",
    homepage: "https://ui-layouts.com/",
    summary:
      "Components, effects, design tools and ready-made blocks for React and Next.js",
    description:
      "UI Layouts offers components, effects, design tools, and ready-made blocks that make building modern interfaces more efficient—built with React, Next.js, Tailwind CSS, and shadcn/ui.",
    category: "blocks",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: ["marketing"],
  },
  {
    name: "uicapsule",
    homepage: "https://uicapsule.com",
    summary:
      "Curated interactive concepts, design experiments and AI/UI components",
    description:
      "A curated collection of components that spark joy. Featuring interactive concepts, design experiments, and components in the intersection of AI/UI.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: ["playful"],
  },
  {
    name: "uitripled",
    homepage: "https://ui.tripled.work",
    summary:
      "Production-ready components and blocks on shadcn/ui plus Framer Motion",
    description:
      "An open-source, Production-ready UI components and blocks powered by shadcn/ui and Framer Motion",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "unlumen-ui",
    homepage: "https://ui.unlumen.com",
    summary:
      "Animation-focused primitives and components sold via one-time and seat tiers",
    description:
      "Primitives and components with serious attention to animation and design. Copy, own, ship.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "paid",
    tags: [],
  },
  {
    name: "untld",
    homepage: "https://ui.untldlabs.com",
    summary:
      "Small component set for modern web apps, site still a bare template",
    description:
      "A set of beautifully designed components for modern web applications.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "uselayouts",
    homepage: "https://uselayouts.com",
    summary:
      "Animated React components and micro-interactions built with Motion",
    description:
      "A collection of premium animated React components and micro-interactions built with Motion for building fluid, professional interfaces.",
    category: "animations",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: [],
  },
  {
    name: "uui",
    homepage: "https://uui.app",
    summary:
      "UI ideas and micro-interaction components drawn from real products",
    description:
      "Inspiration for UI Interfaces. Discover UI ideas, micro-interactions, and components drawn from real products.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "utilcn",
    homepage: "https://utilcn.dev",
    summary:
      "Fullstack registry items: ChatGPT apps, file upload/download, typesafe env vars",
    description:
      "Fullstack registry items to start those big features. Utilcn has ChatGPT Apps, file uploading (with progress bars) and downloading, and a way to make your env vars typesafe on the backend.",
    category: "utilities",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "w3-kit",
    homepage: "https://w3-kit.com",
    summary: "Web3 dApp components: wallet connect, swaps, NFT cards, staking",
    description:
      "Web3 UI components for blockchain dApps. Includes wallet connection, token swaps, NFT cards, staking interfaces, and 20+ more crypto components.",
    category: "specialty",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: ["web3"],
  },
  {
    name: "wa-ui",
    homepage: "https://ui.meta-cloud-api.site",
    summary: "WhatsApp Web UI components on WDS design tokens with Tailwind v4",
    description:
      "Production-ready WhatsApp Web UI components built on WDS design tokens with Tailwind CSS v4 and @base-ui/react.",
    category: "components",
    frameworks: ["react"],
    base: "base-ui",
    pricing: "free",
    tags: ["tailwind-v4", "open-source"],
  },
  {
    name: "wandry-ui",
    homepage: "http://ui.wandry.com.ua/",
    summary: "Fully controlled React Inertia form elements, open source",
    description:
      "A set of open source fully controlled React Inertia form elements",
    category: "forms",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "waves-cn",
    homepage: "https://waves-cn.vercel.app",
    summary: "Wave players and waveform components built on wavesurfer.js",
    description:
      "A collection of wave players and waveform components built with wavesurfer.js and shadcn/ui.",
    category: "media",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "wds",
    homepage: "https://wds-shadcn-registry.netlify.app/",
    summary: "Accessible components made to drop into a shadcn/ui project",
    description:
      "A collection of accessible components built for use with Shadcn.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: ["accessibility"],
  },
  {
    name: "wensity",
    homepage: "https://wensity.com",
    summary:
      "Motion-rich components for AI interfaces, SaaS blocks and cinematic interactions",
    description:
      "Motion-rich React components for AI interfaces, SaaS blocks, and cinematic interactions. Free Wensity components only.",
    category: "animations",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["marketing"],
  },
  {
    name: "wigggle-ui",
    homepage: "https://wigggle-ui.vercel.app",
    summary: "Copy-and-paste widget collection for React projects",
    description:
      "A beautiful collection of copy-and-paste widgets for your next project.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "heatmap",
    homepage: "https://shadcn-heatmap.pages.dev",
    summary:
      "Heatmap components: contribution calendar, weekday-hour matrix, status timeline",
    description:
      "Beautiful, accessible heatmap components for React: GitHub-style calendar, weekday x hour matrix, date x hour, and status timeline. Built with shadcn/ui conventions.",
    category: "charts",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: ["accessibility"],
  },
  {
    name: "xcn",
    homepage: "https://ui.radiumcoders.com",
    summary:
      "Hand-crafted minimal components built with Tailwind CSS and Motion",
    description:
      "Hand-crafted, beautiful, and minimal UI components built with Tailwind CSS and Motion.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["minimal", "open-source"],
  },
  {
    name: "saaskit",
    homepage: "https://saaskit-theta.vercel.app",
    summary:
      "B2B SaaS pricing, billing, usage and onboarding blocks in soft-brutalist style",
    description:
      "10 essential shadcn/ui components for B2B SaaS: Pricing, Billing, Usage, and Onboarding. Minimalist Soft Brutalist design.",
    category: "blocks",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "free",
    tags: ["brutalism", "minimal", "open-source"],
  },
  {
    name: "zippystarter",
    homepage: "https://zippystarter.com",
    summary:
      "Blocks, components and themes for shadcn/ui with a paid lifetime bundle",
    description: "Expertly crafted blocks, components & themes for shadcn/ui.",
    category: "blocks",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "freemium",
    tags: ["marketing"],
  },
  {
    name: "kaui",
    homepage: "https://kaui-shadcn-registry.vercel.app",
    summary: "Personal collection of hand-crafted components for shadcn/ui",
    description: "Personal well crafted components for Shadcn ui",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "uiable",
    homepage: "https://uiable.com",
    summary:
      "Free open-source component library on React 19, Tailwind v4 and shadcn/ui",
    description:
      "Free, open-source UI component library built with Next.js, React 19, Tailwind CSS v4, and shadcn/ui — beautifully designed components you can copy, customize, and make your own.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "free",
    tags: ["tailwind-v4", "open-source"],
  },
  {
    name: "vue-bits",
    homepage: "https://vue-bits.dev",
    summary:
      "Animated, interactive, customizable Vue components for memorable interfaces",
    description:
      "An open source collection of high quality, animated, interactive & fully customizable Vue components for building stunning, memorable user interfaces.",
    category: "animations",
    frameworks: ["vue"],
    base: "none",
    pricing: "free",
    tags: ["open-source", "playful"],
  },
  {
    name: "svelte-bits",
    homepage: "https://sveltebits.xyz",
    summary:
      "Animated, interactive, customizable Svelte components, the Svelte port of React Bits",
    description:
      "An open source collection of high quality, animated, interactive & fully customizable Svelte components for building stunning, memorable user interfaces.",
    category: "animations",
    frameworks: ["svelte"],
    base: "none",
    pricing: "free",
    tags: ["open-source", "playful"],
  },
  {
    name: "aniui",
    homepage: "https://aniui.dev",
    summary:
      "React Native components and screen blocks for Uniwind or NativeWind",
    description:
      "Beautiful, accessible React Native components (Uniwind or NativeWind) — copy, paste, own the code. 93 components plus pre-built screen blocks, installable with the shadcn CLI.",
    category: "components",
    frameworks: ["react"],
    base: "none",
    pricing: "free",
    tags: ["mobile", "open-source"],
  },
  {
    name: "threecn",
    homepage: "https://threecn.dev",
    summary:
      "Theme-aware React Three Fiber 3D scenes installable into shadcn/ui",
    description:
      "3D scenes for shadcn/ui. Theme-aware React Three Fiber components, one command away.",
    category: "3d",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "vllnt-ui",
    homepage: "https://ui.vllnt.com",
    summary:
      "Agent-first components for AI-native products, from primitives to finance and ops",
    description:
      "VLLNT UI — agent-first React components for AI-native products, from UI primitives to finance and ops domains. Accessible, Radix + Tailwind, you own the code.",
    category: "ai",
    frameworks: ["react"],
    base: "radix",
    pricing: "free",
    tags: ["open-source"],
  },
  {
    name: "grainly-icons",
    homepage: "https://grainlyicons.abhii.space",
    summary: "Animated grainy icon set",
    description: "Animated grainy icons",
    category: "icons",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "shadcnloaders",
    homepage: "https://shadcn-loaders.vercel.app",
    summary: "Animated loaders, spinners and loading states in shadcn style",
    description:
      "A public registry of shadcn-inspired animated loaders and loading states.",
    category: "animations",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "shadcn-dashboard",
    homepage: "https://shadcndashboard.dev",
    summary:
      "Production-ready dashboard layouts, components and UI patterns on shadcn/ui",
    description:
      "Shadcn Dashboard is a collection of modern, production-ready dashboard layouts, components, and UI patterns built on top of shadcn/ui and Tailwind CSS. It’s designed to help developers build clean, scalable, and data-driven dashboards faster—without compromising on performance, accessibility, or customization.",
    category: "blocks",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "unknown",
    tags: ["dashboard"],
  },
  {
    name: "usva",
    homepage: "https://usva.build",
    summary:
      "Three-theme React design language on one token vocabulary with WebGL atmospheres",
    description:
      "A React design language in three themes, where kajo is atmospheric and dark, sisu is dense and quick, and savi is the light ground. One token vocabulary underneath, including WebGL atmospheres that honour reduced-motion. Every component installs from npm or copies in from this registry.",
    category: "theming",
    frameworks: ["react"],
    base: "unknown",
    pricing: "unknown",
    tags: [],
  },
  {
    name: "atelier",
    homepage: "https://www.atelier-ui.com",
    summary:
      "WebGL and Motion system: shader, cursor, scroll effects and 3D galleries on one canvas",
    description:
      "A WebGL and Motion system for React that runs many effects on one shared canvas. Shader, cursor, scroll and text effects, 3D galleries, plus page transitions for Next.js. Built with Three.js, React Three Fiber, Motion, and Lenis smooth scroll.",
    category: "3d",
    frameworks: ["react"],
    base: "none",
    pricing: "freemium",
    tags: [],
  },
  {
    name: "mediadrop",
    homepage: "https://www.mediadrop.dev",
    summary:
      "Drag-and-drop file upload blocks: dropzone, avatar, multi-file, direct-to-S3",
    description:
      "Drag-and-drop file upload blocks for React built on react-mediadrop — dropzone, avatar uploader, multi-file upload form, and direct-to-S3 upload.",
    category: "media",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: [],
  },
  {
    name: "ai2",
    homepage: "https://ai2.design",
    summary:
      "Agent-native design system: 51 base components on an OKLCH token layer",
    description:
      "Agent-native design system for the shadcn CLI: 51 base components with a full variant, tone and size matrix on an OKLCH token layer, plus 307 styled variations. MIT.",
    category: "components",
    frameworks: ["react"],
    base: "shadcn",
    pricing: "freemium",
    tags: ["open-source"],
  },
  {
    name: "whiskeyjack",
    homepage: "https://whiskeyjack.net",
    summary:
      "Tauri-first thumb-driven design system with pivot nav on a CSS-variable token pipeline",
    description:
      "A Tauri-first design system: thumb-first components with Metro-style pivot navigation, frosted bottom nav, and tap-again confirmations, on a CSS-variable token pipeline. Hardened across nine shipping apps before extraction.",
    category: "components",
    frameworks: ["react"],
    base: "unknown",
    pricing: "free",
    tags: ["mobile", "glass"],
  },
]
