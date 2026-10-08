# Axes engine

Saved state is what the user picked; nothing mutates it. Effective state is
saved + follows + rules, and it is the only thing a resolver, the preview
iframe, the docs or `/r/*` ever see (`Effective` is a branded type).

```
saved ──effective()──▶ Effective ──resolveDesignSystem()──▶ DesignSystem
```

`designSystemOf(saved)` (`../../resolve.ts`) is that whole path.

## Add an axis

1. Add the key to its module's `*_DEFAULTS` and `*_SCHEMA` (default = Origin's look).
   An enum's values are a `*_VALUES` tuple there; its labels, descriptions and
   credits go in `<module>.meta.ts` (`options()` from `core/meta.ts`, plus the
   key in its `OPTIONS`). Runtime modules ride every docs page; meta modules
   only the panel.
2. Read it in that module's `resolve(state: Effective)` (index.ts fails to
   compile on a resolver typed over anything else); emit only what differs
   from the registry defaults (Origin stays token-free).

The module's `chapter` is already in the list in `../index.ts`; DEFAULTS,
SCHEMA, FOLLOWS, RULES and the resolvers are built from it. A new module adds
one line there.

## Add a follow (Same as / Auto)

On the follower's chapter, `follows: { key: [follow] }`, and default the key
to the follow id (`"auto"`, `"same"`), typed `number | "auto"` etc.

- `same`: the source's effective value, same vocabulary (`map` optional).
- `auto`: `table[source value]`; the table is total over the source's options
  (tested). A tuple `from` keys the table by joined values (`"a|b"`).

Validation accepts the follow ids; resolvers only ever see the resolved value.

## Scoped copies

A `same` follow with `scoped: true` makes the follower a family's own copy of
a global key (`buttonMotion` of `motion`): same vocabulary, default = the
follow id. `SCOPES[global]` lists them. While a copy differs from its follow
id, the global's row reads Custom and lists the overriding rows; setting the
global (`setKey`) resets every copy.

## Add a rule

Only for mechanical breakage or an inert row; taste is an Auto pairing.
Author it in the TARGET's module (`rules: [...]`, id `<module>/<name>`):
`when` reads effective upstream keys (never the target), `cause` is one of them.

- `pin` — value forced; the row is dimmed with a cause chip.
- `exclude` — enum options (with a `fallback`) or a numeric range (`above` /
  `below`) unavailable; a saved value inside it resolves to the fallback/bound.
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

Presets (`presets/<id>.ts`) hold a `diff` over DEFAULTS; Origin is `{}`.
