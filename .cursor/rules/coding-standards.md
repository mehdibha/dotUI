# dotUI Coding Standards & Patterns

## Component Development Guidelines

### Component Structure

```typescript
// Preferred component structure
import { tv, type VariantProps } from "tailwind-variants";
import { forwardRef } from "react";

// 1. Define variants first
const buttonVariants = tv({
  base: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      // ... more variants
    },
    size: {
      default: "h-10 py-2 px-4",
      sm: "h-9 px-3 rounded-md",
      lg: "h-11 px-8 rounded-md",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

// 2. Define component props interface
interface ComponentProps extends VariantProps<typeof buttonVariants> {
  // Additional props here
}

// 3. Component implementation with forwardRef for react-aria compatibility
export const Component = forwardRef<HTMLElement, ComponentProps>((props, ref) => {
  // Implementation
});
```

### Style Integration

- Always use CSS custom properties for colors: `bg-primary`, `text-accent`, etc.
- Support theme switching through CSS custom property updates
- Test components across all 6 color scales (neutral, accent, warning, info, danger, success)

### Accessibility Requirements

- Use react-aria components as building blocks
- Always include proper ARIA labels and descriptions
- Support keyboard navigation
- Ensure sufficient contrast ratios
- Test with screen readers

## File Organization

### Component Files

```
components/
├── ui/
│   ├── button/
│   │   ├── index.ts          # Barrel export
│   │   ├── button.tsx        # Main component
│   │   ├── button.variants.ts # Tailwind variants
│   │   └── button.stories.tsx # Storybook stories
│   └── ...
```

### Theme Files

```
themes/
├── default/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── index.ts
└── ...
```

## Code Patterns

### Variant Definitions

- Use `tailwind-variants` consistently
- Define base styles first, then variants
- Always provide sensible default variants
- Group related variants together
- Document variant purposes with comments

### Component Composition

```typescript
// Support both composition and non-composition patterns
// Composition pattern
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
  </DialogContent>
</Dialog>

// Non-composition pattern
<Dialog
  trigger="Open"
  title="Title"
  content="Content"
/>
```

### Type Safety

- Use strict TypeScript configuration
- Define interfaces for all component props
- Use `VariantProps` from tailwind-variants for variant typing
- Export all types for external usage

## Performance Considerations

### Bundle Size

- Use tree-shaking friendly exports
- Lazy load components when possible
- Minimize external dependencies
- Use React.lazy for large components

### Runtime Performance

- Memoize expensive calculations
- Use `useMemo` and `useCallback` appropriately
- Avoid inline object creation in render
- Optimize re-renders with React.memo when needed

## Testing Standards

### Unit Tests

- Test all component variants
- Test accessibility features
- Test keyboard interactions
- Test theme switching
- Cover edge cases and error states

### Visual Testing

- Include Storybook stories for all variants
- Test across different themes
- Include interaction examples
- Document component usage patterns

## Documentation Requirements

### Component Documentation

- Include usage examples for all variants
- Document accessibility features
- Provide theme customization examples
- Include do's and don'ts
- Show both composition and non-composition usage

### Code Comments

- Document complex variant logic
- Explain accessibility implementations
- Comment theme-related calculations
- Document breaking changes in component APIs

## CLI Integration Patterns

### Component Generation

- Components should be CLI-generatable
- Include all necessary imports and dependencies
- Generate with proper theme integration
- Include basic tests and stories

### Theme Compatibility

- Components must work with any theme
- Avoid hardcoded color values
- Use semantic color naming
- Support theme customization points

## Error Handling

### Component Errors

- Provide meaningful error messages
- Handle edge cases gracefully
- Include fallback UI when appropriate
- Log errors for debugging in development

### Type Errors

- Use discriminated unions for complex props
- Provide helpful TypeScript error messages
- Document required vs optional props clearly
- Use generic types for reusable patterns
