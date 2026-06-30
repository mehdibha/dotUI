# Registry-wide StyleX parity audit (snapshot)

> Generated from the real `publish()` (StyleX engine) + `analyzeParity` over every component.
> A point-in-time sizing of the rollout — regenerate as the translator grows. Not kept current.

**66 components.** Which backend the StyleX export actually emits:

- **emits StyleX** (`stylex.create`): 41
- **no styling** (no `styles.ts` — identical file either engine): 22
- **inline `tv()`** (authored with `tv()` in base.tsx, not `createStyles` — needs conversion to emit StyleX): 3

Distinct uncovered same-element utilities still to map (the `unknown` work-list): **289**.
Translatable now, but the per-component descendant/group/has remainder is flagged inline as `PARITY-TODO` in each export.

| component | StyleX backend | parity difficulty | uncovered utils |
|---|---|---|--:|
| accordion | stylex | descendant | 1 |
| alert | stylex | descendant | 9 |
| avatar | tv-inline | trivial | 0 |
| badge | stylex | descendant | 0 |
| breadcrumbs | stylex | descendant | 4 |
| button | stylex | descendant | 0 |
| calendar | stylex | descendant | 13 |
| card | stylex | descendant | 17 |
| chart | no-styles | trivial | 0 |
| chart-area | no-styles | trivial | 0 |
| chart-bar | no-styles | trivial | 0 |
| chart-line | no-styles | trivial | 0 |
| chart-pie | no-styles | trivial | 0 |
| chart-radar | no-styles | trivial | 0 |
| chart-radial | no-styles | trivial | 0 |
| checkbox | stylex | descendant | 12 |
| checkbox-group | tv-inline | trivial | 0 |
| color-area | stylex | ancestor | 2 |
| color-editor | no-styles | trivial | 0 |
| color-field | no-styles | trivial | 0 |
| color-picker | no-styles | trivial | 0 |
| color-slider | stylex | descendant | 3 |
| color-swatch | tv-inline | trivial | 0 |
| color-swatch-picker | stylex | descendant | 2 |
| color-thumb | stylex | ancestor | 6 |
| combobox | no-styles | trivial | 0 |
| command | stylex | descendant | 2 |
| context-menu | no-styles | trivial | 0 |
| date-field | no-styles | trivial | 0 |
| date-picker | no-styles | trivial | 0 |
| dialog | stylex | ancestor | 10 |
| disclosure | stylex | descendant | 6 |
| drawer | stylex | extend | 44 |
| drop-zone | stylex | extend | 5 |
| empty | stylex | descendant | 7 |
| field | stylex | descendant | 5 |
| file-trigger | no-styles | trivial | 0 |
| group | stylex | descendant | 4 |
| kbd | stylex | descendant | 1 |
| link | stylex | trivial | 0 |
| list-box | stylex | descendant | 14 |
| loader | no-styles | trivial | 0 |
| mention | stylex | extend | 1 |
| menu | stylex | descendant | 6 |
| modal | stylex | descendant | 21 |
| number-field | no-styles | trivial | 0 |
| pagination | stylex | descendant | 2 |
| popover | stylex | descendant | 19 |
| radio-group | stylex | ancestor | 8 |
| search-field | no-styles | trivial | 0 |
| select | no-styles | trivial | 0 |
| separator | stylex | extend | 1 |
| sidebar | stylex | descendant | 31 |
| skeleton | stylex | descendant | 3 |
| switch | stylex | ancestor | 13 |
| table | stylex | descendant | 35 |
| tabs | stylex | descendant | 20 |
| tag-group | stylex | descendant | 5 |
| text | no-styles | trivial | 0 |
| text-field | no-styles | trivial | 0 |
| time-field | no-styles | trivial | 0 |
| toast | stylex | descendant | 45 |
| toggle-button | stylex | descendant | 5 |
| toggle-button-group | stylex | descendant | 3 |
| tooltip | stylex | descendant | 19 |
| tree | stylex | descendant | 11 |

## Uncovered same-element utilities (the translator’s to-do list)

- `-ml-1`
- `-space-x-px`
- `-translate-x-1/2`
- `-translate-x-px`
- `@container-[size]`
- `@container/card-header`
- `@container/field-group`
- `[.border-b]:pb-4`
- `[.border-b]:pb-6`
- `[.border-t]:pt-4`
- `[.border-t]:pt-6`
- `[@container_(height<31.25rem)]:overflow-y-auto`
- `[svg~&]:col-start-2`
- `align-middle`
- `animate-spin`
- `aria-disabled:opacity-50`
- `aria-disabled:pointer-events-none`
- `aspect-square`
- `auto-rows-min`
- `backdrop-blur`
- `backdrop-blur-(--modal-backdrop-blur)`
- `backdrop-blur-[2px]`
- `bg-black`
- `bg-black/(--modal-backdrop-opacity)`
- `bg-black/70`
- `bg-clip-content`
- `bg-neutral-900/50`
- `bg-white`
- `border-2`
- `border-b`
- `border-b-0`
- `border-dashed`
- `border-l`
- `border-l-0`
- `border-r-0`
- `border-t`
- `border-t-0`
- `border-white`
- `bottom-0`
- `box-border`
- `col-start-2`
- `contents`
- `data-[empty]:text-center`
- `data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+100%+var(--toast-inset)))]`
- `data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-100%-var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]`
- `data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+100%+var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]`
- `data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-100%-var(--toast-inset)))]`
- `data-[ending-style]:not-data-limited:not-data-[swipe-direction]:[transform:translateY(calc(100%+var(--toast-inset)))]`
- `data-[ending-style]:shadow-none`
- `data-[focus-visible]:z-20`
- `data-[nested-drawer-open]:overflow-hidden`
- `data-[position*=bottom]:bottom-(--toast-inset)`
- `data-[position*=bottom]:bottom-0`
- `data-[position*=bottom]:data-[starting-style]:[transform:translateY(calc(100%+var(--toast-inset)))]`
- `data-[position*=bottom]:data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--toast-calc-offset-y))]`
- `data-[position*=bottom]:origin-[50%_calc(50%+50%*min(var(--toast-index),1))]`
- `data-[position*=bottom]:top-auto`
- `data-[position*=center]:-translate-x-1/2`
- `data-[position*=center]:left-0`
- `data-[position*=center]:left-1/2`
- `data-[position*=center]:right-0`
- `data-[position*=left]:left-(--toast-inset)`
- `data-[position*=left]:left-0`
- `data-[position*=left]:right-auto`
- `data-[position*=right]:left-auto`
- `data-[position*=right]:right-(--toast-inset)`
- `data-[position*=right]:right-0`
- `data-[position*=top]:bottom-auto`
- `data-[position*=top]:data-[starting-style]:[transform:translateY(calc(-100%-var(--toast-inset)))]`
- `data-[position*=top]:data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--toast-calc-offset-y))]`
- `data-[position*=top]:origin-[50%_calc(50%-50%*min(var(--toast-index),1))]`
- `data-[position*=top]:top-(--toast-inset)`
- `data-[position*=top]:top-0`
- `data-[show-on-hover]:focus-within:opacity-100`
- `data-[show-on-hover]:md:opacity-0`
- `data-[starting-style]:shadow-none`
- `data-[swiping]:duration-0`
- `data-[variant=danger]:focus:bg-danger-muted`
- `data-[variant=outline]:hover:bg-muted`
- `data-[variant=outline]:shadow-xs`
- `data-behind:not-data-expanded:pointer-events-none`
- `data-expanded:data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+100%+var(--toast-inset)))]`
- `data-expanded:data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-100%-var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]`
- `data-expanded:data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+100%+var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]`
- `data-expanded:data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-100%-var(--toast-inset)))]`
- `data-selection-mode:disabled:cursor-disabled`
- `disabled:[background:var(--color-disabled)]!`
- `disabled:bg-disabled!`
- `disabled:indeterminate:bg-disabled`
- `disabled:not-current:text-fg-disabled`
- `disabled:selected:bg-disabled`
- `disabled:selected:border-transparent`
- `disabled:selected:text-fg-disabled`
- `dragging:bg-accent-muted/70`
- `dragging:cursor-grabbing`
- `dragging:opacity-60`
- `dragging:opacity-70`
- `dragging:text-fg`
- `drop-target:bg-accent-muted`
- `drop-target:bg-accent-muted/70`
- `drop-target:border-border-focus`
- `drop-target:text-fg`
- `duration-150`
- `duration-200`
- `duration-250`
- `duration-300`
- `duration-500`
- `duration-75`
- `ease-[cubic-bezier(0.165,0.84,0.44,1)]`
- `ease-fluid-out`
- `ease-out`
- `empty:hidden`
- `empty:text-fg-muted`
- `entering:opacity-0`
- `entering:scale-95`
- `entering:transform-(--origin)`
- `exiting:duration-150`
- `exiting:opacity-0`
- `exiting:scale-95`
- `exiting:transform-(--origin)`
- `flex-1`
- `flex-col`
- `flex-col-reverse`
- `flex-row`
- `flex-wrap`
- `focus-visible:-outline-offset-2`
- `focus-visible:outline-2`
- `focus-visible:outline-border-focus`
- `focus-visible:z-20`
- `focus:z-10`
- `font-heading`
- `font-sans`
- `forced-color-adjust-none`
- `grid-cols-7`
- `grid-rows-[1fr_auto]`
- `grid-rows-[auto_1fr]`
- `hover:[a]:text-fg`
- `hover:not-in-data-[trigger=ComboBox]:not-in-data-[trigger=Select]:bg-highlight`
- `hover:not-in-data-[trigger=ComboBox]:not-in-data-[trigger=Select]:text-fg-on-highlight`
- `indeterminate:bg-primary`
- `indeterminate:border-transparent`
- `indeterminate:text-fg-on-primary`
- `inset-0`
- `inset-x-0`
- `inset-y-0`
- `invalid:border-border-danger`
- `invalid:selected:bg-danger-muted`
- `invalid:selected:text-fg-onMutedDanger`
- `isolate`
- `items-stretch`
- `justify-end`
- `justify-self-end`
- `justify-start`
- `last:mt-0`
- `layout-grid:gap-1`
- `layout-grid:grid`
- `layout-grid:orientation-horizontal:grid-flow-col`
- `layout-grid:orientation-horizontal:grid-rows-2`
- `layout-grid:orientation-vertical:grid-cols-2`
- `layout-stack:orientation-horizontal:flex`
- `layout-stack:orientation-horizontal:flex-row`
- `left-0`
- `max-sm:col-start-2`
- `max-sm:mt-2`
- `max-w-sm`
- `max-w-xs`
- `mb-2`
- `md:block`
- `md:flex`
- `min-h-screen`
- `min-h-svh`
- `ml-2`
- `motion-safe:transition-[height,opacity]`
- `motion-safe:transition-[translate,width,height]`
- `mr-1`
- `mx-auto`
- `not-in-selection-start:not-in-selection-end:hover:bg-[color-mix(in_srgb,var(--color-accent)_20%,var(--color-bg))]`
- `nth-last-2:-mt-1`
- `orientation-horizontal:bottom-[-5px]`
- `orientation-horizontal:h-0.5`
- `orientation-horizontal:left-0`
- `orientation-horizontal:w-full`
- `orientation-vertical:-right-1`
- `orientation-vertical:h-full`
- `orientation-vertical:top-0`
- `orientation-vertical:w-0.5`
- `origin-(--trigger-anchor-point)`
- `origin-left`
- `origin-right`
- `outline-hidden`
- `outside-month:pointer-events-none`
- `outside-month:text-fg-disabled`
- `overflow-auto`
- `overflow-clip`
- `overflow-hidden`
- `overflow-visible`
- `overflow-y-auto`
- `place-content-center`
- `placement-bottom:[--origin:translateY(calc(var(--slide-offset)*-1))]`
- `placement-left:[--origin:translateX(var(--slide-offset))]`
- `placement-right:[--origin:translateX(calc(var(--slide-offset)*-1))]`
- `placement-top:[--origin:translateY(var(--slide-offset))]`
- `pointer-events-auto`
- `popover`
- `read-only:cursor-default`
- `resizing:bg-border-focus`
- `resizing:pl-[7px]`
- `resizing:w-0.5`
- `right-0`
- `right-1`
- `right-2`
- `right-3`
- `right-4`
- `ring-1`
- `ring-black/40`
- `rounded-b-(--card-radius)`
- `rounded-b-xl`
- `rounded-l-xl`
- `rounded-r-xl`
- `rounded-t-(--card-radius)`
- `rounded-t-xl`
- `row-span-2`
- `row-start-1`
- `row-start-2`
- `scroll-my-1`
- `scroll-pt-10`
- `scroll-pt-12`
- `scroll-pt-8`
- `selected:hover:bg-selected-hover`
- `selected:ml-4`
- `selected:ml-5`
- `selected:ml-6`
- `selected:not-data-disabled:border-border-active`
- `selected:pressed:bg-selected-active`
- `selected:pressed:ml-3`
- `selected:pressed:ml-4`
- `selected:pressed:ml-5`
- `selection-end:rounded-r-full`
- `selection-start:rounded-l-full`
- `self-start`
- `separator`
- `shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.35)]`
- `shadow-lg`
- `shadow-md`
- `shadow-sm`
- `shadow-xs`
- `skeleton--none`
- `skeleton--pulse`
- `skeleton--shimmer`
- `sm:[--toast-inset:--spacing(6)]`
- `sm:[[data-alert-title]~&]:col-start-2`
- `sm:[svg~&]:col-start-2`
- `sm:[svg~[data-alert-description]~&]:col-start-3`
- `sm:[svg~[data-alert-title]~&]:col-start-3`
- `sm:flex`
- `sm:flex-row`
- `sm:justify-end`
- `sm:max-h-[calc(var(--visual-viewport-height)*.9)]`
- `sm:max-w-md`
- `sm:max-w-sm`
- `sm:row-end-3`
- `sm:row-start-1`
- `sticky`
- `supports-[-moz-appearance:none]:bg-bg`
- `tabular-nums`
- `text-balance`
- `text-center`
- `text-left`
- `top-0`
- `top-1.5`
- `top-2`
- `top-3.5`
- `top-4`
- `touch-none`
- `translate-x-2`
- `translate-x-px`
- `unavailable:line-through`
- `unavailable:text-fg-disabled`
- `will-change-[transform,height]`
- `will-change-[transform,opacity,scale]`
- `wrap-break-word`
- `z-0`
- `z-1`
- `z-10`
- `z-100`
- `z-20`
- `z-30`
- `z-50`
- `z-[calc(50-var(--toast-index))]`
