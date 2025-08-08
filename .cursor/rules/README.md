# dotUI Cursor Rules

This directory contains cursor rules that provide context about the dotUI project to AI assistants.

## Files Overview

### `project-context.md`

Comprehensive overview of dotUI's goals, architecture, and philosophy:

- What dotUI is and how it differs from shadcn-ui
- Technical stack (React 19, Tailwind CSS 4.0, TypeScript, react-aria)
- Theme-driven approach and 6-color system
- Component design principles and monorepo structure

### `coding-standards.md`

Detailed coding patterns and best practices:

- Component development guidelines
- File organization patterns
- Code structure with tailwind-variants
- Accessibility and performance requirements
- Testing and documentation standards

## Quick Reference

### Key Technologies

- **React 19** + **TypeScript** (strict)
- **Tailwind CSS 4.0** + **tailwind-variants**
- **react-aria** (not radix-ui)
- **pnpm workspaces** + **Turbo**

### Color System

`neutral` | `accent` | `warning` | `info` | `danger` | `success`

### Component Pattern

```typescript
import { tv, type VariantProps } from "tailwind-variants";

const variants = tv({
  base: "...",
  variants: { /* ... */ },
  defaultVariants: { /* ... */ }
});

export const Component = forwardRef<HTMLElement, Props>((props, ref) => {
  // Implementation with react-aria
});
```

### CLI Usage

```bash
npx dotui-cli init <theme-name>
```

## Purpose

These rules help AI assistants understand:

1. **Project goals**: Building unique, theme-driven component libraries
2. **Technical constraints**: Modern React stack with specific library choices
3. **Code patterns**: Consistent component structure and styling approach
4. **Quality standards**: Accessibility, performance, and testing requirements

Having this context ensures more relevant and accurate assistance when working on dotUI components, themes, and features.
