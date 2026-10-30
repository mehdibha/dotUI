# Axes engine

Saved state is what the user picked; nothing mutates it. Effective state is
saved + follows + rules, and it is the only thing a resolver, the preview
iframe, the docs or `/r/*` ever see (`Effective` is a branded type).

```
saved ──effective()──▶ Effective ──resolveDesignSystem()──▶ DesignSystem
```

`designSystemOf(saved)` (`../../resolve.ts`) is that whole path.

## Add an axis

1. Add the key to its chapter's `defaults` and `schema` (default = Origin's look).
   An enum's values are a `*_VALUES` tuple in the module; its labels, descriptions and
   credits go in `<module>.meta.ts` (`options()` from `core/meta.ts`, plus the
   key in its `OPTIONS`). Runtime modules ride every docs page; meta modules
   only the panel.
2. Read it in that chapter's `resolve(state: Effective)` (index.ts fails to
   compile on a resolver typed over anything else); emit only what differs
   from the registry defaults (Origin stays token-free).

The module's `chapter` is already in the list in `../index.ts`; DEFAULTS,
SCHEMA, FOLLOWS, RULES and the resolvers are built from it. A new module adds
one line there.

- A key that changes with the look joins every record in `LOOKS` and
  `STYLE_KEYS` in `../style.ts` (Flat = its default), and an option only
  some looks' light draws joins `ALLOWED`. The swap test decides: rebuild
  the screen in another Style with the same colors, fonts, corners and
  spacing; whatever has to change is Style.
- Renaming or removing a key or a value breaks saved states and share links:
  bump `STATE_VERSION` in `../version.ts` and add the `STEPS` entry in
  `../migrate.ts` that rewrites the old shape.

## Add a follow (Same as / Auto)

On the follower's chapter, `follows: { key: [follow] }`, and default the key
to the follow id (`"auto"`, `"same"`), typed `number | "auto"` etc.

- `same`: the source's effective value, same vocabulary (`map` optional).
- `auto`: `table[source value]`; the table is total over the source's options
  (tested). A tuple `from` keys the table by joined values (`"a|b"`).

A follow landing on another follow id of its key resolves once more, never
twice. Validation accepts the follow ids; resolvers only ever see the resolved
value. `followersOf(state, key)` lists the keys that can follow `key` but are
saved off every follow (a Motion row's custom components). Setting a key never resets them.

## Style

`../style.ts` owns `style` (the look, one record per system it is copied
from; `STYLE_VALUES`: Flat, Hairline, Rim, Gloss, Bevel, Chunky). A record
names the button recipe, which Buttons reads, and the value of each
`STYLE_KEYS` key, which `../index.ts` defaults to `"style"`: an `auto`
follow (id `"style"`) over the records, whose Flat entry is the key's
chapter default (Origin). An option only some looks draw is an exclude rule
with `cause: "style"` and `fallback: "style"`, so it lands on the record;
the panel doesn't offer it. `pickStyle` puts every look key back on the
record, with the button's secondary and press on the look's own.

## Add a rule

Only for mechanical breakage or an inert row; taste is an Auto pairing.
Author it in the TARGET's module (`rules: [...]`, id `<module>/<name>`):
`when` reads effective upstream keys (never the target), `cause` is one of them.

- `pin` — value forced; the row is dimmed with a cause chip.
- `exclude` — enum options (with a `fallback`, which may be a follow id) or a
  numeric range (`above` / `below`) unavailable; a saved value inside it
  resolves to the fallback/bound.
  Options show disabled with the chip; a slider greys the range.
- `hide` — the row is not rendered; the value resolves to `value`, else the
  key's default.

"Fires" means the value changed. A pin/hide whose `when` holds always sets
`lock`, changed or not. At most one rule acts per key. Presets and Origin
must fire none (tested): a preset writes the effective value itself. Every
rule needs a fire and a no-fire fixture in `engine.test.ts`.

## Read the why

`effective(saved).explain[key]` = `{ saved, effective, via?, rule?, lock?,
exclude? }` for keys a follow or rule can touch. In the panel, `useAxis(key)`
(`../../use-axis.tsx`) returns `{ saved, effective, explain, set }`, and dial
primitives take `axis="key"` to hide, pin, exclude and show "Auto · x".

Presets (`www/src/modules/presets/<id>.ts`) hold a `diff` over DEFAULTS; Origin is `{}`.
