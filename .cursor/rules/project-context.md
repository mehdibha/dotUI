# dotUI Project Context & Rules

## Project Overview

dotUI is a component library builder that helps developers quickly create component libraries with **unique looks**. Unlike shadcn-ui which provides the same starting point for everyone, dotUI offers custom starting points based on chosen or created themes.

## Core Philosophy & Goals

- **Style-driven**: Every component library starts with a style that defines colors, fonts, icons, component styles, and more.
- **Unique customization**: Enable developers to create distinctive component libraries, not generic ones with a visual builder
- **Modern stack**: Built with the latest React 19, Tailwind CSS 4.0, and TypeScript 5
- **Developer experience**: Simple CLI-based initialization with `shadcn-cli`

## Technical Architecture

### Technology Stack

- **React 19** (latest version)
- **Tailwind CSS 4.0** (latest version)
- **TypeScript** (strict type safety)
- **react-aria-components** (instead of radix-ui for accessibility)
- **tailwind-variants** (instead of cva for styling)

### Monorepo Structure

- **Monorepo**: pnpm workspaces + Turbo for build orchestration
- **`www/`**: Documentation website and theme builder
- **`packages/`**: Core packages (auth, db, api, validators)
- **`config/`**: Shared configuration files

### Color System

Uses a 6-color scale system:

1. **neutral** - Base grays/whites
2. **accent** - Primary brand colors
3. **warning** - Warning states
4. **info** - Informational states
5. **danger** - Error/destructive states
6. **success** - Success/positive states

## Component Design Principles

### Composition-First

- All components offer both composition and non-composition usage patterns
- Developers can choose their preferred API style

### Multiple Variants

- Each component provides multiple style variants
- Style-based customization for different looks

### Accessibility-First

- Built on react-aria-components for robust accessibility
- WCAG compliance by default

## Development Conventions

### Code Style

- Use TypeScript strictly
- Follow the existing prettier configuration
- Use tailwind-variants for component styling
- Prefer composition patterns where possible

### File Structure

- Group related components together
- Use barrel exports for clean imports
- Separate theme definitions from component logic

### Naming Conventions

- Use PascalCase for component names
- Use kebab-case for file names
- Theme names should be descriptive and unique

## CLI Integration

- Components are generated via ``
- Support for both existing and custom themes
- Theme builder integration for custom theme creation

## When Contributing

- Focus on theme flexibility and customization options
- Ensure accessibility compliance
- Test across different themes
- Document component variants and usage patterns
- Consider both composition and non-composition use cases

## Key Differentiators from shadcn-ui

1. **Theme-based starting points** instead of uniform starting point
2. **react-aria** instead of radix-ui
3. **tailwind-variants** instead of cva
4. **6-color scale system** for comprehensive theming
5. **Multiple component variants** for diverse design needs
6. **Composition flexibility** for different usage patterns
