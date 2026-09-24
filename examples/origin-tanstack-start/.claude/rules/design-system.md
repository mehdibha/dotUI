---
paths:
  - "**/*.{tsx,jsx}"
---

# Design system

This app's UI is built with Design system, a dotUI design system (React Aria Components + Tailwind CSS v4).

Before writing or changing UI:
- Read `DESIGN.md` (tokens, voice, rules) and follow the `design-system` skill at `.agents/skills/design-system/SKILL.md`.
- Compose components from `components/ui/`; never rebuild them. Add missing ones with `npx shadcn@latest add @dotui/<name>`.
- React Aria APIs, not Radix: `onPress`, `isDisabled`, no `asChild`.
- Semantic color tokens only (`bg-primary`, `text-fg-muted`, `border-border`) — no hex values or palette classes.
