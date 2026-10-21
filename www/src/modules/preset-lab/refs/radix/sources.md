# Radix Themes: sources

Radix publishes its tokens and component styles as code, so values come from the packages first and the docs pages confirm them as rendered.

## Official tokens

- [`@radix-ui/themes` 3.3.0](https://www.npmjs.com/package/@radix-ui/themes): `src/styles/tokens/*.css` (radius, space, typography, shadows, cursors) and `src/components/**/*.css`. Read 2026-10-21.
- [`@radix-ui/colors` 3.0.0](https://www.npmjs.com/package/@radix-ui/colors): `indigo`, `slate`, their `-dark` and `-alpha` scales, `black-alpha`. Read 2026-10-21.
- Theme defaults, as the docs render them: `accentColor="indigo"`, `grayColor="slate"` (auto for indigo), `radius="medium"`, `scaling="100%"`, `panelBackground="translucent"`.

Key values (medium radius, 100% scaling):

| Token                                    | Light                | Dark              |
| ---------------------------------------- | -------------------- | ----------------- |
| Page, `--color-background`               | `#ffffff`            | slate-1 `#111113` |
| Text, slate-12                           | `#1c2024`            | `#edeef0`         |
| Accent solid, indigo-9                   | `#3e63dd`            | `#3e63dd`         |
| Focus ring, indigo-8 (2px, offset 2px)   | `#8da4ef`            | `#435db1`         |
| Field surface, `--color-surface`         | white 85%            | black 25%         |
| Field edge                               | slate-a7             | slate-a7          |
| Menus and dialogs, `--color-panel-solid` | `#ffffff`            | slate-2 `#18191b` |
| Dialog scrim, `--color-overlay`          | black 40%            | black 60%         |
| Radii `--radius-1…6`                     | 3, 4, 6, 8, 12, 16px | same              |

Sizes at the default size 2: buttons, fields, selects and menu rows 32px; tabs 40px; checkbox 16px; switch 35×20; badge (size 1) 20px; tooltip 4px 8px padding, 4px radius; dialog (size 3) 24px padding, 12px radius; card (size 1) 12px padding, 8px radius.

## Measured pages

The component pages of the Radix Themes docs, headless at 1440×900, light and dark through `prefers-color-scheme`, 2026-10-21. `targets.json` lists each page's parts, scoped to the demo previews (`.radix-themes-default-fonts`) so they skip the docs chrome; each part is the page's first example at the default size and variant. `pnpm --filter www presets:measure --pack radix` re-measures them all into `tokens.json` (probe 44f1c5f).

- `button.focus` tabs to the solid button. The dropdown menu opens from its first button ("Options"), the dialog from "Edit profile", and the tooltip shows on hovering the first icon button.
- `button.secondary` is the dialog's "Cancel", Radix's `variant="soft" color="gray"`.
- `badge` is the gray soft badge, `badge.accent` the indigo one, both size 1. `kbd` is the standalone keycap.

Where the two sides draw a property in different places, the part skips it (`skip` in `targets.json`):

- Radix draws every edge as an inset ring, so `borderColor` and `borderWidth` are skipped throughout, and `boxShadow` where the only shadow is that ring (fields, checkbox, switch). `edge` carries them.
- Checkbox, switch and card boxes are read from `::before` (`box`). The card's `::before` sits 1px inside its 8px corners, so it reads 7px. The switch's on track is a gradient stop over gray-a3, so `switch.on` skips its fill: per `switch.css` it is accent-9, #3e63dd in both modes.
- Tabs read their label (`.rt-TabsTriggerInner`), which turns 500 when active while the trigger stays 400. The trigger's radius is skipped, since Radix rounds only the label's hover fill.
- Menu, dialog and card skip content heights, ink and inline padding. Radix pads the menu inside its viewport (8px), and the dialog (24px at size 3) and card (12px) on boxes dotUI pads elsewhere. The menu also skips `ring`: its content takes focus on open, so its edge ring reads as a focus ring.
- The text field skips `paddingInline`: the root pads 1px and the input slot 7px, an 8px text inset in all.
- `button.focus` skips `boxShadow`, since dotUI draws its ring there and Radix in an outline. `ring` compares both.
- `page` is the demo preview, its fill, ink and type only. The docs site sets its own font (Untitled Sans) on its chrome.
- Type parts keep their ink. `text` and `text.muted` skip heights (the paragraphs wrap), and `link` skips its size, inherited from the text around it.

`input.focus` is kept by hand from `text-field.css`, since the probe reads a ring on the focused element and Radix draws it on the root through `:focus-within`: a 2px outline on `--focus-8` (#8da4ef / #435db1) at -1px, covering the 1px edge.

## Not in Radix Themes

No sidebar or app shell, command palette, toast, accordion, calendar, date picker, breadcrumbs, pagination, number or OTP field. Those sheets are inferred from the rest of the system.
