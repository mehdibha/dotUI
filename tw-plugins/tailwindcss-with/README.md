# tailwindcss-with

A Tailwind CSS plugin that adds a `with-[value]` variant for conditional styling based on class presence.

## Installation

```bash
npm install tailwindcss-with
# or
pnpm add tailwindcss-with
```

## Usage

Add the plugin to your CSS (Tailwind v4):

```css
@plugin "tailwindcss-with";
```

Or in your Tailwind config (Tailwind v3):

```js
// tailwind.config.js
module.exports = {
  plugins: [require("tailwindcss-with")],
};
```

## How it works

This plugin creates a `with-[value]` variant that matches elements having a class starting with or containing `{value}-`.

Use with Tailwind's built-in `not-*` variant for negation:

- `with-[size]:w-auto` — applies when a `size-*` class is present
- `not-with-[size]:w-9` — applies when NO `size-*` class is present

## Example

```html
<!-- This button will have w-9 when no size-* class is present -->
<button class="not-with-[size]:w-9">Click me</button>

<!-- When you add size-12, the w-9 won't apply -->
<button class="not-with-[size]:w-9 size-12">Click me</button>
```

## Why this plugin?

When using inline Tailwind CSS selectors like `[&:not([class*='size-'])]:w-9`, the class name itself contains `size-`, causing the selector to never match (self-referencing problem).

This plugin solves that by:

1. The class name `not-with-[size]:w-9` contains `size]` (with a bracket)
2. The generated CSS checks for classes containing `size-` (with a hyphen)
3. Since `size]` ≠ `size-`, there's no self-referencing collision! ✅

## License

MIT
