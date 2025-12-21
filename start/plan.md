# Docs Module Migration Plan

## Step 0: Review Folder Structure

Before migrating, review the current www docs module structure:

```
www/modules/docs/
├── api-reference/       # Props documentation tables
├── code-block/          # Syntax highlighting components
├── demo/                # Component demo rendering
├── interactive-demo/    # Playground with live editing
├── toc/                 # Table of contents
├── docs-copy-page.tsx   # Copy page content feature
├── docs-pager.tsx       # Prev/next navigation
├── example.tsx          # Single example display
├── examples.tsx         # Examples grid
├── last-update.tsx      # Last modified date
├── mdx-components.tsx   # MDX component mappings
├── page-tabs.tsx        # Overview/Examples tabs
└── source.tsx           # Re-exports sources
```

### Questions to answer:
- [ ] Does this belong in `modules/`? Or should it be in `components/docs/`?
- [ ] Is the nesting appropriate? (e.g., code-block as subfolder vs flat)
- [ ] What's the relationship between these components?
- [ ] Which are truly "docs-specific" vs reusable?
- [ ] Should api-reference be its own module?
- [ ] Should demo/interactive-demo be part of a "playground" or "styles" module instead?

### Proposed structure considerations:
- `mdx-components.tsx` - Core, needed for any MDX rendering
- `code-block/` - Could be reusable outside docs
- `toc/` - Docs-specific, keep here
- `api-reference/` - Docs-specific, but complex - own module?
- `demo/`, `interactive-demo/` - Tied to styles feature, maybe move to styles module?

---

> **Important:** When migrating files, always review them. Look for:
> - Unnecessary dependencies (e.g., markdown-to-jsx for simple text)
> - Next.js-specific code to replace (next/image, next/navigation)
> - Code that can be simplified or enhanced
> - Better naming conventions
> - Folder structure improvements
> - Dead code or unused imports
> - Opportunities to use TanStack-specific patterns (createIsomorphicFn, etc.)

## Current Status

- [x] Fumadocs core setup (source.config.ts, vite plugin, lib/source.ts)
- [x] Docs route (/docs/$.tsx) with clientLoader pattern
- [x] Content copied from www
- [ ] Docs module migration (in progress)

## Docs Module Components

### Core (Required)
- [ ] **mdx-components.tsx** - MDX component mappings
  - [x] Remove next/image → use native `<img>`
  - [ ] Review all component mappings

- [ ] **code-block/** - Syntax highlighting
  - [x] code-block-tabs.tsx - Use createIsomorphicFn for localStorage (not jotai)
  - [ ] code-block.tsx - Needs useCopyToClipboard hook
  - [ ] dynamic-pre.tsx - Review

- [ ] **toc/** - Table of contents
  - [ ] toc.tsx - Should work as-is (React only)
  - [ ] toc-primitive.tsx - Should work as-is

### Secondary (Can be stubbed initially)
- [ ] **page-tabs.tsx** - Overview/Examples tabs
  - [x] Simplified to not use URL routing (all tabs same page)

- [ ] **api-reference/** - Props documentation
  - [x] Remove markdown-to-jsx → use plain text
  - [ ] Review types and rendering

- [ ] **demo/** - Component demos
  - Depends on styles module (ActiveStyleProvider, useActiveStyle)
  - Can stub for now, implement when styles module is ready

- [ ] **interactive-demo/** - Playground demos
  - Same as demo - depends on styles module
  - Can stub for now

### Helpers
- [ ] **docs-pager.tsx** - Prev/Next navigation
- [ ] **docs-copy-page.tsx** - Copy page content
- [ ] **example.tsx** - Single example display (stubbed)
- [ ] **examples.tsx** - Examples grid
- [ ] **last-update.tsx** - Last modified date
- [ ] **source.tsx** - Re-exports sources (may not be needed)

## Missing Dependencies

### Hooks (to create in src/hooks/)
- [ ] use-copy-to-clipboard.ts
- [ ] use-mounted.ts

### Modules (stub or implement later)
- [ ] styles module (ActiveStyleProvider, useActiveStyle, etc.)
  - Complex feature, defer to later phase

## Build Issues to Fix
1. [x] markdown-to-jsx - removed, use plain text
2. [ ] useCopyToClipboard hook - create in src/hooks/
3. [ ] useMounted hook - create in src/hooks/
4. [ ] styles module imports - stub the components that need it

## Next Steps
1. Create missing hooks (use-copy-to-clipboard, use-mounted)
2. Stub demo/interactive-demo components
3. Get build passing
4. Test docs pages render correctly
5. Iterate on styling and functionality
