# Styles Migration

## Architecture

**Before:** Each style variant = separate file (`button/base.tsx`, `button/brutalist.tsx`). Meta pointed to different files. CLI installed the chosen file.

**Now:**
- `base.tsx` = single component file with logic + `useStyles()` hook
- `styles.ts` = all style definitions in one place (base, brutalist, etc.)
- **Docs/preview**: `StyleProvider` context picks the active style → `useStyles()` returns the right one
- **CLI install**: transforms `base.tsx` → removes `useStyles()` → inlines the chosen style's `tv()` definition → outputs as `button.tsx`

## Naming

- **Preset** = entire design system config (colors, fonts, component style selections)
- **Style** = per-component visual option (`"base"`, `"brutalist"`, etc.)

## Pattern

### `meta.ts`

Renamed `variants`/`defaultVariant` → `styles`/`defaultStyle`. Styles are component-level (not inside `files`). `styles.ts` is not listed in `files` (internal only).

```ts
import type { RegistryItem } from "@/registry/types";

const buttonMeta = {
  name: "button",
  type: "registry:ui",
  group: "buttons",
  defaultStyle: "default",
  styles: {
    default: {},
    brutalist: {},
  },
  files: [
    { type: "registry:ui", path: "ui/button/base.tsx", target: "ui/button.tsx" },
  ],
  registryDependencies: ["loader", "focus-styles"],
} satisfies RegistryItem;

export default buttonMeta;

export type ButtonStyle = keyof typeof buttonMeta.styles;
export const buttonStyleNames = Object.keys(buttonMeta.styles) as ButtonStyle[];
export const defaultButtonStyle = buttonMeta.defaultStyle;
```

### `RegistryItem` type

```ts
export type StyleMeta = {
  description?: string;
};

export type RegistryItem = ShadcnRegistryItem &
  (
    | {
        styles: Record<string, StyleMeta>;
        defaultStyle: string;
      }
    | { styles?: never; defaultStyle?: never }
  ) & {
    group?: ComponentGroup | null;
  };
```

### `styles.ts`

Each component gets a `styles.ts` that extracts `tv()` definitions from `base.tsx`. `createStyles` takes the meta object so style map keys are type-checked against `meta.styles`.

```ts
import { tv } from "tailwind-variants";
import { createStyles } from "@/modules/core/styles";
import componentMeta from "./meta";

const baseStyles = tv({
  base: "",
});

const defaultStyles = tv({
  extend: baseStyles,
  base: "...", // all current styles go here
});

// Export type for VariantProps usage in base.tsx
export type ComponentStyles = typeof defaultStyles;

export const { useStyles } = createStyles(componentMeta, {
  default: defaultStyles,
});
```

For slot-based components:
```ts
const baseStyles = tv({
  slots: { root: "", title: "" },
});

const defaultStyles = tv({
  extend: baseStyles,
  slots: { root: "...", title: "..." },
  variants: { ... },
});

export type ComponentStyles = typeof defaultStyles;
```

### `base.tsx`

- Remove `import { tv } from "tailwind-variants"` (keep `VariantProps` if used for prop types)
- Add `import { useStyles } from "./styles"`
- If `VariantProps` is used, add `import type { ComponentStyles } from "./styles"` and use `VariantProps<ComponentStyles>`
- Replace inline `tv()` calls with `useStyles()` inside component functions
- For slot-based components, move `const { root, ... } = useStyles()()` inside each component function
- Add `// MARK: componentStyles` where the inlined `tv()` constant will go during CLI transform
- Add `// MARK: seperator` between each sub-component

#### CLI transform

When installed via CLI, the code is transformed:
- `import { useStyles } from "./styles"` → removed
- `import type { ComponentStyles } from "./styles"` → removed
- `ComponentStyles` → `typeof componentStyles` (e.g. `AlertStyles` → `typeof alertStyles`)
- `useStyles()` → `componentStyles` (the inlined tv constant)
- `useStyles()()` (slot-based) → `componentStyles()`
- `// MARK: componentStyles` → `const componentStyles = tv({ ... })` (the chosen style's tv definition inlined)
- `// MARK: seperator` → the visual separator comment (`/* ---...--- */`)

### `examples.tsx`

- Import `Examples` from `@/modules/create/preview/examples`
- Wrap all examples in `<Examples>` instead of `<>`
- Use named export: `ComponentNameExamples`

```tsx
import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

export default function ComponentNameExamples() {
  return (
    <Examples>
      <Example title="...">...</Example>
    </Examples>
  );
}
```

### `createStyles`

Takes the meta object directly. `T` is inferred from the styles map, and keys are type-checked against `meta.styles` — missing a key is a compile error.

```ts
function createStyles<
  M extends { name: string; defaultStyle: string; styles: Record<string, unknown> },
  T extends Record<keyof M["styles"] & string, unknown>,
>(meta: M, stylesMap: T) {
  function useStyles(): T[keyof T] {
    const selections = React.useContext(StyleContext);
    const selected = selections[meta.name];
    if (selected && selected in stylesMap) {
      return stylesMap[selected as keyof T];
    }
    return stylesMap[meta.defaultStyle as keyof T];
  }
  return { useStyles };
}
```

## Special cases

- `field/base.tsx`: exports `fieldStyles` (used by 11 consumers) — re-export from `styles.ts`
- `toggle-button/base.tsx`: exports `toggleButtonStyles` (type import by toggle-button-group)
- `button/base.tsx`: exports `buttonStyles`
- `link/base.tsx`: exports `linkVariants`

## Migration checklist

### `meta.ts` (rename `variants`→`styles`, `defaultVariant`→`defaultStyle`, update exports)

- [x] accordion
- [x] alert
- [x] avatar
- [ ] badge
- [ ] breadcrumbs
- [ ] button
- [ ] calendar
- [ ] card
- [ ] checkbox
- [ ] checkbox-group
- [ ] color-area
- [ ] color-editor
- [ ] color-field
- [ ] color-picker
- [ ] color-slider
- [ ] color-swatch
- [ ] color-swatch-picker
- [ ] color-thumb
- [ ] combobox
- [ ] command
- [ ] date-field
- [ ] date-picker
- [ ] dialog
- [ ] disclosure
- [ ] drawer
- [ ] drop-zone
- [ ] empty
- [ ] field
- [ ] file-trigger
- [ ] form (no meta — skip?)
- [ ] group
- [ ] input
- [ ] kbd
- [ ] link
- [ ] list-box
- [ ] loader
- [ ] menu
- [ ] modal
- [ ] number-field
- [ ] overlay
- [ ] popover
- [ ] progress-bar
- [ ] radio-group
- [ ] react-hook-form
- [ ] search-field
- [ ] select
- [ ] separator
- [ ] sidebar
- [ ] skeleton
- [ ] slider
- [ ] switch
- [ ] table
- [ ] tabs
- [ ] tag-group
- [ ] text
- [ ] text-field
- [ ] time-field
- [ ] toast
- [ ] toggle-button
- [ ] toggle-button-group
- [ ] tooltip

### `styles.ts` (create, extract `tv()` from `base.tsx`)

- [x] accordion
- [x] alert
- [x] avatar
- [ ] badge
- [ ] breadcrumbs
- [ ] button
- [ ] calendar
- [ ] card
- [ ] checkbox
- [ ] color-area
- [ ] color-field
- [ ] color-slider
- [ ] color-swatch
- [ ] color-swatch-picker
- [ ] color-thumb
- [ ] command
- [ ] date-field
- [ ] date-picker
- [ ] dialog
- [ ] disclosure
- [ ] drawer
- [ ] drop-zone
- [ ] empty
- [ ] field
- [ ] group
- [ ] input
- [ ] kbd
- [ ] link
- [ ] list-box
- [ ] menu
- [ ] modal
- [ ] popover
- [ ] progress-bar
- [ ] radio-group
- [ ] search-field
- [ ] select
- [ ] separator
- [ ] sidebar
- [ ] slider
- [ ] switch
- [ ] table
- [ ] tabs
- [ ] tag-group
- [ ] text-field
- [ ] time-field
- [ ] toast
- [ ] toggle-button
- [ ] toggle-button-group
- [ ] tooltip

### `examples.tsx` (wrap in `<Examples>`)

- [x] accordion
- [x] alert
- [x] avatar
- [ ] badge
- [ ] breadcrumbs
- [ ] button
- [ ] checkbox
- [ ] checkbox-group
- [ ] color-area
- [ ] color-editor
- [ ] color-field
- [ ] color-picker
- [ ] color-slider
- [ ] color-swatch
- [ ] color-swatch-picker
- [ ] combobox
- [ ] command
- [ ] date-field
- [ ] date-picker
- [ ] dialog
- [ ] disclosure
- [ ] drawer
- [ ] drop-zone
- [ ] empty
- [ ] file-trigger
- [ ] form
- [ ] group
- [ ] list-box
- [ ] menu
- [ ] modal
- [ ] number-field
- [ ] overlay
- [ ] popover
- [ ] progress-bar
- [ ] radio-group
- [ ] react-hook-form
- [ ] search-field
- [ ] select
- [ ] separator
- [ ] skeleton
- [ ] slider
- [ ] switch
- [ ] table
- [ ] tabs
- [ ] tag-group
- [ ] text-area
- [ ] text-field
- [ ] time-field
- [ ] toggle-button
- [ ] toggle-button-group
- [ ] tooltip

### Components without `tv()` (skip `styles.ts`, only update `meta.ts` + `examples.tsx`)

checkbox-group, color-editor, color-picker, combobox, file-trigger, loader, number-field, overlay, skeleton, text

### Components without `examples.tsx` (skip examples update)

calendar, card, color-thumb, field, header, heading, input, kbd, link, loader, pagination, sidebar, tanstack-form, text, toast, tree

### Also needs migration

- `www/src/registry/lib/focus-styles/meta.ts` — uses old `variants`/`defaultVariant` pattern
