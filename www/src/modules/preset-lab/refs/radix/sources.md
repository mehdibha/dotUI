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

The component pages of the Radix Themes docs, headless at 1440×900, light and dark through `prefers-color-scheme`, 2026-10-21. `targets.json` lists each page's parts; each part is the page's first example at the default size and variant.

The probe reads a part as-is, and four parts need a step first, so these were measured with a scratch script around the same probe:

- `dropdown-menu`: click the first button below the header ("Options"), then measure `menu` and `menu.item`.
- `dialog`: click "Edit profile", then measure `dialog` and its "Cancel" (`button.secondary`, Radix's `variant="soft" color="gray"`).
- `tooltip`: hover the first example's trigger.
- `button` and `text-field`: focus the second example control, so `button.focus` and `input.focus` read a focused one while the first stays at rest.

How the values were normalized into `tokens.json`:

- Radix paints with alpha colors (slate-a7, black 25%…). Each is composited over the color under the part, since the specimens report opaque colors.
- Checkbox and switch boxes are drawn on `::before`, the card's fill on `::before`: their background, radius and height come from there. The switch's on-track is a gradient stop (`--accent-track`) over slate-a3.
- Ring layers that draw an edge are left out of `boxShadow`; `edge` has them.
- `input.focus`: a 2px indigo-8 outline at -1px offset, covering the 1px edge. Only the ring is recorded, since the edge under it doesn't show.
- `tab.selected` weight is its label's: the trigger stays 400 and its inner label turns 500 when active (`tabs.css`).
- `page` font is left out: the docs site sets its own (Untitled Sans) on the page, while every component uses Themes' system stack.
- `button.quiet` is the default ghost: accent text, regular weight, trimmed to 28px with negative margins.
- `badge` keeps its shape and type only: the docs badges are accent or named colors, the specimen's first badge is neutral.
- `kbd` keeps its shape and size only: the specimen's is a shortcut in a command row, stripped to text, while the docs show a standalone keycap. Radix menus show shortcuts as bare text too.
- Type parts come from the demo previews (`.radix-themes-default-fonts`), not the docs' own headings.

## Not in Radix Themes

No sidebar or app shell, command palette, toast, accordion, calendar, date picker, breadcrumbs, pagination, number or OTP field. Those sheets are inferred from the rest of the system.
