/* The shadcn registry directory, mirrored for the internal browser at
   /internal/registries. Source: ui.shadcn.com/r/registries.json (264 entries,
   identical to shadcn-ui/ui apps/v4/registry/directory.json), fetched
   2026-08-01. `maintainer` and everything under it come from a per-registry
   audit — homepage, legal entity, GitHub org, search — re-checked by a second
   adversarial pass; `evidence` is what that pass stood on. */

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
export type Maintainer = "company" | "individual" | "solo-business" | "unclear"
export type EntityKind =
  | "agency-studio"
  | "big-tech"
  | "individual"
  | "oss-org"
  | "product-company"
  | "solo-business"
  | "startup-saas"
  | "unknown"
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
  maintainer: Maintainer
  /** The company or person behind it. */
  entity: string
  entityKind: EntityKind
  confidence: "high" | "low" | "medium"
  /** What the audit actually saw. */
  evidence: string
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
    maintainer: "individual",
    entity: "Mojtaba Beheshti",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Site footer credits "by Mojtaba Beheshti" linking to github.com/moji2002; source lives at github.com/moji2002/1st-pouf under MIT with no company, team or about page anywhere.',
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
    maintainer: "individual",
    entity: "Oliver (@7ovrui)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'Homepage footer reads "Built by Oliver" linking to x.com/7ovrui; contact is a single personal hello@7ovr.com address, and the site names no legal entity, team or GitHub org. Blocks are advertised as free.',
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
    maintainer: "individual",
    entity: "OrcDev (TheOrcDev)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      '8bitcn.com footer: "Built by OrcDev and Contributors", repo github.com/TheOrcDev/8bitcn-ui. orcdev.com is a personal-brand site written in first person singular ("I build, I break, I conquer", "15+ years in the code mines"), © 2026 OrcDev, no team/about page or legal entity.',
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
    maintainer: "solo-business",
    entity: "Tham Kei Lok (8StarLabs)",
    entityKind: "solo-business",
    confidence: "medium",
    evidence:
      'ui.8starlabs.com and its /docs path both return HTTP 403 to fetch. I fetched the parent brand 8starlabs.com directly: it self-describes as "an independent software studio based in Singapore" shipping two products (8StarLabs UI, Canopy), and the footer reads "Copyright © 2026 Tham Kei Lok. All rights reserved." There is an FAQ item literally titled "Who runs 8StarLabs?" — a question a multi-person company would not need. No team page, no legal entity, one named human. Solo-business confirmed.',
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
    maintainer: "company",
    entity: "Abstract Foundation",
    entityKind: "product-company",
    confidence: "high",
    evidence:
      "I fetched github.com/Abstract-Foundation directly: it is a GitHub organization with 26 repositories, 746 followers, a registered location of Cayman Islands, and website abs.xyz — the Abstract L2 blockchain platform. The registry repo agw-reusables sits in that org and documents itself at build.abs.xyz. Repos include agw-sdk, agw-contracts, abstract-node and abstract-docs, i.e. real protocol infrastructure, not a hobby project. Company confirmed.",
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
    maintainer: "individual",
    entity: "Antonio Brandao",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'abui.io states "Components, blocks, and utilities by Antonio Brandao" and links his personal github.com/antoniobrandao and @antonio_brandao X account. No company, team or legal entity on the site.',
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
    maintainer: "company",
    entity:
      "Aceternity (Aceternity Labs LLC / Aceternity Solutions Private Limited), founder Manu Arora",
    entityKind: "agency-studio",
    confidence: "high",
    evidence:
      'I actively tried to refute this as a solo dev with an LLC wrapper — the refutation failed. ui.aceternity.com footer: "© 2026 Aceternity Labs LLC. All Rights Reserved."; aceternity.com footer names "Aceternity Solutions Private Limited". Decisively, a Starter Story interview with founder Manu Arora states Aceternity is now a team of six — 2 front-end engineers, 1 full-stack engineer, 1 designer, 1 social media manager, 1 product manager — and that he hired his first full-time employee to take over client work. Two legal entities plus actual employees. (Note: the "Alex" the prior agent cited is chat-mockup copy, not a person — but the team evidence stands independently.)',
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
    maintainer: "individual",
    entity: "Miracle Onyenma (aevrHQ)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'ui.aevr.space root now serves a "this domain may be for sale" parking page (the registry lives at v1.ui.aevr.space), so no site-side credits. Source is github.com/aevrHQ/ui, generated from shadcn-ui/registry-template; the aevrHQ org has bio "Crafting beautiful experiences", site aevr.online, 3 followers and one visible member, @miracleonyenma (a frontend developer/designer whose profile lists @aevrHQ). No legal entity or team page found.',
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
    maintainer: "individual",
    entity: "Aniket Pawar (Shadcn Labs)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'agentcn.vercel.app redirects to agentcn.run; repo is github.com/shadcn-labs/agentcn (MIT, generated from shadcn-labs/startercn). The org\'s site shadcn-labs.com has a TEAM section listing exactly one person, Aniket Pawar, with footer "Shadcn Labs 2026" and no incorporation details — an OSS personal brand, not a company.',
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
    maintainer: "company",
    entity: "LiveKit",
    entityKind: "startup-saas",
    confidence: "high",
    evidence:
      'Fetched livekit.com/ui directly: footer reads "© 2026 LiveKit. Engineered and designed worldwide." with /about and /careers links and a github.com/livekit org link. A careers page and a corporate about page are direct evidence of a multi-person funded company; LiveKit is the well-known real-time voice/video infrastructure vendor. Company confirmed.',
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
    maintainer: "unclear",
    entity: "unknown",
    entityKind: "unknown",
    confidence: "low",
    evidence:
      'I retried independently: webllm.org/ and www.webllm.org/blocks both return only a JS shell with the title "WebLLM - Browser-Native AI Protocol" and no footer, author, GitHub link or about section. Four searches surfaced nothing tying the domain to any person or org, and registry.directory has no ai-blocks/webllm entry. The github.com/webllm org (renderify, browser-use, webblackbox; one visible member @unadlib, contact unadlib@gmail.com) links to webllm.github.io, not webllm.org, and renderify\'s README never mentions webllm.org, ai-blocks or shadcn — so I could not confirm that org owns the domain. Note the confusable mlc-ai/web-llm project is unrelated. Genuinely unclear.',
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
    maintainer: "company",
    entity: "Vercel",
    entityKind: "startup-saas",
    confidence: "high",
    evidence:
      'Fetched github.com/vercel/ai-elements directly: the repo lives in the official Vercel GitHub organization and its README states AI Elements was "Made with ❤️ by Vercel". It is the companion component registry to Vercel\'s AI SDK, a commercial product line. Vercel is a large funded company. Confirmed.',
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
    maintainer: "individual",
    entity: "uiNerd (github.com/uiNerd16)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'The site states explicitly: "One person. AI Canvas is a solo project, built and cared for one component at a time." Footer is "© 2026 AI Canvas" with no legal entity; links go to github.com/uiNerd16/aicanvas and X handle @uiNerd. Free and open source.',
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
    maintainer: "company",
    entity: "Algolia",
    entityKind: "startup-saas",
    confidence: "high",
    evidence:
      "Fetched github.com/algolia/sitesearch: the repo exists inside the official Algolia GitHub organization, describes itself as combining Algolia's InstantSearch and Ask AI, and requires an Algolia account as a prerequisite. The docs site is on Algolia's own domain (sitesearch.algolia.com). This is a first-party artifact of an established commercial search vendor. Confirmed.",
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
    maintainer: "individual",
    entity: "Ali Imam",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'aliimam.in returned HTTP 402 to fetch; search confirms it is the personal portfolio of Ali Imam, a graphic designer/design engineer based in Bokaro Steel City, India ("Design Without Limits | Ali Imam"), with personal GitHub accounts aliimam-in and designali-in/aliimam. He runs personal brands (@designali_in, @dalim_in) but no company entity or team is evidenced.',
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
    maintainer: "individual",
    entity: "Subhan (github.com/Subhan-code)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      "The site itself shows only the product tagline with no footer, about page or copyright. The registry endpoint resolves to raw.githubusercontent.com/Subhan-code/Amicro--Micro-transitions-/main/registry/{name}.json, i.e. a single personal GitHub account; no organization or legal entity found.",
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
    maintainer: "individual",
    entity: "Alexandre Schrammel",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Footer reads "© 2026 Alexandre Schrammel" and "Created with care and love by ale.design"; MIT-licensed, repo at github.com/TheAleSch/amplo-picker. ale.design is a personal brand, not a registered company, and no team is listed.',
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
    maintainer: "individual",
    entity: "Skyleen (github.com/imskyleen)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      "The homepage renders client-side and shows only an @animate_ui X link; the GitHub repo (animate-ui, ~4.1k stars) is owned and maintained by the single personal account imskyleen, with community contributors but no organization members, legal entity or team page.",
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
    maintainer: "individual",
    entity: "Garvit (github.com/Garvit1000)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      "animbits.dev is JS-only and exposed no footer, about page or copyright on fetch. The shadcn registry-directory submission (shadcn-ui/ui issue #8898) for @animbits was opened by the personal GitHub account Garvit1000; no company, org or team is referenced anywhere.",
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
    maintainer: "individual",
    entity: "Dylan Mérigaud",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'The site credits Dylan Mérigaud, "freelance AI full-stack engineer (ex-Pivot, procurement fintech)", says the components were extracted from his own Ledgerloop project, is MIT-licensed and hosted under the personal GitHub account DylanMerigaud. No company entity or team.',
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
    maintainer: "company",
    entity: "Arc Studio",
    entityKind: "agency-studio",
    confidence: "medium",
    evidence:
      'I tried to refute this as a one-person studio and it survived, but narrowly. witharc.co is a client-services design studio ("a small studio designing brand, product, and web for early-stage startups, including 10+ Y Combinator companies"), footer "© Arc Studio", live careers page advertising a Designer role, Instagram/X presence based in Istanbul. Two people are attached to Arc: Omer Ozkok (omeroztok@witharc.co, the contact) and Emir (@emirayaaz, linked at page bottom and praised in a client testimonial as "both a developer and designer"). Correction to the prior agent\'s evidence: the testimonial names on the page (Guillermo Rauch/Vercel, Emir Karabeg/Sim, Adi Singh/AgentMail, etc.) are clients, not staff — the multi-person case rests only on Omer + Emir. No legal entity is published, so this sits close to the solo-business line.',
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
    maintainer: "individual",
    entity: "Asanshay Gupta",
    entityKind: "individual",
    confidence: "high",
    evidence:
      "The docs site carries no company, team or copyright info; the shadcn registry-directory issue #8936 was filed by SuperAce100 and names @asanshay as registry owner. Search confirms Asanshay Gupta, a Stanford CS student (asanshay@stanford.edu) whose personal site asanshay.com lists this design system among his projects.",
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
    maintainer: "company",
    entity: "assistant-ui (Y Combinator-backed)",
    entityKind: "startup-saas",
    confidence: "high",
    evidence:
      'Fetched github.com/orgs/assistant-ui/people directly: three public org members — Simon Farshid (@Yonom), Bassim Shahidy (@AVGVSTVS96), Shobhit Patra (@ShobhitPatra). The repo README carries a "Backed by Y Combinator" badge, sells a paid "Assistant Cloud" managed service alongside the MIT core, offers a Contact Sales / booking flow, and lists production users (LangChain, Mastra). Funded startup with a named multi-person team. Confirmed.',
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
    maintainer: "company",
    entity: "Okta, Inc. (Auth0)",
    entityKind: "big-tech",
    confidence: "high",
    evidence:
      'Fetched auth0.com: footer reads "© 2026 Okta, Inc. All Rights Reserved." with links to corporate agreements, terms, privacy choices, status page and multi-language versions. Auth0 is Okta\'s identity product line; Okta is a publicly traded company. Confirmed.',
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
    maintainer: "individual",
    entity: "Joe (first name only; no surname or company given)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'The page credits itself explicitly: "Built independently for shadcn/ui by Joe." plus a credit to @gunnargray for inspiration. No company, no legal entity, hosted on a free vercel.app subdomain.',
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
    maintainer: "individual",
    entity: "akash3444 (personal GitHub account)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      "basecn.dev has no about/team page, no company name and no footer copyright; its only attribution is the GitHub link https://github.com/akash3444/basecn — a personal user account, not an org.",
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
    maintainer: "individual",
    entity: "Zach Wagner (GitHub @zwgnr)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'baselayer.dev shows no company, team or copyright; the repo is https://github.com/zwgnr/BaseLayer. The GitHub profile zwgnr is a personal account: "Zach Wagner", Miami, personal site zachwagner.dev, with BaseLayer as his pinned project alongside hobby repos.',
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
    maintainer: "solo-business",
    entity: "Beste — Uğur Sözen",
    entityKind: "solo-business",
    confidence: "medium",
    evidence:
      'Fetched ui.beste.co: footer "© 2026, Beste. All rights reserved.", contact only via X @withbeste and GitHub, MIT free tier with a paid commercial licence for Pro blocks — a real commercial product. Fetched github.com/beste-co: it is an organization but with no publicly listed members, one visible repo (beste-ui), contact hello@beste.co. The only human found is Uğur "ziegfiroyt" Sözen, whose personal profile page lives on the same domain at zieg.beste.co listing his own GitHub/LinkedIn/X. One person, commercial brand, no team. Solo-business confirmed.',
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
    maintainer: "individual",
    entity: "Nic13Gamer (personal GitHub account)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'better-upload.com carries no company name, footer copyright or "built by" credit; the only attribution is the repo link https://github.com/Nic13Gamer/better-upload, a personal user account. Free MIT-style OSS library, no pricing or entity.',
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
    maintainer: "individual",
    entity: "Saurabh (X @saurra3h, GitHub starc007)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'beui.dev footer states "Created by Saurabh" linking to x.com/saurra3h and "© 2026 beUI. MIT License."; source lives at github.com/starc007/ui-components, a personal account. No company or team.',
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
    maintainer: "company",
    entity: "Dodo Payments",
    entityKind: "startup-saas",
    confidence: "high",
    evidence:
      "Fetched github.com/dodopayments/billingsdk: the repo sits in the Dodo Payments company GitHub org and is described as a billing/subscription component library for React; the README notes it is part of the Vercel OSS Program. It is the companion UI library to Dodo Payments' commercial merchant-of-record payments product, so this is a first-party company artifact. Confirmed.",
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
    maintainer: "individual",
    entity: "Matt (GitHub @uixmat)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'CORRECTED from solo-business. The prior verdict rested on "runs a hosted commercial SaaS (app.bklit.com)" — that is refuted: Bklit Analytics has been discontinued (hosted service, npm packages and self-hosted infra no longer maintained) and it was free during its entire beta with no paid tier ever activated. What remains is bklit-ui, MIT-licensed chart components; the Studio is source-available-proprietary ("you may not reuse, resell, or redistribute Studio without written permission") but is not sold, and bklit.com/pricing 404s. The site footer says simply "built by uixmat"; github.com/bklit has no public members; github.com/uixmat is Matt, a solo "Design Engineer" in Bulgaria, sponsored by the Vercel OSS Program and himself sponsoring shadcn. No commerce, no team — a personal OSS project.',
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
    maintainer: "individual",
    entity: "Ephraim Duncan",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'blocks.so states "Built by Ephraim Duncan" linking to his personal site ephraimduncan.com, footer "© 2026 Blocks.so", source at github.com/ephraimduncan/blocks. Free and open source, no company.',
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
    maintainer: "individual",
    entity: "Leonel Ngoya (lndev)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Footer: "© 2026 blockus. Built by Leonel Ngoya" linking to his personal site lndev.me, header says "by lndev-ui", contact is a personal gmail address and @ln_dev7 on X. No company entity or team.',
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
    maintainer: "individual",
    entity: "Aniruddha Agarwal (GitHub ANIBIT14)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      "boldkit.dev itself carries no attribution, copyright or team page. Search shows the source is github.com/ANIBIT14/boldkit (personal account) and the author announced it on DEV Community as Aniruddha Agarwal; the library is described as free and open source, no pricing or legal entity.",
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
    maintainer: "individual",
    entity: "Ben Swerdlow (X @benswerd)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'Site is on his personal domain swerdlow.dev and the only credit is "◆ @benswerd · freestyle (freestyle.sh)". Freestyle appears as the author\'s affiliation/link, not as the owner: no company copyright, no company GitHub org, no team page.',
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
    maintainer: "solo-business",
    entity: "Bundui (operator's real name not disclosed)",
    entityKind: "solo-business",
    confidence: "medium",
    evidence:
      'bundui.io is not fetchable, so I verified on GitHub: github.com/bundui is a personal user account (not an organization) — 8 repos, 304 followers, personal achievement badges (Pull Shark, Starstruck), bio "Discover a curated collection of over 100 handcrafted UI components…". The same profile links three commercial template businesses it operates: shadcnuikit.com, lensthemes.com and ecommercekit.dev, plus X @bunduidotio. A paid-template business run from one personal account with no named team or legal entity. Solo-business confirmed.',
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
    maintainer: "individual",
    entity: "David Haz (GitHub DavidHDev, X @davidhdev)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      "canvasui.dev could not be fetched (domain verification blocked); the repo github.com/DavidHDev/canvas-ui is a personal account belonging to David Haz (also creator of React Bits), licensed MIT + Commons Clause, free to use, with no company backing, sponsors or team listed.",
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
    maintainer: "individual",
    entity: "Ali Hussein (GitHub Ali-Hussein-dev)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'cardcn.dev could not be fetched (domain verification blocked). Search shows the source at github.com/Ali-Hussein-dev/cardcn — a personal account — described as "Free collection of beautiful shadcn cards". No company or paid product found.',
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
    maintainer: "individual",
    entity: "Amarnath Dhumal (@AmarnathDhumal)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'I reached the site this time: www.chamaac.com footer reads "Built with Love by Amarnath" linking to x.com/AmarnathDhumal, and the FAQ answers "Is it free to use?" with testimonials referencing components being free on chamaac.com — no pricing, no Pro tier, so not a commercial brand. The source repo is github.com/amarnathdhumal/chamaacui, a personal account, MIT-licensed, with chamaac.com in the About field and no corporate mention. Individual confirmed; raising confidence from the prior agent\'s low.',
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
    maintainer: "company",
    entity: "Channel3",
    entityKind: "startup-saas",
    confidence: "high",
    evidence:
      'Fetched trychannel3.com/developers/ui: the page carries "Channel3 raises $6M to power product discovery for agentic commerce", recognition in the Awin Power 100, SOC 2 & GDPR compliance statements, terms of service and privacy policy, API reference and brand directory. SOC 2 and a priced funding round are things only a real company has. The registry is described as open-source React components "typed against the Channel3 SDK", i.e. a first-party companion to the commercial API. Confirmed.',
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
    maintainer: "company",
    entity: "Clerk",
    entityKind: "startup-saas",
    confidence: "high",
    evidence:
      "Fetched the docs page: it is hosted on clerk.com's own documentation domain and documents Clerk's official shadcn registry — a quickstart package plus individual sign-in/sign-up/waitlist pages and ClerkProvider/middleware components that bootstrap Clerk auth. First-party artifact of Clerk, the commercial authentication/user-management SaaS. Confirmed.",
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
    maintainer: "solo-business",
    entity: "Cnippet (operator not disclosed)",
    entityKind: "solo-business",
    confidence: "low",
    evidence:
      'Verdict stands but the reasoning needed fixing, and I found a trap. Searches surface a "Cnippet team" page naming a CEO/founder "Patrick Stewart" plus content directors and engineering leads — I checked it and it is fictional demo data inside a team-section UI component that cnippet.dev published to 21st.dev, not a real roster. Real evidence: cnippet.dev, ui.cnippet.dev all return 403; github.com/cnippet-dev is an organization but with no public members at all, 5 repos, bio "Build stunning web applications with Cnippet⚡", socials @cnippet_dev. The product sells premium components/blocks (blocks.cnippet.dev) aimed at agencies and teams. A commercial brand with zero verifiable humans — closest to solo-business, but I cannot rule out a small undisclosed team.',
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
    maintainer: "unclear",
    entity: "unknown",
    entityKind: "unknown",
    confidence: "low",
    evidence:
      'Re-verified independently: cognicatch.dev returns HTTP 403 Forbidden to fetch, and two fresh searches ("cognicatch.dev shadcn registry components author github", "cognicatch github registry UI") returned zero results referencing the project — no GitHub account, org, author, company or even a product page. No maintainer evidence exists in public indexes. Unclear confirmed.',
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
    maintainer: "solo-business",
    entity: "Logging Studio — Arif (@ariflogs)",
    entityKind: "solo-business",
    confidence: "medium",
    evidence:
      'Verified on GitHub rather than the unreachable domain. github.com/Logging-Studio/commercn ("ShadCN UI Blocks for E-commerce Websites", MIT, 72 stars) sits in the Logging-Studio org; the org profile says "Building the coolest tools for developers", lists website loggingstudiio.com, contact email arif@retroui.dev, and socials youtube.com/@ariflogs and x.com/@ariflogs — every channel points to the same single person, Arif, who also runs the commercial RetroUI brand. 18 followers, one public member. One person operating a studio brand with paid products. Confirmed.',
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
    maintainer: "individual",
    entity: "Harsh Jadhav",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'componentry.fun 301-redirects to componentry.dev, whose footer reads "© 2026 Componentry. Created by Harsh Jadhav" (x.com/harshjdhv), repo at github.com/harshjdhv/componentry, personal gmail contact. Vercel OSS Program backing only, no company entity.',
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
    maintainer: "individual",
    entity: "@agonist42 (agonist)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      "contentbit.dev credits a single maintainer, @agonist42 on X, with source at github.com/agonist/contentbit, MIT licensed. No company, team, or legal entity anywhere on the site.",
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
    maintainer: "individual",
    entity: "Liam Corrigan",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'ui.corr.sh itself returned essentially no identifying content. The parent domain corr.sh is a personal site identifying "Liam Corrigan — Engineer"; the domain name matches his surname and a matching GitHub account (lcorrigan) exists. No company, team page, or org found.',
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
    maintainer: "company",
    entity: "coss.com (Cal.com's holding company)",
    entityKind: "startup-saas",
    confidence: "high",
    evidence:
      'github.com/cosscom hosts the `coss` repo (10.4k stars, AGPL-3.0) described verbatim as "coss.com/ui is the official design system of Cal.com"; search confirms coss.com is the new holding company of Cal.com, and Cal.com\'s changelog documents migrating its whole app onto coss.com/ui. Note the coss.com/ui footer itself is coy — only "© 2026 coss.com – open source, open heart, open mind" — but the Cal.com/commercial-entity link is solid. CONFIRMED (entity name sharpened: the owner is coss.com, the holdco, not Cal.com the product).',
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
    maintainer: "company",
    entity: "Creative Tim (CREATIVE CODE SRL)",
    entityKind: "product-company",
    confidence: "high",
    evidence:
      'creative-tim.com/about-us names the legal entity CREATIVE CODE SRL, VAT RO32193813, reg. J40/4367/30.03.2017, address Dionisie Lupu 56, Bucharest, and shows a 9-person team roster (co-founder Alex, developers, UI/UX designer, office manager). The /ui page is the company\'s own registry ("by Creative Tim"). CONFIRMED, with a registered legal entity the prior agent had not found.',
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
    maintainer: "individual",
    entity: "Jon Coronel",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'www.cubby-ui.dev was blocked by domain verification, but cubby-ui.dev fetched fine: footer reads "© 2026 Cubby UI · MIT licensed" with source at github.com/joncoronel/cubby-ui — a personal GitHub account, no org, team, or company entity named.',
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
    maintainer: "individual",
    entity: "Jordan Gilliam (nolly-studio)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'cult-ui.com was blocked by domain verification; via search, the repo is github.com/nolly-studio/cult-ui and the GitHub profile nolly-studio is an individual user account (name "jordan", bio "Cooking", 11 repos) rather than an org. Search results credit Jordan Gilliam as creator. "Studio" is branding on a solo account; could not verify paid offerings.',
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
    maintainer: "individual",
    entity: "Darshit (Design Engineer, darshitdev.in)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'darshitdev.in was blocked by fetch; search shows the site titled "Arts – Darshit | Design Engineer" — a personal portfolio domain of a design engineer/full-stack dev whose /arts section hosts his custom shadcn components. No company or team.',
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
    maintainer: "individual",
    entity: "Koishore Roy (Delego-Dev)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'The Delego-Dev GitHub org has tiny traction (delego 25 stars, registry 2 stars) and one visible member, koishore (Koishore Roy, Bengaluru). delegohq.com lists pricing tiers and a careers page but the footer contact is a personal gmail (koishore@gmail.com) and everything commercial is marked "coming soon" — no legal entity or named team.',
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
    maintainer: "individual",
    entity: "Patrick Prunty",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'deltacomponents.dev footer reads "Developed by Patrick Prunty" with source at github.com/pprunty/deltacomponents.dev — a personal account. No company, team, or pricing.',
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
    maintainer: "individual",
    entity: "Sean (devl.dev)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'devl.dev presents itself as "Sean\'s scratch pad" — "158 design experiments, two years deep" — and explicitly calls Cal.com "the day job". No company entity, team page, copyright footer, or pricing for the registry itself.',
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
    maintainer: "individual",
    entity: "sadmann7 (Sadman)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      "diceui.com returned HTTP 526 (origin cert error). The project repo github.com/sadmann7/diceui is owned by the individual developer sadmann7 (2k stars, 87 forks), with primary maintenance by that single personal account and no org or company.",
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
    maintainer: "individual",
    entity: "Dave (David) Klein",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'diklein.com is a personal portfolio: "UX designer, photographer, and writer" who "designs software and leads a team of designers at ServiceNow"; footer reads "Designed, researched, and written by David Klein". No studio or company entity.',
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
    maintainer: "individual",
    entity: "Dominik Koch",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      "The /ui page gave no ownership details, but it sits on the personal domain dominikkoch.dev of Dominik Koch (GitHub DominikKoch), a software engineer who lists shadcn/ui and nuqs contributions on his personal site. No company branding on the registry; his LinkedIn lists a separate venture (Rivo), unrelated to this registry's domain.",
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
    maintainer: "solo-business",
    entity: "Doras.to (Tommy/Thomas Lundy)",
    entityKind: "solo-business",
    confidence: "low",
    evidence:
      'ui.doras.to carries no ownership info at all (no footer credit, no company, no GitHub link); github.com/dorasto is an Ireland-based org for the doras.to link-in-bio/social SaaS with zero public members, and github.com/dorasto/ui has no description or README credits. Only named person anywhere is Tommy Lundy (Cork, Ireland), described as "Founder & Admiral of the Fleet" on GitHub but "Co-founder of Doras.to" on LinkedIn — that co-founder title is unrefuted evidence of a possible second person, and no legal entity, About page, or team roster exists. Commercial brand, one visible operator: solo-business stands, but confidence lowered to low given the co-founder wording and the total absence of ownership disclosure.',
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
    maintainer: "individual",
    entity: "Shawn (@zzzzshawn)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Site footer credits "by shawn." with links to x.com/zzzzshawn and github.com/zzzzshawn/matrix; hosted on his personal zzzzshawn.cloud domain. Free and open-source, no company mentioned.',
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
    maintainer: "individual",
    entity: "DSikeres1",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Hosted on a personal GitHub Pages account; footer reads "Copyright © 2026 DSikeres1. All rights reserved." with a link to the personal GitHub repo. No company or additional authors.',
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
    maintainer: "solo-business",
    entity: "Efferd (Shaban, @shabanhr)",
    entityKind: "solo-business",
    confidence: "high",
    evidence:
      'efferd.com footer: "© 2026 Efferd. Built by Shaban", linking his personal GitHub and X (@shabanhr), contact mail@efferd.com. /pricing sells one-time Pro ($147) and Team ($497) licences processed by a third-party merchant (Inflow). No About/Team page, no second person, no Inc/Ltd/LLC anywhere. CONFIRMED.',
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
    maintainer: "individual",
    entity: "Ehsan Ghaffar",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Footer states "Built by Ehsan. MIT License", linking github.com/ehsanghaffar and @ehsanghaffar on X, on his personal eindev.ir domain. No company affiliation.',
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
    maintainer: "individual",
    entity: "Karthik Mudunuri",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Footer attribution "Built by Karthik Mudunuri. The source code is available on GitHub" pointing to github.com/karthikmudunuri/eldoraui — a personal account. Open source, no company or team.',
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
    maintainer: "company",
    entity: "Crafter Station",
    entityKind: "oss-org",
    confidence: "high",
    evidence:
      'tryelements.dev footer credits Crafter Station with source at github.com/crafter-station/elements (519 stars). github.com/orgs/crafter-station/people lists exactly 8 public members (camilocbarrera, carlosdtn, cuevaio, EdwardR0507, Jibaru, MrUprizing, Railly, shiarauzo), and the org page describes a Peru-based "LatAm network of shippers" with 900+ builders, 50+ events, 25+ products, its own site and sponsors. Genuinely multi-person, so not an individual project; it is a collective/OSS org rather than a registered firm. CONFIRMED, confidence raised after verifying the member list directly.',
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
    maintainer: "company",
    entity: "ElevenLabs",
    entityKind: "startup-saas",
    confidence: "high",
    evidence:
      'github.com/elevenlabs/ui — the official ElevenLabs org, alongside their SDKs — README: "ElevenLabs UI is a component library built on top of shadcn/ui to help you build audio & agentic applications faster", footer "Engineered by ElevenLabs", MIT, 2.3k stars. Registry is served from the company\'s own ui.elevenlabs.io subdomain. ElevenLabs is a heavily funded commercial AI-audio company. CONFIRMED.',
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
    maintainer: "individual",
    entity: "shatlyk1011 (Shatlyk)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      "emerald-ui.com links source to the personal GitHub account github.com/shatlyk1011/emerald-ui; no company name, team/about page, or footer copyright entity anywhere on the site.",
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
    maintainer: "individual",
    entity: "Eric Tsai (EricTsai83)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Site is on the personal domain ericts.com and credits the single GitHub account EricTsai83; it has a "Special thanks" section to shadcn/Emil Kowalski/Manu Arora, and no company, team, or legal-entity notice.',
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
    maintainer: "individual",
    entity: "TommyBez (Tommy)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'On evex.sh every listed agent recipe shows author "TommyBez", the repo link is the personal account github.com/TommyBez/evex, and the social credit is x.com/TommyBez85. No company or team is named.',
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
    maintainer: "individual",
    entity: "Jay Sharma (radiumcoders)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'The docs URL 307-redirects to evilbuttons.com/docs, which credits @radiumcoders and links github.com/sponsors/radiumcoders. github.com/radiumcoders is a personal user account named Jay Sharma (bio "work work", no company field).',
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
    maintainer: "individual",
    entity: "legions-developer",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      "evilcharts.com shows no company, team, or copyright entity; the only attribution is a GitHub link to github.com/legions-developer/evilcharts, which GitHub renders as a personal user account (the only org mentioned is Vercel via an OSS-program sponsorship badge).",
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
    maintainer: "company",
    entity: "ExaWizards Inc.",
    entityKind: "product-company",
    confidence: "high",
    evidence:
      'The kit is served from the corporate domain exawizards.com, states it was "built by the designers of ExaWizards", and carries a copyright notice naming ExaWizards Inc. with links to the corporate site and privacy policy. exaBase is ExaWizards\' commercial AI product line (ExaWizards is a listed Japanese AI company). CONFIRMED.',
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
    maintainer: "company",
    entity: "Extend (Extend AI)",
    entityKind: "startup-saas",
    confidence: "high",
    evidence:
      'ui.extend.ai states the library was created by Extend with source under the GitHub org extend-hq. extend.ai is a B2B document-processing API company: footer "© 2026 Extend", Company > Careers link, Terms & Privacy, pricing tiers, dashboard.extend.ai, SDKs, SOC 2 / HIPAA / GDPR, and named customers (Brex, Mercury, Flatiron). The registry is a companion to the commercial product. CONFIRMED.',
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
    maintainer: "individual",
    entity: "Dimitrios C. (triatetarta)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'fab-ui.com names no company, team, or copyright holder; its only attribution is github.com/triatetarta/fab-ui. That GitHub account is a personal profile: "Dimitrios C. — Frontend Engineer based in London, UK", 11 followers, no company field.',
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
    maintainer: "individual",
    entity: "ridemountainpig (Yen-Cheng)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      "WebFetch of flightcn.yencheng.dev returned 403, so I searched: the repo is the personal account github.com/ridemountainpig/flightcn, and the docs are hosted on the maintainer's own personal domain yencheng.dev. No company anywhere; it is a companion add-on to the third-party mapcn project.",
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
    maintainer: "individual",
    entity: "KushalXCoder (Kushal)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'The vercel.app domain was blocked by fetch policy, so I searched: the project is github.com/KushalXCoder/flowui, a personal GitHub account, described as "A UI library built on top of shadcn". Registry is a free Vercel deployment with no company, team, or paid product.',
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
    maintainer: "individual",
    entity: "vzkiss",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'The domain was blocked by fetch policy; search confirms the repo is github.com/vzkiss/flowkit-ui (personal account) and the docs sit on that same person\'s subdomain flowkit-ui.vzkiss.com. Tagline "built by vzkiss"; no company or team found.',
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
    maintainer: "individual",
    entity: "Micka Touillaud (mickadesign)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'fluidfunctionalism.com was blocked by fetch policy; search shows the repo is github.com/mickadesign/fluid-functionalism. That GitHub profile is a personal account (bio "👓", San Francisco, personal site micka.design, X @micka_design, 26 followers) with no company field, and the kit is free/open-source.',
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
    maintainer: "individual",
    entity: "Felipe Menezes",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'ui.flexnative.com footer states "Built by Felipe Menezes" with source at the personal account github.com/felipemenezes098/ui-flx. No company name, legal entity, or copyright notice on the site.',
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
    maintainer: "individual",
    entity: "Dima Kapish (kapishdima)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      "The homepage fetch surfaced no attribution, so I searched: the project is github.com/kapishdima/fonttrio, a personal account, and coverage (InfoQ, shadcn's own X post crediting @kapish_dima) describes it as an open-source project by Dima Kapish. No company or team.",
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
    maintainer: "individual",
    entity: "Aman Shakya (amanshakya0018)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'forgeui.in returned 403 to WebFetch; search shows the registry directory entry maps to github.com/amanshakya0018/forgeui, a personal GitHub account, described as "A library of React components for smooth, fast front-end development". No company or team found.',
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
    maintainer: "individual",
    entity: "Ali Hussein (Ali-Hussein-dev)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'formcn.dev credits developer Ali Hussein (@alibey_10 on X, "available for hire"), source at the personal account github.com/Ali-Hussein-dev/formcn. Footer reads "© 2026 formcn" — a project name, not a legal entity.',
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
    maintainer: "individual",
    entity: "Aniket Pawar (Shadcn Labs)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'framecn.vercel.app redirects to framecn.dev (DNS failed for me), and the repo is github.com/shadcn-labs/framecn. shadcn-labs.com\'s team section lists exactly one person, Aniket Pawar; footer is "© Shadcn Labs 2026" — a personal brand, not a named legal entity, and the components are 100% free.',
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
    maintainer: "company",
    entity: "The Experience Company",
    entityKind: "startup-saas",
    confidence: "medium",
    evidence:
      'ui.heygaia.io states GAIA UI "was created by The Experience Company as part of their work on an open-source AI assistant called GAIA" and repeatedly says "the team". The Experience Company has its own GitHub org (github.com/theexperiencecompany, owner of the `gaia` repo) and site experience.heygaia.io describing "a team of hackers, engineers, and designers"; heygaia.io ships a commercial assistant with /about and /pricing pages. Multi-person and commercial, though no legal entity (Inc/Ltd) is published. CONFIRMED.',
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
    maintainer: "individual",
    entity: "slarity",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'gamekitui.com explicitly states it is "an independent, unaffiliated community project"; the only attribution is github.com/slarity/gamekit-ui, a personal GitHub account. No company name, copyright holder, or about/team section.',
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
    maintainer: "individual",
    entity: "Kaiden See",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'gamifykit.com footer reads "Built by Kaiden See" linking to his personal site kaiden.my; code lives at github.com/gamifykit (a project-name org). No legal entity, no pricing or terms page, no team.',
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
    maintainer: "individual",
    entity: "Mazyar Kawa",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'gammaui.com footer says "Engineered by Mazyar" linking to Mazyar Kawa\'s LinkedIn, with source at the personal account github.com/mazyar-kawa/gamma-ui. No company, legal entity, or copyright notice.',
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
    maintainer: "individual",
    entity: "binnodon",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      "Homepage is a JS-only GitHub Pages site that returned no readable content to WebFetch. Fallback check of https://github.com/binnodon shows a personal GitHub user account (not an org) with 4 public repos including gc-solid-ui (6 stars) plus forks of shadcn-ui and Nuxt; no company, bio, or team listed.",
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
    maintainer: "company",
    entity: "Crenspire Technologies",
    entityKind: "agency-studio",
    confidence: "high",
    evidence:
      'glass-ui.crenspire.com is a subdomain of the company\'s own site and credits "built by Akshay Joshi at Crenspire Technologies". crenspire.com is an AI-driven software/app development firm founded 2018, office at B-104 Titanium Heights, Corporate Road, Prahalad Nagar, Ahmedabad 380015, phone +919016374502, sales@crenspire.com, with /team and portfolio pages and named clients (Jio and others). Employer-hosted, not a personal side project. CONFIRMED.',
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
    maintainer: "individual",
    entity: "Alex Kostyniuk (kostyniuk)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Footer credit reads "Open source. MIT licensed. Made by kostyniuk", linking to the personal GitHub repo kostyniuk/glasscn-components and X handle @kostyniuk00. No company, team, or legal entity anywhere on the site.',
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
    maintainer: "individual",
    entity: "Dmitry Borisenko (goosen-x)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Footer says "© 2026 GooseUI. Open Source." with repo github.com/goosen-x/gooseui and contact info@gooseui.pro; no company or team page. The GitHub profile goosen-x is a personal account: Dmitry Borisenko, "Fullstack Developer | Next JS | Node JS", Moscow, 25 repos, 17 followers.',
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
    maintainer: "company",
    entity: "AntV Team, Ant Group",
    entityKind: "big-tech",
    confidence: "high",
    evidence:
      'The docs site states the project is maintained by the AntV Team and is "part of the broader AntV ecosystem by Ant Group", MIT-licensed; it is hosted on antv.vision and the source lives in the multi-maintainer org github.com/antvis (GPT-Vis). AntV is Ant Group\'s in-house data-visualization team. CONFIRMED.',
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
    maintainer: "individual",
    entity: "shoota",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'The homepage is a JS-rendered Storybook shell — WebFetch returned only the title "storybook - Storybook" and a raw curl found no footer/attribution markup. Fallback WebSearch surfaced a Zenn article by author "shoota" (zenn.dev/shoota) announcing this shadcn/ui reading theme; the site sits on his personal domain shoota.work. No company or team found.',
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
    maintainer: "individual",
    entity: "Subhadip Jana (Subhadipjana95)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'grootstudio.vercel.app 307-redirects to grootstudio.dev, whose footer reads "© 2026 Groot Studio. All rights reserved." and links to the personal GitHub repo github.com/Subhadipjana95/Groot-Studio and the personal LinkedIn linkedin.com/in/subhadipjana095. "Studio" is branding only — no team, about page, or legal entity.',
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
    maintainer: "individual",
    entity: "Joshua Chung (jchu634)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'WebFetch got HTTP 403; a direct curl of the page HTML shows the footer text "Created by Joshua Chung (JCHU634). MIT Licensed." plus a github.com/jchu634 link. The repo github.com/jchu634/ha-components is a personal user repo (not an org) pointing back to hacomponents.keshuac.com.',
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
    maintainer: "individual",
    entity:
      "unknown (single unnamed creator behind the headcodecms GitHub org)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'The site is written in the first person by one unnamed creator — "I have built websites for more than 20 years" and "Headcode CMS is my test of that future" — with no company name, legal entity, pricing, or imprint. The GitHub org github.com/headcodecms states "This organization has no public members", has 3 repos and 8 followers, and lists only office@headcodecms.com.',
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
    maintainer: "individual",
    entity: "Aniket Pawar",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Footer credits "aniket" linking to the personal portfolio aniketpawar.com; MIT licensed, funded via GitHub Sponsors and "Backed by Vercel OSS Program" (Spring 2026 cohort). No company, team, or legal entity on the site.',
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
    maintainer: "individual",
    entity: "Preet Suthar (preetsuthar17)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'Site states "Built by @preetsuthar17" (preetsuthar.me) with "Theme by @matsugfx"; source is at github.com/preetsuthar17/hextaui, a personal account. No copyright footer, company name, team, or legal entity found.',
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
    maintainer: "individual",
    entity: "Rion (ri0n.dev)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'Footer attribution reads "Design and Developed by Rion" linking to x.com/ri0n.dev; code lives at github.com/hexui-sh/ui, an org used as a project namespace. No company name, team/about page, pricing, terms, or copyright entity on the site.',
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
    maintainer: "individual",
    entity: "Mohammad Shehadeh",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'WebFetch returned HTTP 403 for both hirael.com and hirael.com/docs; a direct curl of the page HTML exposes the footer payload "© 2026 Mohammad Shehadeh · built on shadcn" alongside a github.com/mohammadshehadeh link. No company, team, or legal entity in the markup.',
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
    maintainer: "individual",
    entity: "Enes Gules (enesgules)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      "Site credits creator Enes Gules with the repo github.com/enesgules/hugeicons-animated under an MIT license (icons themselves are third-party Hugeicons). No company, legal entity, or team page appears anywhere on the site.",
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
    maintainer: "individual",
    entity: "Edwin Vakayil (edwinvakayil)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Footer reads "Built by edwinvakayil at Vercel" — that is the author\'s employer, not the project owner: the code is at the personal repo github.com/edwinvakayil/iconiq, and Vercel appears only as the Open Source Program (Spring 2026 cohort) backer. No separate legal entity or team.',
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
    maintainer: "individual",
    entity: "LN / ln-dev7",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'WebFetch returned HTTP 404 and a raw curl yielded no attribution markup (JS-only page). Fallback WebSearch shows the project repo is github.com/ln-dev7/icons-animated ("Meticulously crafted animated icons - based on lucide-animated.com"), a personal account, by LN (x.com/ln_dev7), on his personal lndev.me domain.',
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
    maintainer: "individual",
    entity: "Krishna Agarwal (krishnaagarwal1506)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Site explicitly disclaims institutional backing: "A community initiative — not affiliated with the Government of India", footer "© 2026 IndiaCN · MIT License · Made with care in Bharat". Maintained by Krishna Agarwal via the personal GitHub account krishnaagarwal1506; no company or government body.',
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
    maintainer: "company",
    entity: "Inference Shell Inc.",
    entityKind: "startup-saas",
    confidence: "high",
    evidence:
      "inference.sh/terms names the operator as Inference Shell Inc., a Delaware corporation, and states it is the merchant of record for all platform transactions. inference.sh is a commercial AI runtime (pay-per-execution pricing, hosted app, Teams tier, CLI, 30+ providers) and ui.inference.sh is its own registry subdomain with source at github.com/inference-sh. CONFIRMED, legal entity independently verified in the ToS.",
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
    maintainer: "individual",
    entity: "Irsyad (irsyad)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'Footer states "This project\'s crafted by Irsyad" (x.com/irsyad) with "2026 · Intent UI ™" and MIT-licensed source at github.com/intentui/intentui — an org used as a project namespace. No named team, about/careers page, or legal entity found.',
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
    maintainer: "individual",
    entity: "Justin Levine",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Footer reads "Built by Justin Levine. Open source, always." on his personal domain justinlevine.me; source at jal-co/ui, a namespace for his own initials. Community is a Discord server; no company, team, or legal entity named.',
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
    maintainer: "individual",
    entity: "johuniq",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'Page links to github.com/johuniq/jolyui (a personal GitHub account) with "Star on GitHub" and "MIT licensed - free for commercial use"; the same account also runs a related project, Wavee. No footer copyright entity, company name, or team page appears.',
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
    maintainer: "company",
    entity: "JOYCO Studio",
    entityKind: "agency-studio",
    confidence: "high",
    evidence:
      'registry.joyco.studio resolves to hub.joyco.studio, self-described as "a public knowledge HQ where our team shares and collaborates on internal components, tools, and resources" — i.e. a studio\'s internal component library exposed publicly (25 components, 21 toolbox items, 18 logs), with X/GitHub/Instagram links to JOYCO Studio and source under github.com/joyco-studio. A design/dev studio with a team, not a personal project. CONFIRMED.',
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
    maintainer: "individual",
    entity: "Fellipe Utaka",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Site footer reads "Built by Fellipe Utaka. The source code is available on GitHub" linking twitter.com/fellipeutaka and github.com/fellipeutaka/kanpeki — a personal GitHub account, no company or team page. (The "Team" cards showing Sarah Chen/Marcus Rivera are demo component data, not real staff.)',
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
    maintainer: "company",
    entity: "BetterGov.ph",
    entityKind: "oss-org",
    confidence: "high",
    evidence:
      "github.com/bettergovph/kapwa describes Kapwa as the design system for government portals used by BetterGov.ph, published to npm as @bettergov/kapwa under CC0, with a Code of Conduct, contribution guidelines, an active contributor base, and open recruitment of volunteers (developers, designers, writers, translators, QA) at volunteers@bettergov.ph. A volunteer-led multi-person civic-tech organization, not one person. CONFIRMED.",
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
    maintainer: "company",
    entity: "Shadcnblocks (founder Robert Austin)",
    entityKind: "product-company",
    confidence: "high",
    evidence:
      'kibo-ui.com now carries Shadcn UI Blocks branding and points to github.com/shadcnblocks/kibo (3.8k stars) — the registry sits in the Shadcnblocks org, not Hayden Bleasel\'s personal account. shadcnblocks.com/about names founder Robert Austin (@ausrobdev, started 2024) and lists a 12-person distributed team (Luis, Yassine, Mason, Rakesh, Yosra, Nader, Niko, Mateusz, Serge, Jannik, Callum), "profitable, bootstrapped", $1M ARR, selective hiring. Multi-person commercial business; no legal entity published, hence product-company rather than a verified registered firm. CONFIRMED.',
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
    maintainer: "individual",
    entity: "Jayant Acharya",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Site credit line reads "MIT · Jayant Acharya" and it is hosted on his personal domain itsjay.in. No company, team, about page or legal entity anywhere on the site.',
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
    maintainer: "individual",
    entity: "Dorian Baffier",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'Footer says "Built by Dorian Baffier" with @dorianbaffier on X; source at github.com/kokonut-labs/kokonutui and support credited to Vercel\'s OSS Program. "kokonut-labs" is a project namespace — no team, about page, or legal entity is named.',
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
    maintainer: "solo-business",
    entity: "Launch UI (Mikołaj Dobrucki)",
    entityKind: "solo-business",
    confidence: "high",
    evidence:
      "Homepage and /pricing credit exactly one person: Mikołaj Dobrucki (contact@mikolajdobrucki.com, twitter.com/mikolajdobrucki); repo at github.com/launch-ui/launch-ui. Paid tiers check out via launchui.lemonsqueezy.com (Lemon Squeezy is merchant of record); no About/Team page, no legal entity, no VAT, no second name anywhere on the site. Commercial but one-person. CONFIRMED.",
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
    maintainer: "individual",
    entity: "Paul Burke",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Footer reads "Built by Paul Burke. Source code available on GitHub" linking his personal site paulburke.co and the personal account github.com/iPaulPro/lens-blocks. No company, team, or entity mentioned.',
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
    maintainer: "individual",
    entity: "winoffrg (single developer)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Hosted on the personal domain winoffrg.dev; repo is github.com/winoffrg/limeplay and contact is "Reach out on X" at x.com/winoffrg. Footer only says "© 2026 Limeplay" — no company, team, or legal entity.',
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
    maintainer: "individual",
    entity: "yu5ag (single maintainer)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'The homepage is JS-only and yielded no attribution, so I checked GitHub: the liquefy-ui org shows "This organization has no public members", and the repo README\'s sponsors section states "Sponsorship goes to the maintainer rather than to an organisation; there is one of us", with the sponsor handle yu5ag. It also states it is "an independent open-source project".',
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
    maintainer: "individual",
    entity: "SiphoChris",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Site links github.com/SiphoChris/lmscn.git (a personal account) and the footer only reads "© 2026 lmscn. Built with shadcn/ui." No team page, company, or legal entity.',
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
    maintainer: "solo-business",
    entity: 'TurboStarter (Bartosz "Bart" Zagrodzki)',
    entityKind: "solo-business",
    confidence: "medium",
    evidence:
      'The registry source is github.com/turbostarter/loading-ui (440 stars, MIT, "Spinners, loaders and loading animations for modern web apps"), i.e. inside the org of the commercial TurboStarter SaaS boilerplate. turbostarter.dev sells $299/$449 lifetime licences and presents a single founder — Bart Zagrodzki, "a software engineer with 8+ years of experience" — with no team page, no co-founders, and no company entity named; support runs through his Discord/email. Commercial, one person. CONFIRMED (loading-ui.com itself blocks automated fetches, so this rests on the GitHub org and turbostarter.dev).',
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
    maintainer: "individual",
    entity: "Dmytro (@pqoqubbw)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'The site credits author @pqoqubbw linking x.com/pqoqubbw, and the MIT license points to github.com/pqoqubbw/icons — a personal account. Search confirms "Lucide-animated was created by dmytro, a design engineer" with the same @pqoqubbw handle. No company or team.',
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
    maintainer: "individual",
    entity: "patrick-xin",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Footer only shows "Lumi UI © 2026" with no entity; the GitHub link is github.com/patrick-xin/lumi-ui, a personal account with a single contributor. README credits only upstream projects (Base UI, shadcn/ui, Fumadocs) — no company or sponsor.',
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
    maintainer: "company",
    entity: "1771 Technologies",
    entityKind: "product-company",
    confidence: "high",
    evidence:
      'The homepage is the vendor\'s own corporate site ("1771 Technologies: LyteNyte, Fastest in Class React Data Grid") with pricing, docs, blog, demo and Contact Sales. github.com/1771-Technologies/lytenyte confirms a dual-licence commercial model: Core under Apache 2.0 and a paid PRO edition with 12 months of updates/support and organization plans for 50+ developer teams, maintained by 1771 Technologies. A real commercial software vendor. CONFIRMED.',
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
    maintainer: "solo-business",
    entity: "Magic UI (Dillion Verma)",
    entityKind: "solo-business",
    confidence: "medium",
    evidence:
      'CORRECTED from "company". magicui.design credits exactly one person — "Built by dillion" (twitter.com/dillionverma) — and has no About, Team, Careers, or Terms page and no legal entity anywhere; pro.magicui.design is a $199 one-time storefront with an affiliate program but likewise names no entity. github.com/orgs/magicuidesign/people lists only 2 public members (Beau Hayes-Pollard, Jinho) with no stated employment, and Dillion\'s own account describes building it alone for 8+ months before open-sourcing. Targeted searches for incorporation, funding, or hiring returned nothing. That is a commercial one-person product with a couple of collaborators, not a verified multi-person organization.',
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
    maintainer: "company",
    entity: "Manifest",
    entityKind: "startup-saas",
    confidence: "medium",
    evidence:
      'ui.manifest.build ("a shadcn/ui components library for building ChatGPT Apps", an official shadcn registry) is a subdomain of manifest.build, a commercial product — hosted cloud tier at app.manifest.build plus paid enterprise options and self-hosted Docker. The GitHub org github.com/mnfst (contact hello@manifest.build, site manifest.build) has multiple members (@brunobuddy, @SebConejo) and several maintained repos including the 7.4k-star flagship. Multi-person and commercial. I could not re-verify the prior agent\'s "250 Shattuck Avenue, Berkeley" footer or the SkyDeck/Inria backing, so the company verdict here rests on the org membership and commercial tiers rather than a named legal entity.',
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
    maintainer: "individual",
    entity: "Anmol Saini",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'GitHub link is github.com/AnmolSaini16/mapcn (personal account) with a GitHub Sponsors link; footer only says "© 2026 mapcn. All rights reserved." and it is described as "Free & open-source". No company, team, or about page.',
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
    maintainer: "individual",
    entity: "Mukesh (MK) Singh",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'mksingh.dev is a personal portfolio — "MK Singh, Staff Software Engineer", "FullStack Developer", GitHub github.com/MKSinghDev, status "open to work". The registry\'s own description calls it "A personal registry of production-ready ShadCN components and utilities."',
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
    maintainer: "individual",
    entity: "Blinks44 (personal GitHub account)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      "CORRECTED from unclear. WebFetch 403s but curl with a browser UA returns moduix.dev (200, 84KB); the ONLY external link in the page is https://github.com/Blinks44/moduix. The npm registry metadata for @moduix/react confirms repository git+https://github.com/Blinks44/moduix.git, sole maintainer 'blinks44' <blinks44@yandex.ru>, MIT license. That GitHub account is a personal profile with 8 repos (5 of them forks), 4 followers, no company/bio. No pricing, no team, no org, no legal entity anywhere.",
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
    maintainer: "individual",
    entity: "Rushil (@molecule-lab-rushil)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      "CORRECTED from unclear. GitHub API on molecule-lab/molecule-ui contributors returns exactly two entries: molecule-lab-rushil with 77 commits and vercel[bot] with 1 — one human, all the code. LICENSE reads 'Copyright (c) 2025 molecule-ui' (the project name, not a person or firm). The org's claimed website moleculelab.in does not resolve at all (DNS ENOTFOUND), and the org lists no public members. 'Molecule Lab' is one developer's namespace, not an organization.",
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
    maintainer: "solo-business",
    entity: "Julien Thibeaut (@ibelick)",
    entityKind: "solo-business",
    confidence: "high",
    evidence:
      "CONFIRMED. The repo is github.com/ibelick/motion-primitives — a personal account (bio 'function is beauty', Paris, site ibelick.com), alongside his other solo projects (ui-skills, prompt-kit, zola, webclaw). He runs the free motion-primitives.com plus the paid pro.motion-primitives.com selling templates. He describes a one-person design-engineering practice ('Interface Office'); no company page, no team, no legal entity, no multi-maintainer org.",
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
    maintainer: "solo-business",
    entity: "Sam (solo founder, Mozaika)",
    entityKind: "solo-business",
    confidence: "medium",
    evidence:
      "CONFIRMED, entity name corrected. Fetching mozaika.design/proof (24KB) shows the signature split across two nodes: '— Sam' and 'solo founder, building in the open' — the previous agent's 'Samsolo founder' was a concatenation artifact; the person is 'Sam'. Paid tiers ($59 one-time Founder License, $9/mo then $199/mo). /about, /terms and /pricing all serve the same 3.2KB JS shell with no legal entity, no company, no GitHub org.",
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
    maintainer: "individual",
    entity: "Siriwat K. (@siriwatknp)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Homepage credits the author as "@siriwatknp" linking to github.com/siriwatknp; no company, legal entity, team page or footer copyright anywhere on the site — just a community GitHub repo.',
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
    maintainer: "individual",
    entity: "senommu",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'Footer reads "Built by senommu" linking to github.com/senommu. The github.com/motoko-ui org has a single repo ("motokoui") and states "This organization has no public members" — no company, team or legal entity found.',
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
    maintainer: "individual",
    entity: "Navdeep Singh",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Site header names "Navdeep Singh", footer says "© 2026 Nav UI", the GitHub link points at the personal repo navdeepannu/portfolio, and socials are personal (LinkedIn navdeepsingh0, X navdeepannu0). Hosted on his personal domain navdeepsingh.dev.',
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
    maintainer: "individual",
    entity: "Chánh Đại (@iamncdai / github.com/ncdai)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Page states "Crafted by @iamncdai"; source is under the personal GitHub account github.com/ncdai, MIT licensed, hosted on the author\'s personal portfolio domain chanhdai.com. No company or team page.',
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
    maintainer: "individual",
    entity: "ekmas",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Homepage\'s only attribution is "Released under MIT License. The source code is available on Github" pointing to github.com/ekmas/neobrutalism-components — a single personal GitHub account. No footer entity, about/team page or company credit.',
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
    maintainer: "company",
    entity: "Neon (neon.com, serverless Postgres)",
    entityKind: "startup-saas",
    confidence: "high",
    evidence:
      "CONFIRMED. ui.neon.com returns 200 with <title>Neon UI — The UI layer for building with Neon</title>, served on Neon's own apex domain neon.com, and the page points its source at the neondatabase GitHub org. Install commands are `npx shadcn@latest add https://ui.neon.com/r/<name>.json`. It is a first-party companion registry to Neon's commercial serverless-Postgres platform, not a third-party project. (Note: github.com/neondatabase/ui returns 404 — the source repo is private or renamed — but domain ownership is decisive.)",
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
    maintainer: "individual",
    entity: "codewithmehmet",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      "Only maintainer signal on the site is the repo link github.com/codewithmehmet/nessra-ui (a single personal account). No company name, legal entity, about/team page, or footer copyright; the site is a free Vercel subdomain.",
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
    maintainer: "company",
    entity: "Avail (Avail Project)",
    entityKind: "startup-saas",
    confidence: "high",
    evidence:
      "CONFIRMED. elements.nexus.availproject.org 307-redirects to widgets.availproject.org — Avail's own domain. Avail Nexus ships from github.com/availproject/nexus-sdk and npm @avail-project/nexus, documented at docs.availproject.org. Avail is a funded blockchain-infrastructure company with a LinkedIn company page (linkedin.com/company/availproject); reported $27M led by Founders Fund and Dragonfly (the prior agent's ~$75M figure is not what I could source, but the company status is unaffected).",
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
    maintainer: "unclear",
    entity: "unknown",
    entityKind: "unknown",
    confidence: "low",
    evidence:
      "CONFIRMED unclear, with stronger negative evidence. The site is a commercial marketplace ('Nexus-UI · UI systems lab · A premium marketplace for animated interfaces', Pricing/Sign in/Dashboard, contact form, '© 2026 Nexus-UI'). Its footer 'GitHub' and 'X' icons link to the bare roots https://github.com and https://x.com — placeholder hrefs pointing at no account. /terms, /privacy, /about, /legal, /license and /refund-policy all 200 to the same JS shell with no entity text. registry.json declares name 'next-ui', homepage nexus-ui.com, and no author field. Fully anonymous operator; commercial signals suggest solo-business but nothing names anyone.",
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
    maintainer: "individual",
    entity: "Victor Williams (@victorcodess)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      "Site links source to github.com/victorcodess/nexus-ui and the social link goes to X account victorwilliams_ — a single personal account. No company name, legal entity, about page or footer copyright.",
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
    maintainer: "individual",
    entity: "vorhdam",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'Homepage credit reads "Built by vorhdam" (github.com/vorhdam), with source at github.com/nordaun/ui. "Nordaun" is a project GitHub org rather than a named legal entity — no about/team page, copyright statement, or company found.',
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
    maintainer: "company",
    entity: "nteract (open-source organization)",
    entityKind: "oss-org",
    confidence: "medium",
    evidence:
      'CONFIRMED, with a stronger link than the prior agent had. The registry manifest at nteract-elements.vercel.app/r/registry.json declares "name": "nteract" and "homepage": "https://nteract.io" — i.e. it self-identifies as an nteract artifact, not merely a downstream user. github.com/nteract is an established multi-person OSS org: 8 public members, 72 repos, and well-known projects (papermill 6.5k stars, hydrogen 4k, semiotic 2.7k). The site\'s only outbound repo link is github.com/runtimed/runt (Kyle Kelley et al.), the same community. No standalone \'elements\' repo is public, so the exact home repo remains unconfirmed.',
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
    maintainer: "individual",
    entity: "François Best (@franky47, 47ng)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'The registry page links only to github.com/47ng/nuqs; the 47ng org README says "I\'m François Best (@franky47), founder of 47ng, my freelancing company" and lists exactly one person (@franky47) under People, with "sponsor me on GitHub to help with maintenance" — a solo OSS maintainer, not a staffed company.',
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
    maintainer: "individual",
    entity: 'Kirman (@sukirman1901, "Nusaiba Studio")',
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'The homepage itself carries no maintainer, company or copyright info. The shadcn/ui registry PR adding @nusaiba was opened by github.com/sukirman1901, whose profile reads bio "Hi, I\'am Kirman", company field "Nusaiba Studio", location Indonesia, and website nusaiba.dev. "Studio" is self-declared branding by one person; no team or legal entity found.',
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
    maintainer: "individual",
    entity: "Shr3kx and iam-sahil",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Docs page states "Built by Shr3kx (x.com/shr3kxx) & iam-sahil (x.com/ctrlcat0x)." Source lives at github.com/shr3kx/odysseyUI, a personal account. Two collaborating individuals, no company, legal entity or team/about page.',
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
    maintainer: "individual",
    entity: "Aniket Pawar (Shadcn Labs)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'Homepage redirects to ogimagecn.com; the repo lives under the github.com/shadcn-labs org ("building open-source technologies that push the limits of shadcn/ui ecosystem", location India, hello@shadcn-labs.com) which states "This organization has no public members." Search attributes Shadcn Labs to a single creator, Aniket Pawar; all 18 repos are free/MIT with no pricing, terms or team page. Direct fetch of ogimagecn.com was blocked by network policy.',
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
    maintainer: "individual",
    entity: "Jamie Davenport (@jamiedavenport)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      "CORRECTED from solo-business. Fetched openpolicy.sh directly: the only two outbound links are github.com/jamiedavenport/policystack (a personal account, not an org) and github.com/sponsors/jamiedavenport. The site's own funding section reads 'Sponsorship pays for the time it takes to keep both repos maintained' — a personal-sponsorship OSS model, not a business. Everything is Apache-2.0; the 'Cloud' commercial piece does not exist yet (/cloud returns 404, the CTA is 'join cloud'). No pricing page, no copyright line, no legal entity. His consulting brand 'JXD' is separate and is not named as the project's owner.",
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
    maintainer: "company",
    entity: "openstatus",
    entityKind: "startup-saas",
    confidence: "high",
    evidence:
      'CONFIRMED. openstatus.dev embeds schema.org JSON-LD with "@type": "Organization", name \'openstatus\', sameAs including linkedin.com/company/openstatus, github.com/openstatushq and x.com/openstatushq, plus a Support contactPoint (ping@openstatus.dev). The site has a Pricing page, a managed SaaS with an enterprise plan, SOC-2 positioning and named customers (Cal.com, Documenso, WhiteBIT). AGPL-3.0 flagship at ~8k+ stars with named maintainers. This is a commercial company\'s own registry.',
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
    maintainer: "individual",
    entity: "Agustín Mayol (github.com/AgusMayol)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Direct fetch was blocked by network policy; search confirms the site is hosted on his personal domain (optics.agusmayol.com.ar, portfolio at agusmayol.com.ar) with source at github.com/AgusMayol/optics — a single personal account. No company, team or legal entity. Note: an unrelated "Optics" design system by RoleModel Software exists and is not this registry.',
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
    maintainer: "individual",
    entity: "mw10013",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Site footer reads "© 2026 Oui" with no company name, and the source link is github.com/mw10013/oui — a single personal GitHub account; the site is served from that user\'s personal Cloudflare workers.dev subdomain. No about/team page or legal entity.',
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
    maintainer: "solo-business",
    entity: "Denish Navadiya (@withden), PaceUI",
    entityKind: "solo-business",
    confidence: "high",
    evidence:
      "CONFIRMED and now hard-sourced. GitHub API: the paceui org has ZERO public members, no company/location/email fields, 6 repos. Its two flagship repos are written almost entirely by one account — paceui/gsap: withden 155 of ~161 commits; paceui/saaskit-starter: withden 7 of 7. That account resolves to 'Denish Navadiya'. paceui.com/pricing sells 'lifetime'/'one-time' tiers up to Enterprise. Commercial brand, one operator.",
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
    maintainer: "solo-business",
    entity: "Denish Navadiya (@withden), PaceKit",
    entityKind: "solo-business",
    confidence: "high",
    evidence:
      "CONFIRMED, and the PaceUI link is now proven rather than inferred. ui.pacekit.dev and paceui.com return byte-identical payloads (both exactly 289,722 bytes) — the same deployment behind two domains. pacekit.dev's footer social link is twitter.com/paceui_, the same X handle PaceUI uses. The pacekit GitHub org (created 2026-01-07, hello@pacekit.dev) has one repo, creembase, whose sole contributor is withden — Denish Navadiya, the same person behind PaceUI. No public members, no legal entity.",
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
    maintainer: "solo-business",
    entity: "Denish Navadiya (@withden), PaceUI",
    entityKind: "solo-business",
    confidence: "high",
    evidence:
      "CONFIRMED. gsap.paceui.com links to github.com/paceui/gsap and x.com/paceui_. That repo's contributor list is withden 155, abnerjs 4, William-LP 1, withden-dev 1 — one author plus trivial drive-by PRs. withden = Denish Navadiya. The paceui org reports no public members and no company field. Note: I could not reproduce the prior agent's exact 'Built by Denish at PaceUI' footer string in the current HTML (the sites are TanStack/JS-rendered), so I am resting the identification on the commit data rather than the footer.",
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
    maintainer: "company",
    entity: "Paddle.com Market Ltd.",
    entityKind: "startup-saas",
    confidence: "high",
    evidence:
      'CONFIRMED, and the registry is verifiably first-party: developer.paddle.com/r/registry.json returns {"name": "paddle", "homepage": "https://developer.paddle.com/", items: [paddle-helpers, ...]}. The site footer carries \'© 2012–2026\' and the docs are Paddle\'s official developer portal for Paddle Billing (merchant-of-record payments, 30 currencies, 200+ markets, official Node/PHP/Go/Python SDKs). A real, established payments company.',
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
    maintainer: "individual",
    entity: "Lior Pesoa",
    entityKind: "individual",
    confidence: "high",
    evidence:
      "paletteui.xyz footer links to x.com/liorpesoa and the source repo github.com/lior-pesoa/paletteui (a personal account, MIT licensed). No company name, team page, legal entity or paid tier anywhere on the site.",
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
    maintainer: "individual",
    entity: "Ducksss",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Site footer shows "© 2026 Ducksss" and identifies Ducksss as "Maintainer, Payload Components", with a first-person origin story. Repo is github.com/Ducksss/payload-components — a personal account, MIT, described as an independent community-first project with no company affiliation.',
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
    maintainer: "individual",
    entity: "Ronny Badilla (rbadillap)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      "pastecn.com itself has no footer credit, copyright, about page or company name (fetched, inconclusive). WebSearch resolves the project to the personal GitHub repo github.com/rbadillap/pastecn, and it was posted to the Vercel community showcase by the same author.",
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
    maintainer: "company",
    entity: "Payroutes",
    entityKind: "startup-saas",
    confidence: "medium",
    evidence:
      "CONFIRMED, though thin. usepaykit.dev refused connections on every attempt, so this rests on GitHub + search. github.com/payrouteshq is a named org ('The missing infrastructure between developers and payment providers. Creators of StellarTools, PayKit SDK and more.', payroutes.sh, hello@payroutes.sh, 8 repos). paykit-sdk contributors: devodii 432, Chizihn 7, princeajuzie7 7, juansoler 6. devodii = Emmanuel Odii, GitHub company field '@payrouteshq'. Search surfaces LinkedIn company pages for both Payroutes and PayKit, a Tracxn company profile, and named roles beyond the founder (Prince Ajuzie – engineer, Lucas Svoboda – Head of Product). Only one public org member, so team size is asserted rather than directly verified.",
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
    maintainer: "individual",
    entity: "Phuc Bui",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'phucbm.com is a personal portfolio site; footer states "© 2026 Phuc Bui. All rights reserved", with personal contact phucbm.dev@gmail.com and GitHub/X/LinkedIn profiles for the single person. No company or team.',
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
    maintainer: "individual",
    entity: "Alberta Saftei / 'alburt' (@albertasaftei)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      "CORRECTED from unclear. GitHub API on pixelact-ui/pixelact-ui gives contributors: albertasaftei 148, dependabot[bot] 26, albertasaftei00 9 — one human plus his own second account. The org (created 2025-05-03) has a single repo, no name/company/blog/email/description and no public members. License is MIT, README describes a free pixel-art shadcn registry with no paid tier, no pricing page, no sponsor link. A personal side project.",
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
    maintainer: "solo-business",
    entity: "Udecode (Ziad Beyens, @zbeyens)",
    entityKind: "solo-business",
    confidence: "medium",
    evidence:
      "CONFIRMED, with a caveat. The udecode org lists exactly one public member, zbeyens = Ziad Beyens (Brussels, GitHub company field '@udecode', bio 'Plate maintainer'), and he wrote 4,838 of the commits on udecode/plate. pro.platejs.org sells licensed templates and its footer reads '© 2026 Udecode. All rights reserved' — a brand, with no Inc/Ltd/BV/SPRL disclosed anywhere. Caveat against my own verdict: Felix Feng (@felixfeng33, bio 'Co-maintainer of @plate.js') has 1,850 commits, so this is not literally a one-person codebase; it sits close to the multi-person-OSS-org line. The commercial framing and single-owner brand keep it in solo-business.",
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
    maintainer: "individual",
    entity: "Julien Thibeaut (ibelick)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      "prompt-kit.com returned HTTP 403 to WebFetch; search resolves the project to github.com/ibelick/prompt-kit, the personal account of Julien Thibeaut (ibelick.com is his personal site). Free MIT component library, no company, team or pricing found.",
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
    maintainer: "individual",
    entity: "Ocavue",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'prosekit.dev footer reads "© 2026 Ocavue", repo is github.com/ocavue/prosekit (personal account), socials are @ocavue on X and Bluesky. MIT licensed, no company, team page or commercial offering.',
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
    maintainer: "individual",
    entity: "Pulkit (github.com/Pulkitxm)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'pulkit.page is a personal portfolio (bio, blog, projects) with footer "© 2026 Pulkit. All rights reserved" and GitHub handle Pulkitxm. He is employed elsewhere ("Building & Breaking things at Noveum.ai"), so the registry is a personal side project, not a company artifact.',
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
    maintainer: "unclear",
    entity: "unknown",
    entityKind: "unknown",
    confidence: "low",
    evidence:
      "CONFIRMED unclear. I fetched the landing page (134KB) and /pro, /pricing, /docs, /account: the ONLY href in the entire document that leaves the current path is https://pulld.pages.dev/account. Zero GitHub links, zero social links, no mailto, no copyright line, no checkout provider (no Gumroad/Lemon Squeezy/Polar/Stripe/Paddle strings). r/registry.json declares homepage 'https://pulld.dev', but that domain does not resolve. A paid Pro tier plus an /account route implies a commercial indie product, but nothing identifies the operator.",
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
    maintainer: "individual",
    entity: "Krishna (github.com/MusKRI)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'pure.kam-ui.com could not be fetched (domain safety verification blocked). Search plus the repo github.com/MusKRI/pure-ui ("A design system built with Base UI") show a personal GitHub account as owner, the site hosted on a personal kam-ui.com domain, and no company, team or pricing.',
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
    maintainer: "individual",
    entity: "Ramon Claudio",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'ramonclaudio.com could not be fetched (domain safety verification blocked). Search shows the registry lives under a personal-name domain (page titled "CodeRabbit Registry | Ray") built by Ramon Claudio as an unofficial third-party client for CodeRabbit\'s API — it is not published by CodeRabbit (github.com/coderabbitai) itself. No company entity found for ramonclaudio.com.',
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
    maintainer: "company",
    entity: "Adobe Inc.",
    entityKind: "big-tech",
    confidence: "high",
    evidence:
      "CONFIRMED, and I got past the earlier fetch block. curl on react-aria.adobe.com returns 200 with <title>React Aria</title> and the embedded footer string 'Copyright © 2026 Adobe. All rights reserved.' The page links to github.com/adobe/react-spectrum plus the personal profiles of Adobe React Spectrum engineers (LFDanLu, reidbarber, yihuiliao). Served on Adobe's own domain; unambiguously a big-tech first-party artifact.",
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
    maintainer: "solo-business",
    entity: "David Haz (@DavidHDev)",
    entityKind: "solo-business",
    confidence: "high",
    evidence:
      "CONFIRMED and upgraded. reactbits.dev's only outbound links are github.com/DavidHDev/react-bits and x.com/davidhdev. GitHub API: 44,622 stars, contributors DavidHDev 921 then a long tail (EnderRomantice 38, PedroMarianoAlmeida 28, ieedan 26) — community PRs, not a team. His profile has no company field, personal site davidhaz.com. pro.reactbits.dev is live (200, 347KB) with paid tiers up to $299. One person running a commercial brand on a personal account; no org, no entity.",
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
    maintainer: "individual",
    entity: "AlexDemzz",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      "Docs site (a vercel.app subdomain) shows no company, copyright or team; its only attribution is the GitHub link github.com/AlexDemzz/react-easy-modals — a personal account hosting a small OSS modal library.",
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
    maintainer: "individual",
    entity: "Sina Bayandorian (@sina-byn)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Docs footer says "Developed by Sina Bayandorian" and links to his personal portfolio sina-byn.vercel.app; repo is github.com/sina-byn/react-slot (personal account). No company, copyright entity or commercial offering.',
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
    maintainer: "individual",
    entity: "Kapish (kapish@remocn.dev)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'remocn.dev footer reads "© 2026 remocn — MIT licensed" with a single personal contact kapish@remocn.dev; repo github.com/Remocn/remocn. Everything is free MIT with "no account, no runtime" — no pricing, team, or legal entity.',
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
    maintainer: "company",
    entity: "Miriad SAS",
    entityKind: "startup-saas",
    confidence: "high",
    evidence:
      'CONFIRMED. The registry sits on a subdomain of miriad.studio and its only GitHub link points to github.com/miriadhq/rescript-shadcn — an Organization account (2 repos) whose website field is https://www.miriad.studio. miriad.studio is a creative review/approval SaaS with a freemium plan and a footer naming the legal entity "Miriad SAS" (French SAS). Caveat: the miriadhq org lists no public members, so team size is unverified, but the legal entity and product domain are enough.',
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
    maintainer: "company",
    entity: "Retab (retab-dev)",
    entityKind: "startup-saas",
    confidence: "high",
    evidence:
      'CONFIRMED. ui.retab.com footer says "Created by Retab" with source at github.com/retab-dev/retab-ui. The retab-dev GitHub org has 10 repos (official Python/PHP/Node SDKs, CLI, docs) and links a company LinkedIn (company/retab-ai), X @retabdev and a Substack. retab.com is a commercial document-automation platform with enterprise customers, a careers page, and SOC2/HIPAA/GDPR tiers. The registry is a companion artifact of that product.',
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
    maintainer: "solo-business",
    entity: "Arif Hossain (Neobrutalism, formerly RetroUI)",
    entityKind: "solo-business",
    confidence: "medium",
    evidence:
      'CONFIRMED. retroui.dev 301-redirects to neobrutalism.com, which sells a Pro tier, Figma kit and templates. The GitHub org github.com/neobrutalism ("NeoBrutalism.com") has 1 public repo, zero public members, and only a generic contact@neobrutalism.com plus X @neobrutalismcom — no named team. Independent reporting (fakemayo.com founder interview) identifies Arif Hossain, an indie hacker in Dhaka, Bangladesh (github.com/ariflogs, blog ariflogs.com) as the sole creator who first committed in Sept 2024 and launched RetroUI Pro at $99 lifetime. One person, commercial brand.',
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
    maintainer: "company",
    entity: "Keenthemes Inc",
    entityKind: "product-company",
    confidence: "high",
    evidence:
      'CONFIRMED, with the entity name sharpened. Repo is github.com/keenthemes/reui; the README credits "Built with ❤️ by the Keenthemes team". The GitHub org profile is literally titled "Keenthemes Inc", located in Malaysia, website keenthemes.com, 185 followers, and it also ships ktui and Metronic integrations — Metronic being a long-running commercial premium-template business. It also sponsors shadcn and other OSS devs, which is company behavior, not hobbyist.',
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
    maintainer: "individual",
    entity: "preetecool",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Site footer reads "Built by @preetecool" linking to x.com/preetecool, and the source is at github.com/preetecool/roi-ui — a personal GitHub account, not an org. No company entity, team, about, or pricing page.',
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
    maintainer: "individual",
    entity: "Danya Yudin",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'WebFetch of sabraman.ru/components returned no output (JS-only page), so I fell back to search: the indexed page title is "Legacy React Components for Next.js - Sabraman | Danya Yudin". Personal domain named after the handle @sabraman, free MIT-style components installed via the shadcn CLI; no company or team surfaced.',
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
    maintainer: "unclear",
    entity: "unknown",
    entityKind: "unknown",
    confidence: "low",
    evidence:
      'CONFIRMED unclear after deeper probing. /r/registry.json is real (name "satori-ui", homepage satoriui.site), but every attribution route is a dead end: footer is only "© 2026 Satori UI, All rights reserved"; the GitHub link in the markup is the bare string "https://github.com" with no org or user; /about, /contact, /terms, /license and even /pricing all return 404 (the footer nav links are non-functional placeholders); the homepage HTML contains no email address, X handle or GitHub/LinkedIn URL at all. GitHub code search finds the registry referenced only in third-party aggregator files, never in a source repo. No maintainer identifiable.',
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
    maintainer: "individual",
    entity: "Aditya Kishore (@Adityakishore0)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Footer reads "© 2026 ScrollX UI. Built with love by the Ahdeetai" and links to the personal repo github.com/Adityakishore0/ScrollX-UI, with the same account\'s profile photo shown on the page. Single personal GitHub account, no company or org.',
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
    maintainer: "individual",
    entity: "Miks Villamor (@meiskv)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      "Footer links to the personal accounts github.com/meiskv and linkedin.com/in/miksvillamor/, with the source at github.com/meiskv/seamui. No company name, legal entity, team, or about page appears anywhere on the site.",
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
    maintainer: "individual",
    entity: "Talha Mujahid (@htmujahid)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      "The docs site itself exposed no author info, so I searched: the project is github.com/htmujahid/shadcn-editor, a personal GitHub account maintained by Talha Mujahid. Free open-source Lexical + shadcn/ui editor on a vercel.app subdomain, no company or paid tier.",
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
    maintainer: "individual",
    entity: "Hin (Tong Ho Hin, @tonghohin)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Site credits an individual developer "Hin", with source at github.com/tonghohin/shadcn-map and a personal portfolio at tonghohin.vercel.app. Single personal GitHub account, vercel.app subdomain, no company.',
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
    maintainer: "company",
    entity: "WrapPixel",
    entityKind: "product-company",
    confidence: "high",
    evidence:
      'CONFIRMED. shadcnspace.com footer carries the WrapPixel logo/link plus a "Meet our Team" link to wrappixel.com/about-us/. That about page states WrapPixel was "founded in November 2016 by two brothers" and names 13 team members with roles — Sunil Joshi (Co-Founder & Designer), Nirav Joshi (Co-Founder & Lead Developer), plus front-end, React, Vue, Angular and WordPress developers, a designer, and a marketing lead. It also has Careers, Affiliate, and Premium Support pages. Multi-person commercial organization.',
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
    maintainer: "company",
    entity:
      "Clevision Technologies Private Limited (ThemeSelection / Shadcn Studio)",
    entityKind: "product-company",
    confidence: "high",
    evidence:
      'CONFIRMED and strengthened — the previous agent missed the actual legal entity. The shadcnstudio.com homepage markup contains the literal string "CLEVISION TECHNOLOGIES PRIVATE LIMITED" (an Indian Pvt Ltd), alongside "Co-Founder and CEO", "Co-founder", named people Ajay Patel and Anand Patel, and links to clevision.net/about, themeselection.com and themeselection.com/hire-us/. Footer reads "©2026 shadcn/studio, Supported by ThemeSelection" and lists sibling brands (FlyonUI, PixInvent, JetShip). Registered company, multiple founders.',
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
    maintainer: "unclear",
    entity: "unknown",
    entityKind: "unknown",
    confidence: "low",
    evidence:
      'CONFIRMED unclear. The registry at /r/registry.json is real (name "shadcn-ui-blocks"). But /about, /contact, /terms and /privacy all 404; the footer is only "© 2026 Shadcn UI Blocks. All rights reserved. An independent project, not affiliated with shadcn/ui." The only contact channels found anywhere in the HTML are support@shadcn-ui-blocks.com and X @shadcnuiblocks — no GitHub link, no person, no legal entity. The /support and /pricing pages use plural "we" and mention a 15-seat team plan, but that describes the customer\'s team, not the vendor\'s. Marketing "we" alone is not evidence of an organization.',
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
    maintainer: "company",
    entity: 'Shadcnblocks (founded by Robert "Rob" Austin, Australia)',
    entityKind: "product-company",
    confidence: "high",
    evidence:
      'CORRECTED from solo-business. The previous agent stopped at the footer credit "A project by @ausrobdev" and never opened /about. That page names a 12-person team with roles — Robert Austin (Founder), Luis (Fullstack Engineer), Yassine (Lead Design Engineer), Mason (Marketing), Rakesh, Yosra, Nader, Niko, Mateusz, Serge, Jannik, Callum — states "12 humans, 1 mission", "Built and maintained by a dedicated full-time team", "$1M ARR, profitable, bootstrapped", "About 80% of our hires come from the shadcn ecosystem", and links Careers/Press pages plus sister brands Wicked Blocks and Zerostatic. The /license page sets governing law as Australia. A named founder as the public face does not make it a one-person operation.',
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
    maintainer: "solo-business",
    entity: "Hamish O'Neill (shadcncraft)",
    entityKind: "solo-business",
    confidence: "high",
    evidence:
      'CONFIRMED. The /about page has a section headed "About the founder": "shadcncraft was created by Hamish O\'Neill, a designer and design systems specialist based in Melbourne, Australia", with a pull quote signed "Hamish O\'Neill, Founder, shadcncraft". No other person is named anywhere on the site; the Company menu offers About/Ambassadors/Affiliates/Privacy/Terms/Contact but no team or careers page. Footer is a bare brand string, "© Copyright shadcncraft 2026", with no Pty/Ltd/Inc. The page\'s own schema.org JSON-LD sets "author": {"@type": "Person"}. Commercial (paid Pro tiers, launch-week discounts) but one person.',
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
    maintainer: "solo-business",
    entity: "Matt Wierzbicki (shadcndesign.com)",
    entityKind: "solo-business",
    confidence: "high",
    evidence:
      'CONFIRMED. I pulled the rendered footer directly: "This project is independent and not affiliated with Figma or shadcn/ui. Copyright © 2026 Matt Wierzbicki" — a personal name, not a legal entity, and no team or careers page anywhere. The product is commercial (paid Figma kit, Pro blocks, templates, sign-in/sign-up accounts), which places it in solo-business rather than individual.',
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
    maintainer: "individual",
    entity: "Debbl",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      "Homepage fetch was blocked by domain verification, so I used search: the project is github.com/Debbl/shadcn-hooks, a personal GitHub account, and the registry-directory submission is shadcn-ui/ui issue #8593. Free open-source hooks collection, no company, pricing, or team evidence.",
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
    maintainer: "individual",
    entity: "LGLabGreg",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'Site links its source to github.com/LGLabGreg/shadcnmaps — a personal GitHub account. Page describes "Interactive SVG Map Components for React" with no company name, team, about, or pricing page.',
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
    maintainer: "company",
    entity: "SiliconDeck Innovations Pvt. Ltd. (ShadcnStore)",
    entityKind: "product-company",
    confidence: "high",
    evidence:
      'CONFIRMED as company, and the real entity found. The footer\'s "©2026 ShadcnStore, Inc." is unverifiable on its own (no about/terms page — both 404), so I traced the code instead: both github.com/shadcnstore repos have exactly two contributors, `vrushank` and `monab`. `monab` is Mona Brahmakshatriya, bio "Developer, Entrepreneur, co-owner at @silicondeck & Product Manager @pixinvent @themeselection", company field "SiliconDeck, CleVision, ShadcnStore, ThemeSelection, Pixinvent", blog shadcnstore.com. silicondeck.com lists Shadcn Store under Resources and its footer reads "© SiliconDeck Innovations Pvt. Ltd. 2025" with a registered address in Adalaj, Gandhinagar, Gujarat. Multi-person registered company.',
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
    maintainer: "individual",
    entity: "Akash (@akash3444)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'Site links to github.com/akash3444/shadcn-ui-blocks and github.com/sponsors/akash3444 — a personal GitHub account with personal sponsorship. Footer is just "© 2026 Shadcn UI Blocks" with no company, legal entity, or team page.',
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
    maintainer: "solo-business",
    entity: "Bundui (Toby Belhome)",
    entityKind: "solo-business",
    confidence: "medium",
    evidence:
      'CONFIRMED. Footer is "© 2026 Bundui. All Rights Reserved" and the only outbound identity links in the page source are github.com/bundui and x.com/TobyBelhome. Critically, github.com/bundui is a personal User account ("type": "User", name "Bundui.io", 8 repos) — not an organization — so there is no multi-maintainer structure. Commercial (lifetime All Access, affiliates program, multiple paid templates) with one visible person and no legal entity named.',
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
    maintainer: "individual",
    entity: "Vinicius Vicentini",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'Hosted on the personal domain vini.one; footer reads "© 2026 Built by Vinicius Vicentini" linking to vini.one. Source at github.com/sharkui-inc/shark-ui — an org named for the project, but no other members, company entity, or pricing surfaced.',
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
    maintainer: "individual",
    entity: "Justin Levine",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'Footer reads "Made with love by Justin Levine" linking to his personal site justinlevine.me. Repo is under github.com/jal-co (his own initials-based account) and the project is credited to the Vercel Open Source Program. No company, team, or paid tier named.',
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
    maintainer: "solo-business",
    entity: "Gxuri (@Gur__vi)",
    entityKind: "solo-business",
    confidence: "high",
    evidence:
      'CONFIRMED. The rendered page ends with "Design and Developed by © Gxuri" — a single handle, no company. Pricing is a one-time Premium $129 / Exclusive $549 license with no legal entity, VAT number, or team page anywhere on the site. The only other names present are a credits wall of inspirations and sponsors (Emil Kowalski, Rauno Freiberg, Rob Austin, etc.), which are acknowledgements, not collaborators. One person running a paid product.',
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
    maintainer: "individual",
    entity: "Prithvi Rajan",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'slide-cn.com footer states "Built by Prithvi" linking to x.com/PrithviRajan222, and the source lives on a personal GitHub account at github.com/prithvi-rajan-222/slide-cn. No company, team, about page, or paid product.',
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
    maintainer: "individual",
    entity: "Eduardo Calvo (educlopez)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'smoothui.dev footer reads "© 2026 SmoothUI. Built by Eduardo Calvo." MIT-licensed on his personal GitHub account (educlopez/smoothui); he also runs sparkbites.dev, codevator.dev and thegridcn.com as personal side projects. No legal entity or employed team.',
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
    maintainer: "individual",
    entity: "Harshit (@harshitlog)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'solaceui.com footer says "Building in public @harshitlog" alongside "© 2026 SolaceUI, All rights reserved" — no company name, about/team page, or entity. The templates page lists the Mobile SaaS template as "Free", and /pricing returns 404, so there is no evidence of a commercial operation.',
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
    maintainer: "individual",
    entity: "Dinil Thilakarathne",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'The site links its source to the personal GitHub account github.com/Dinil-Thilakarathne/sona-ui and describes itself as open source "Built in the open". Hosted on a free vercel.app subdomain; no company, team, or entity named anywhere on the page.',
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
    maintainer: "individual",
    entity: "Axyl (github.com/axyl1410)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'ui.soralabs.io.vn footer states "Built by Axyl" linking to the personal GitHub profile github.com/axyl1410/. Despite the "labs" branding there is no company name, team page, or legal entity; a follow-up search surfaced no organisation behind the soralabs.io.vn domain.',
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
    maintainer: "individual",
    entity: "kapishdima",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'The homepage fetch returned only the title tag with no footer or attribution, so I fell back to search: the project source is at the personal GitHub account github.com/kapishdima/soundcn, described as "700+ curated UI sound effects... Free and open source", with a personal GitHub sponsor commit. No org or company found.',
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
    maintainer: "individual",
    entity: "Arihant (arihantcodes)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'Footer reads "© 2026 Spectrum UI. All rights reserved." with GitHub/LinkedIn/X all pointing to the personal handle @arihantcodes and source at github.com/arihantcodes/spectrum-ui. I also fetched spectrumhq.in directly: no about/team page, no services, no legal entity — just a product landing page.',
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
    maintainer: "individual",
    entity: "Tom (xxtomm / @tomm_ui)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'spell.sh shows only "© 2026 Spell UI" with links to github.com/xxtomm/spell-ui and the personal handle tomm_ui on X/Discord. The author\'s own dev.to post "I built UI Components called Spell UI" describes it as a personal project by a design engineer; no company or team.',
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
    maintainer: "solo-business",
    entity: "Leonel Ngoya (ln-dev / lndev)",
    entityKind: "solo-business",
    confidence: "high",
    evidence:
      'CONFIRMED. square.lndev.me resolves to square.lndevui.com; the page links github.com/ln-dev7 and x.com/ln_dev7. His hub lndevui.com sells three paid products (lndev/ui $89, Square UI Pro $169, Blockus Solo $119, Trio $289) and its footer reads "Crafted by Leonel Ngoya · lndev" and "© 2026 Leonel Ngoya. All rights reserved" — a natural person, not an entity. Note: individual dashboards carry "Design by Rico / Ryco / Augustas" credits (x.com/_heyrico, x.com/AugustasDesign), but these are per-template design credits, not a company team.',
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
    maintainer: "individual",
    entity: "francozeta",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'The docs page itself carries no footer, copyright, or "built by" credit, so I searched: the project is at the personal GitHub account github.com/francozeta/stepper, a single registry-distributed Stepper component, hosted on a free vercel.app subdomain named after the author. No org or commercial offering.',
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
    maintainer: "company",
    entity: "Supabase Inc.",
    entityKind: "startup-saas",
    confidence: "high",
    evidence:
      "CONFIRMED. supabase.com/ui states the library was created by Supabase and is open-source with code on GitHub, living inside the main supabase/supabase monorepo (apps/ui-library) on the company's own product domain. The blocks exist specifically to wire front-ends to the Supabase backend (auth, realtime, storage) — a first-party artifact of the venture-funded backend-as-a-service company.",
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
    maintainer: "individual",
    entity: "pheralb",
    entityKind: "individual",
    confidence: "high",
    evidence:
      "The site links source, stars and sponsorship all to the single personal GitHub account: github.com/pheralb/svgl and github.com/sponsors/pheralb. No footer company, about/team page, or legal entity; funded via personal GitHub Sponsors rather than a business.",
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
    maintainer: "individual",
    entity: "Youcef Bnm (@YoucefBnm)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Footer reads "Created by @YoucefBnm" (x.com/lbnm_yussef) and the site says "Systaliko UI is built by a working frontend developer" available for freelance projects. Source on the personal account github.com/YoucefBnm/systaliko-ui; no corporate entity or team listed.',
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
    maintainer: "solo-business",
    entity: "Meschac Irung (Tailark)",
    entityKind: "solo-business",
    confidence: "high",
    evidence:
      'CONFIRMED. The github.com/tailark org (created April 2025, 3 repos) lists zero public members and exposes purely personal contact details: email meschacirung@gmail.com, twitter_username meschacirung, location Congo (Kinshasa). pro.tailark.com is a paid early-access product (Essentials/Complete/Team one-time licenses) whose own testimonial wall credits the work to "@MeschacIrung". No legal entity, no second maintainer.',
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
    maintainer: "company",
    entity: "Pimjo LLC",
    entityKind: "product-company",
    confidence: "high",
    evidence:
      'CONFIRMED. tailgrids.com\'s own footer names no entity ("© Copyright 2026 Tailgrids UI") and /about 404s, so I verified the parent: the Tailgrids page links pimjo.com/community and sibling brands TailAdmin, Lineicons and GrayGrids. pimjo.com lists Tailgrids first among its products and its footer gives two offices — "Pimjo LLC - 30 N Gould St Ste R Sheridan, WY 82801" (US) and a Dhaka, Bangladesh headquarters — plus Careers and Contact pages and an "expert team" description. Real multi-person company.',
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
    maintainer: "company",
    entity: "WrapPixel",
    entityKind: "product-company",
    confidence: "high",
    evidence:
      'CONFIRMED. I fetched the rendered page: the footer ends "© 2026 TailwindAdmin. All rights reserved. A product by: WrapPixel". WrapPixel\'s own about page (wrappixel.com/about-us/) documents a company founded November 2016 by two brothers, with 13 named staff (Sunil Joshi and Nirav Joshi as co-founders, plus designers and framework-specific developers), 518,265+ downloads, Careers and Premium Support pages.',
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
    maintainer: "company",
    entity: "WrapPixel",
    entityKind: "product-company",
    confidence: "high",
    evidence:
      'CONFIRMED. Rendered footer reads "© 2025 TailwindBuilder. All rights reserved. A product by:" followed by the WrapPixel logo asset (wrappixel-dark.svg) linking to wrappixel.com — I grepped the HTML to confirm the vendor rather than relying on the visible text. Same parent as tailwind-admin.com; WrapPixel is a 13-person template company founded in 2016 by two brothers, per wrappixel.com/about-us/.',
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
    maintainer: "individual",
    entity: "Pawan Kumar (jsartisan)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'taki-ui.com footer states "Built by jsartisan" linking to x.com/pawankumar2901. No company name, team/about page, pricing, or legal entity anywhere on the site — a solo open-source React Aria component library.',
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
    maintainer: "individual",
    entity: "Aniket Pawar (Shadcn Labs)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'Source is at github.com/shadcn-labs/termcn; the shadcn-labs GitHub org (bio "Pushing the limits of shadcn/ui ecosystem", India, "Not endorsed by or affiliated with shadcn") has no public members, and shadcn-labs.com lists "Aniket Pawar" as the sole team member under "Founder", with "© Shadcn Labs 2026" and no legal entity. The repo also mirrors his personal account Aniket-508; the project is free/MIT.',
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
    maintainer: "individual",
    entity: "Matt Simpson (GitHub @msmps)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'CONFIRMED with stronger evidence. GitHub contributors API for tuiparts/tuiparts returns exactly one human: msmps (83 commits), plus github-actions[bot] (17) and a drive-by contributor (1). api.github.com/users/msmps = "Matt Simpson", Midlands UK, bio "software engineer • passionate about typescript, rust, and ai • oss @ anomalyco/opentui", company field "Cloudflare". The tuiparts GitHub org has 1 repo and no public members; tuiparts.sh has no footer credit, about page, contact, or legal entity anywhere. His employer (Cloudflare) and the OpenTUI vendor (anomalyco) are unrelated to this registry — the README calls it an independent project. Upgraded confidence low -> high.',
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
    maintainer: "individual",
    entity: "Ala Menai (alamenai)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      "terrae.dev credits a single creator, Ala Menai, linking to github.com/alamenai, with source at github.com/alamenai/terrae. No company name, team/about page, pricing, or legal entity — a personal open-source map component library.",
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
    maintainer: "individual",
    entity: "Liam (Liamandrew)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'tetra-ui.com states "Built by Liam (x.com/_liamandr) for the community" and links the repo at github.com/Liamandrew/tetra-ui — a personal GitHub account, no company, team page or legal entity anywhere on the site.',
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
    maintainer: "individual",
    entity: "Joel LaChance (joelachance)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      "The docs are hosted on a personal GitHub Pages domain (joelachance.github.io) and link to github.com/joelachance/text-ui, a single personal account. No company, team, or footer entity appears on the page.",
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
    maintainer: "individual",
    entity: "Eduardo Calvo (educlopez)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Footer reads "© 2026 Eduardo Calvo"; repo is github.com/educlopez/thegridcn-ui (personal account) and the author links his other personal side projects (smoothui.dev, sparkbites.dev). No company or team page.',
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
    maintainer: "individual",
    entity: "lenxism",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'The homepage has no attribution at all, but the registry JSON at tocn.vercel.app/r/registry.json carries author "toc-cn (https://github.com/lenxism/tocn)"; that repo sits under the personal GitHub user lenxism, not an org.',
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
    maintainer: "individual",
    entity: "Georgy Malanichev (Character Development)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'CORRECTED solo-business -> individual. The previous agent\'s facts are right but the bucket is wrong: Token UI is free, not a commercial product. tokenui.dev\'s own JSON-LD declares offers: {price: "0", priceCurrency: "USD"}; there is no /pricing, no paid tier, no license gate. Footer is "© 2026 Character Development" and the page meta has twitter:creator "@gmlnchv". chrctr.dev self-describes as "the independent creative practice of Georgy Malanichev" — a portfolio-style personal site with one contact email (georgy@chrctr.dev), no team. Repo is github.com/gmlnchv/token-ui, owner type "User", 2 stars, no license file. A free side project by one person, published under his personal practice brand — solo-business requires a paid/commercial product, which this is not.',
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
    maintainer: "company",
    entity: "assistant-ui (YC W25)",
    entityKind: "startup-saas",
    confidence: "high",
    evidence:
      "CONFIRMED. tool-ui.com links its source to github.com/assistant-ui/tool-ui; the assistant-ui GitHub org is a domain-verified organization (assistant-ui.com, contact@assistant-ui.com, LinkedIn company/assistant-ui, US), hosting assistant-ui (11.4k stars) alongside tool-ui (760 stars). assistant-ui has a Y Combinator company page (ycombinator.com/companies/assistant-ui), YC W25 batch, founded by Simon Farshid, ~3 employees in San Francisco, $500K seed Feb 2025 per Tracxn/FounderTrace. The registry is the funded startup's official companion project, not a side project.",
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
    maintainer: "individual",
    entity: "Hin (Tong Ho Hin, tonghohin)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Site footer credits "Built by Hin" linking to the personal portfolio tonghohin.vercel.app, with source at github.com/tonghohin/tour — a single personal GitHub account. No company or team.',
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
    maintainer: "company",
    entity: "Trophy Labs Inc. (Delaware, US)",
    entityKind: "startup-saas",
    confidence: "high",
    evidence:
      'CONFIRMED, and the entity is now pinned to a legal name the previous agent did not have. trophy.so/legal/terms names "Trophy Labs Inc.", registered in Delaware, address 1111B S Governors Ave STE 25403, Dover, DE 19904. The registry sits on the product subdomain ui.trophy.so, says "Built by Trophy", and the source is the org repo github.com/trophyso/ui. trophy.so is a commercial gamification API/SaaS with pricing, careers, contact-sales, customer stories, a status page, and official SDKs in seven languages.',
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
    maintainer: "company",
    entity: "Turbopills",
    entityKind: "startup-saas",
    confidence: "high",
    evidence:
      'CONFIRMED. The registry is hosted under the commercial product domain (turbopills.com/ui/docs), described as the UI kit powering the platform. turbopills.com/careers currently lists an open Customer Success Manager role (remote, full-time) plus two archived roles, and describes a "small team", "remote-first... across time zones", and collaboration "with founders and engineering" — plural founders plus active hiring is real-organization evidence, not marketing "we". Site also has About Us, Contact, Blog, and a status page. Caveat: no legal entity (Inc/LLC) is named anywhere I could find, and no founder is named publicly, so this reads as an early-stage startup rather than an established company.',
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
    maintainer: "individual",
    entity: "nguyenphutrong",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'The Netlify homepage exposes no attribution (JS-rendered, only the title was retrievable). The repo is github.com/nguyenphutrong/typedora-ui — a personal user account; the MIT license says "© 2025 Typedora UI Team" but no real team, org, or legal entity is identified anywhere.',
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
    maintainer: "individual",
    entity: "Naymur Rahman (naymur_dev)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'Footer says "© 2026 UI-Layouts. All Rights Reserved" with no legal entity; contact is naymur@ui-layouts.com. The repo github.com/ui-layouts/uilayouts README has a single "Author (Naymur)" section (X @naymur_dev); the other names shown on the site are listed under "Open Source Heroes"/contributors, not employees.',
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
    maintainer: "individual",
    entity: "Kaiyu Hsu",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Footer reads "©2026 Kaiyu Hsu" with personal GitHub and X links only. No company name, team page, or legal entity appears on the site.',
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
    maintainer: "company",
    entity: "TripleD (TripleD for Development), Egypt",
    entityKind: "agency-studio",
    confidence: "medium",
    evidence:
      'CONFIRMED, with harder evidence than the previous agent had. tripled.work\'s inline JSON-LD declares @type Organization, name "TripleD", email contact@tripled.work, foundingLocation addressCountry "EG"; the /about page says "Designed and developed by the TripleD Team" and "an independent web & app development agency". Crucially, the apex site links linkedin.com/company/tripled-for-development, whose page states 2-10 employees and describes "a full-service digital studio" — an actual company page, not just plural pronouns. The registry subdomain ui.tripled.work does credit one person (x.com/moumensoliman, linkedin.com/in/moumensoliman), so this is a very small studio with one visible builder; no legal entity or founder list is published.',
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
    maintainer: "solo-business",
    entity: "Léo (@leouiux) — unlumen UI",
    entityKind: "solo-business",
    confidence: "high",
    evidence:
      'CONFIRMED. ui.unlumen.com/pricing credits "Léo" (x.com/leouiux), contact leo@unlumen.com, and sells paid tiers: Pro one-time $119 (reg. $149), Pro annual $69/yr, Studio $430 for 5 seats, with a student discount and an explicit no-refunds policy. A listed perk is "direct support from the maker" (singular). No legal entity, imprint, terms-of-company, or team page exists on the site; repos are on personal accounts. One person running a paid product.',
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
    maintainer: "unclear",
    entity: "unknown",
    entityKind: "unknown",
    confidence: "low",
    evidence:
      'CONFIRMED unclear. I re-fetched the raw HTML: ui.untldlabs.com renders only a nav, a search box, and the literal text "Hello World / You can open /docs and see the documentation" — an unfinished template. Grepping the page source for x.com, github.com, or mailto links returns nothing. /r/registry.json contains only name "untld-ui", homepage, and two components (ai-input, page-dock) — no author or repository field. untldlabs.com is a GoDaddy Website Builder page whose entire content is the name "Untld Labs", the tagline "Unleashing Creative Potential", and "Copyright © 2026 Untld Labs - All Rights Reserved"; no about, team, services, or contact details. Targeted web searches for "untld labs"/"untldlabs" surface nothing. Note the GoDaddy-builder placeholder site is weak evidence *against* an established company, but not enough to assign a person.',
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
    maintainer: "individual",
    entity: "Urvish (@0xUrvish, GitHub iurvish)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'Footer states "Built by @0xUrvish" with a "Meet Creator" link to the personal site urvish.in; repos live under the personal account iurvish and support is via GitHub Sponsors. /pricing 404s — components are offered free, so no commercial entity is evidenced.',
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
    maintainer: "unclear",
    entity: "unknown",
    entityKind: "unknown",
    confidence: "low",
    evidence:
      'CONFIRMED unclear. Raw-HTML grep of uui.app for x.com, twitter.com, github.com, linkedin.com, and mailto links returns zero matches, on both the homepage and /directory. /about, /terms, and /privacy all return HTTP 404; the only footer text is "©2026 UUI". /r/registry.json parses fine (name "ui", homepage https://uui.app, blocks like cards-shader-effect, dropbox-upload, family-signin-drawer) but carries no author or repository field. I also chased the one promising lead — an App Store listing "UUi" (id6757535871) — and refuted it: that is an unrelated Taiwanese lifestyle/anniversary-tracking app by developer YIN-SHIAN HUNG, not this UI-inspiration site. Operator genuinely unidentifiable.',
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
    maintainer: "individual",
    entity: "Brennen Rocks (BrennenRocks)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      "The site links its source to github.com/BrennenRocks/utilcn, a personal GitHub user account. No company name, team page, or legal entity appears on utilcn.dev.",
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
    maintainer: "individual",
    entity: "Petar Stoev (GitHub @PetarStoev02), Bulgaria",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'CORRECTED unclear -> individual. The GitHub contributors API for w3-kit/ui returns one human: PetarStoev02 with 175 commits (plus dependabot and a 1-commit account). api.github.com/users/PetarStoev02 = Petar Stoev, Bulgaria, blog petarstoev.dev, company field "@dextrasoft" (his employer, unrelated to w3-kit). The w3-kit org has 8 repos (ui, website, cli, config, registry, learn, contracts, .github) but no public members, and w3-kit.com states "Open source, MIT, no accounts, no keys, no upsells" — free, so not solo-business either. Org-shaped account, one person behind it.',
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
    maintainer: "individual",
    entity: "froggy1014",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Footer reads "MIT License. Built by @froggy1014" linking to github.com/froggy1014, a personal account. The related meta-cloud-api SDK and playground are the same developer\'s projects; no company or team is named.',
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
    maintainer: "company",
    entity: "Wandry Agency, Odesa, Ukraine",
    entityKind: "agency-studio",
    confidence: "medium",
    evidence:
      'CONFIRMED. The registry subdomain itself is unreachable (expired TLS cert), so the verdict rests on the parent domain: wandry.com.ua/en is a client-services agency offering branding (research, brand identity, packaging, illustration), UI/UX, and web development (front-end, back-end, DevOps, CMS, maintenance), with a sales address sales@wandry.com.ua, a phone number (+380634551401), a physical Odesa location with coordinates, and Behance/Dribbble/Instagram (@wandry.agency) profiles. A sales line plus a full service menu and portfolio is agency evidence, not solo-marketing "we". Caveat: no team members and no legal entity are named, and I could not inspect the registry page\'s own attribution.',
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
    maintainer: "individual",
    entity: "Mouad Sadik and Badreddine Ziane",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Site footer states "Built by Mouad Sadik and Badreddine Ziane", linking the personal GitHub accounts @MouadSadik and @Ziane-Badreddine. Two individuals collaborating on an open-source project; no company, org, or legal entity named.',
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
    maintainer: "solo-business",
    entity: "Web Dev Simplified (Kyle Cook)",
    entityKind: "solo-business",
    confidence: "high",
    evidence:
      'CONFIRMED. The site footer reads "Built by Web Dev Simplified for use with Shadcn", linking webdevsimplified.com plus GitHub/WebDevSimplified, YouTube @WebDevSimplified and X @DevSimplified. Web Dev Simplified is Kyle Cook\'s one-person course/teaching brand (webdevsimplified.com resolves to courses.webdevsimplified.com, a paid course catalog) — a commercial brand with a single operator, no team page, no named legal entity, and no multi-maintainer GitHub org. The registry is a free companion artifact of that solo commercial brand.',
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
    maintainer: "solo-business",
    entity: "Wensity (Parth Sharma, @ksparth12)",
    entityKind: "solo-business",
    confidence: "medium",
    evidence:
      'CONFIRMED. wensity.com self-describes as an "independent design and engineering studio" with productised client pricing (Launch $1,200 single landing page; Startup $3,500 for 4-6 pages; Enterprise custom), fixed-fee not hourly, contact hello@wensity.com and a "Talk to Parth!" CTA — Parth is the only human named anywhere. api.github.com/users/ksparth12 = "Parth Sharma", Noida (India), blog parthh.in, bio "Software Engineer | Full Stack Developer... AI Intern @Intel | Ex-Zion Intern | CSE\'26" — an individual, currently a CS student/intern, not a company employee roster. No team page, no legal entity, no company LinkedIn. Commercial packages + exactly one person = solo-business.',
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
    maintainer: "individual",
    entity: "Henil Shah",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Site states "Built by Henil Shah" (twitter.com/wigggleui) and "The source code is available on GitHub" at github.com/wigggle-ui/ui. No company, team, pricing, or copyright entity anywhere on the page.',
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
    maintainer: "individual",
    entity: "HO Ching-Ru (chingru.com)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'shadcn-heatmap.pages.dev 301-redirects to heatmap.chingru.com; chingru.com is the personal portfolio of HO Ching-Ru, "an individual software engineer from Taiwan" (contact hello@chingru.com), with no company, team, or legal entity. A same-named GitHub repo exists at github.com/fishdev20/shadcn-heatmap (Minh Nguyen, Helsinki), also a personal account — either way it is one person, not an organization.',
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
    maintainer: "individual",
    entity: "Jay Sharma (GitHub: radiumcoders)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'Site links only to github.com/radiumcoders/ui and x.com/radiumcoders; the GitHub API shows radiumcoders is type "User" (personal account), name "Jay Sharma", bio "Using Arch and Neovim BTW", no company field. README credits "RadiumCoders" as sole creator (Apache 2.0). radiumcoders.com returned no readable content.',
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
    maintainer: "individual",
    entity: "Vidhal Elame",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'The site is a JS-only SPA (WebFetch saw only the title), so I grepped its JS bundle: it contains the footer strings "© {{year}} Saaskit by Vidhal Elame. MIT License." / French variant, plus github.com/terravidhal/saaskit, x.com/TerraVidhal and vidhalelame@gmail.com. Personal GitHub account, no company.',
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
    maintainer: "solo-business",
    entity: "Zippystarter (Morgan Feeney)",
    entityKind: "solo-business",
    confidence: "medium",
    evidence:
      "CONFIRMED. zippystarter.com sells a $149 one-time lifetime bundle (templates Devstarter/Focus/Nimble, premium blocks, private shadcn registry access) alongside free tools (shadcn theme generator, image cropper) — an unambiguously commercial product, with License/Terms/Privacy pages. Attribution independently traces to Morgan Feeney: github.com/morganfeeney and morganfeeney.com/now, described as a frontend/UI/design engineer in Manchester UK who works on zippystarter, shadcn preset, shadcn theme generator and shadcn themes in his spare time. No about/team page, no GitHub org, no Ltd/Inc named. One operator behind a paid brand.",
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
    maintainer: "individual",
    entity: "Khanh Anh Trinh (GitHub: diontr00)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Footer credit "Built by Khanh Anh Trinh" with source at github.com/diontr00/kaui-shadcn-registry (personal account). The registry\'s own description says "Personal well crafted components for Shadcn ui"; no company or team.',
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
    maintainer: "company",
    entity: "CodedThemes (India)",
    entityKind: "product-company",
    confidence: "high",
    evidence:
      'CONFIRMED, and the previous agent\'s weakest point (org headcount) now has direct proof. api.github.com/orgs/codedthemes/members returns 10 public members: ct-amit, ct-anjali-patel, ct-bipin, ct-brijeshd, ct-nensy, ct-viral, ct-vrushti, phoenixcoded20, rakesh-nakrani, ritirathod0 — note the shared "ct-" employee-handle convention. The org (62 public repos, 198 followers, location India, blog codedthemes.com, codedthemes@gmail.com) describes itself as "A collection of the best Free & Premium UI Kits and Admin Templates built with React, Angular, Bootstrap, Vue.js, MUI, & Tailwind" — an established commercial template vendor. The registry repo is github.com/codedthemes/uiable, MIT, owned by that org.',
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
    maintainer: "individual",
    entity: "David Haz (GitHub: DavidHDev)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      "vue-bits.dev blocked WebFetch (403); the repo github.com/DavidHDev/vue-bits is a personal account with David Haz listed as the sole maintainer in the README's Maintainers section and no company mentioned (same author as React Bits).",
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
    maintainer: "individual",
    entity: "David Haz (GitHub: DavidHDev)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      "sveltebits.xyz blocked WebFetch (403). Search confirms the project repo is github.com/DavidHDev/svelte-bits — the official Svelte port of React Bits, maintained by the same solo developer David Haz on his personal GitHub account; no organization or company involved.",
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
    maintainer: "individual",
    entity: "Anish (GitHub: anishlp7, anishl.dev)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Footer reads "Made with by Anish" linking to the personal site anishl.dev; source at github.com/anishlp7/aniui under MIT. No company, team page, or legal entity.',
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
    maintainer: "individual",
    entity: "ln-dev7 (Leonel Ngoya)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'Only attributions on the site are the X handle @ln_dev7 and the repo github.com/ln-dev7/threecn (personal account); footer says just "Built with R3F, Drei, and shadcn/ui." No company, team, copyright entity, or pricing.',
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
    maintainer: "company",
    entity: "vllnt SAS (Paris, France — RCS Paris 932 014 071)",
    entityKind: "startup-saas",
    confidence: "medium",
    evidence:
      'CONFIRMED, with the registration number now verified. The /legal page names "vllnt SAS", share capital €1,000, Paris trade register number 932 014 071, registered office 12 rue de la Forge, 75011 Paris, contacts hello@/legal@/dpo@vllnt.ai, hosting by Scaleway SAS, publication director B. Vaillant. The registry ui.vllnt.com (313 MIT components for AI agent UIs) sits on the company\'s own domain and is maintained under github.com/vllnt. Honest caveat that keeps confidence at medium rather than high: vllnt.com shows a single founder (handle bntvllnt), ~29 OSS projects with ~39 stars and ~1.6k weekly npm downloads, and no paid product — so this is a registered one-person SAS, i.e. a real legal entity but effectively a solo operation. I kept "company" because a verifiable incorporation is the stated bar, not team size.',
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
    maintainer: "individual",
    entity: "abhix4 (Abhi)",
    entityKind: "individual",
    confidence: "high",
    evidence:
      "Hosted on the personal subdomain abhii.space; the only link is github.com/abhix4/grainly-icons (personal account). No company, team, copyright footer, or commercial offering on the page.",
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
    maintainer: "individual",
    entity: "Sammed Chougule (GitHub: Sammed-Chougule)",
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'The Vercel-hosted page returned no attribution text to WebFetch; search identifies the project repo as github.com/Sammed-Chougule/Shadcn-Loaders ("20+ professional React loaders and spinners inspired by shadcn/ui") on a personal account. No org, company, or team found.',
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
    maintainer: "company",
    entity: "WrapPixel",
    entityKind: "product-company",
    confidence: "high",
    evidence:
      'CONFIRMED via the page\'s own structured data, which is stronger than the prose the previous agent quoted. The rendered HTML contains JSON-LD with "parentOrganization": {"@type": "Organization", "name": "Wrappixel", "url": "https://wrappixel.com/"}, plus a FAQ entry "Who is behind ShadcnDashboard.dev?" answering that it is "proudly backed by WrapPixel, a trusted name in the admin dashboard ecosystem with over 15 years of experience... used by 600K+ developers", and WrapPixel logo assets linked to wrappixel.com. The site sells paid access (Get all access, Download, Figma kit, Supabase boilerplate) and the org repo is github.com/shadcndashboard/shadcndashboard. WrapPixel is a long-established commercial template company.',
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
    maintainer: "individual",
    entity: "Matt Pasek",
    entityKind: "individual",
    confidence: "high",
    evidence:
      'Footer: "© 2026 usva · built by matt pasek" linking to the personal site matt-pasek.dev, with source at github.com/matt-pasek/usva (personal account). No company or team.',
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
    maintainer: "solo-business",
    entity: "Atelier UI (Jérémie Nallet, Paris)",
    entityKind: "solo-business",
    confidence: "high",
    evidence:
      'CONFIRMED. atelier-ui.com credits "Designed & Built by Jérémie Nallet · In Paris, France" and sells a Pro tier at $79.99 one-time (Shader Studio access, pro-only components, future releases) alongside 25+ free MIT components. Support runs through a personal Gmail address and the source sits on the personal account github.com/whatisjery/atelier-ui. No company name, no team, no legal entity anywhere on the site — one person running a paid product.',
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
    maintainer: "company",
    entity: "Autorender Inc.",
    entityKind: "startup-saas",
    confidence: "medium",
    evidence:
      'CONFIRMED. mediadrop.dev states the MIT library is "maintained by Autorender" and links autorender.io, whose footer reads "© 2026 Autorender Inc." — an incorporated entity. autorender.io is a commercial image API ("the new image API for developers") with bandwidth-based pricing, an NVIDIA Inception Program badge, a "talk to a founder" scheduling link, and GitHub/Discord/LinkedIn/X presence. Caveat holding this at medium rather than high: the product is still pre-launch (waitlist, staged onboarding) and no individual team members are named, so headcount beyond the founder(s) is unverified — but the incorporation plus accelerator membership is real-organization evidence.',
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
    maintainer: "company",
    entity: "BEY AGENCY LTD (England & Wales, company no. 16435596)",
    entityKind: "agency-studio",
    confidence: "high",
    evidence:
      "CONFIRMED by direct fetch of ai2.design/legal/license, which names BEY AGENCY LTD as the operating entity, registered in England & Wales under company number 16435596. The page sets out an open-core split — MIT for base UI components, shadcn registry items and docs code; a commercial licence for Framer/Next.js themes, Figma kits, blocks, sections and MCP Pro — with seat limits (Pro 1 seat, Ultimate up to 10), a twelve-downloads-per-twelve-hours fair-use cap, and the ai2 name and logo retained as BEY AGENCY LTD trademarks. Contacts hi@bey.agency and hello@ai2.design. A named, registered UK company operating the registry as a commercial product line.",
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
    maintainer: "individual",
    entity: '"findingsimo" (Simo) — whiskeyjack.net',
    entityKind: "individual",
    confidence: "medium",
    evidence:
      'Site footer is only "2026 Whiskeyjack.net" with no names; /about, /legal and /terms 404 and /contact says "email whiskeyjack.net@gmail.com". GitHub org whiskeyjack-net has no public members, and the npm package @whiskeyjack-net/i18n lists author "whiskeyjack.net" with a single maintainer, findingsimo <djsimo3001@gmail.com>. Apps are "All free to use" — one person\'s design system extracted from their own apps, no company evidence.',
  },
]
