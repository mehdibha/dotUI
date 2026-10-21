# dotUI in Claude: the product (draft, Oct 21 2026)

Companion to [agent-native-dotui.md](agent-native-dotui.md), which covers
feasibility, architecture and the spike. This doc covers what the
connector should be as a product.

## The promise

> A professional design system for your product in five minutes, without
> leaving the chat. Every screen after that is built in it.

The spike showed the core works: Claude proposes and you pick by eye, on
real components. The product question is what surrounds that moment, so
the system you leave with is good, yours and still in use a month later.

## The landscape (research, Oct 21)

Nothing shipped does the whole loop: a brand interview, then whole systems
rendered live with real components in chat, then an installable registry.
The closest products each cover part of it:

| Product | What it does in the agent | Missing |
| --- | --- | --- |
| **Claude Design** (Anthropic) | In any chat since Sep 16: a native canvas, live previews, "three directions", custom sliders, hand-off to Claude Code | Starts from assets you already have (repo, Figma, logo); ships designs and bundles, not an installable registry |
| **DS Manager** (shadcndesign, on the MCP registry Oct 19) | Tools-only: an agent sets shadcn tokens and gets install commands back; per-run Undo banner | Preview lives in its own web editor, not in chat; no directions |
| **AIDesigner MCP** | Nine brand directions on a 3×3 board → save a kit | Brand identity, not components; coding agents only; PNG previews |
| **Canva** (MCP App) | Applies an existing Brand Kit, live in Claude and ChatGPT | Marketing collateral, not product UI; doesn't create a system |
| **Figma** (app + MCP) | Inline FigJam diagrams; the MCP writes variables (beta) | No design-system creation in chat |

All of these tie into one library: Flowbite, Chakra, seedflip, Zaklad,
Stitch's DESIGN.md. Every major library also has a component-search MCP,
which returns an install command as text and is a commodity.

**What dotUI can own:**

- **Live in chat plus a real installable registry.** Nobody combines MCP
  Apps with registry output.
- **From scratch.** Claude Design, Bolt and Figma need existing assets; a
  new startup has none.
- **ChatGPT.** The same spec runs there, and that directory has no
  design-system app.
- **Being what others import.** Export a DESIGN.md (the format Stitch,
  Bolt and Graphical read) and a repo that Claude Design can ingest.
  Then dotUI is where a system is born and Claude Design is where it's
  used, so the two are partners more than competitors.

**Ideas worth taking:**

- Sliders on the chosen direction (Claude Design). This is the Touch layer
  below, inside the card.
- Undo per agent run (DS Manager). This is versions, with a visible
  "Undo v3".
- Contrast results as text the agent can act on (DS Manager). This is
  Review returning text as well as a card.
- "Continue in the full app" (Canva). This is the studio round-trip.
- Brand-reference seeds such as "like Stripe" (seedflip). These are our
  presets, so preset fidelity (#484) becomes direction quality.

The urgency is real. DS Manager shows the shadcn ecosystem moving into
agents this week, and Claude Design already owns "directions" as a
gesture. The window is the live, installable, start-from-zero system.

## Who it's for

| Who | Where they are | The job | Done looks like |
| --- | --- | --- | --- |
| Founder or indie dev, new project | claude.ai, Claude Code | "Make it look like a real brand, not default shadcn" | Installed in 5 min, first screen built |
| Dev with an existing app | Claude Code, Cursor | "Give my app one consistent look" | Components swapped, nothing broken |
| Designer or brand owner | claude.ai | "Turn our brand guide into code" | Exact brand colors and fonts, contrast checked, handed to devs |
| Anyone, a month later | wherever they build | "Make it warmer / more compact / more like Stripe" | See the change, accept it, one update command |

The first row is the launch user. The last row is what makes it a product
rather than a generator: the system stays alive.

## Principles

1. **Show, don't ask.** Taste questions are answered by looking at rendered
   options. Prose questions are only for facts: the name, what the product
   is, who it's for.
2. **Infer first.** Read the conversation, an attached logo or screenshot,
   a site URL, the repo (in Claude Code). Never ask what is already known.
3. **Whole system first, then dials.** Directions before details, because a
   coherent system beats a pile of good choices. Refinements inherit from
   the pick.
4. **One decision per card.** At most two actions, no menus inline, and
   fullscreen only for review. The chat is the timeline.
5. **Real components, real engine.** Everything shown is what installs. No
   mockups, no "approximate preview".
6. **Never trapped.** Any card can open the studio with the current system.
   The studio can send it back. Every version stays reachable.
7. **Honest.** Contrast and legibility are checked and shown. If something
   fails, the card says so and offers the fix.

## The journey

### Act 1: Create (first five minutes)

```
You: I'm building Lumen, budgeting for freelancers. Calm, warm, trustworthy.
Claude: [reads attached logo → #e8590c]
        ┌ Directions card ─ 3 live systems, light/dark ─ [Continue] ┐
You:    picks "Warm studio"
Claude: ┌ Color card ─ brand ramp from the logo, buttons brand vs ink ┐
        ┌ Type card ─ 3 pairings set in Lumen's own screens          ┐
        ┌ Review (fullscreen) ─ dashboard, settings, checkout, ✓ AA   ┐
You:    "sharper corners"   →  ┌ Compare card ─ before / after ┐
You:    [Create]           →  ┌ Ready card ─ install, studio, export ┐
```

Five cards and two sentences from the user. Claude skips any card the
brief already settles, so a user who pasted their brand guide goes
straight from directions to review.

### Act 2: Ship (the next ten minutes)

- **Claude Code / Cursor / VS Code:** Claude runs the install, writes the
  agent docs (DESIGN.md + skill, from closed #782), and builds the first
  screen from the brief. The user sees it in the browser pane or their dev
  server.
- **claude.ai / ChatGPT:** Claude shows the first screen in a **Screen
  card**: a real dotUI block (dashboard, settings, checkout…) filled with
  Lumen's content and rendered in the system. Then it hands off with one
  click: v0, Lovable, Bolt, or "copy the install command".

### Act 3: Live with it (weeks later)

- "Make it more compact" → Compare card (current vs proposed) →
  **Update** → Claude runs the update and shows the diff of the exported
  files.
- "Like Stripe, but our green" → Directions card seeded from the Stripe
  preset.
- "Show me the checkout in dark mode" → Screen card.
- Each accepted change is a new version (v1, v2, v3), so "go back to v2"
  works.

## What to show: the card catalog

| Card | When | Shows | You do | Mode |
| --- | --- | --- | --- | --- |
| **Directions** (built) | Start, or "show me options" | 2–3 whole systems as mini screens, light/dark | Pick → Continue | inline |
| **Color** | After the pick, if the brand color isn't given | Brand ramp, buttons brand vs ink, neutral tint warm ↔ cool, dark mode, contrast verdicts | Swatches from the logo/site, hex field, tint slider | inline |
| **Type** | If fonts aren't given | 3–4 pairings set in the product's own copy (heading, body, numbers, UI) | Pick, or search (fullscreen) | inline |
| **Shape & density** | Only if asked, or the brief implies it | 5 shapes × 3 densities as one control row each | Pick a cell | inline |
| **Compare** | Any refinement | Current vs proposed, same screen side by side, with what changed listed | Accept / Keep current | inline |
| **Review** | Before saving | The whole system on 3 real screens plus the component sampler, light/dark, desktop/phone width, contrast report | Tweak identity rows in a side panel, Save | fullscreen |
| **Screen** | "Show me X in my system" | One of the 16 blocks, content written by Claude for the product | Open in studio, Export | inline → fullscreen |
| **Ready** | After saving | Name and swatch, install command per package manager, studio link, what's included (83 components, tokens, agent docs), export buttons | Copy / Open in v0 | inline |

The cards are a decomposed studio. Each one is a studio row plus a preview
scene, so build them from the same parts as the panel. One axis then
appears in both places, and a new axis becomes available to Claude for
free.

Not a card: the brief. Name, audience, product type and links are typed
facts. Chat and attachments do this better than a form.

## How customizing works

Four layers, from least to most control:

1. **Talk:** "warmer", "more like Linear", "bigger text". Claude maps
   the request to axes (the catalog) and shows a Compare card. This is
   most of the use.
2. **Touch:** direct manipulation inside a card: color, tint, a pairing,
   a shape cell. The card recomputes locally (instant) and syncs the
   draft to Claude through model context, so the next turn knows it.
3. **Deep:** "Open in studio" opens `/studio?s=<id>` with all 46
   chapters. "Send back to Claude" mints a new version, and the
   conversation picks it up.
4. **Import:** logo or screenshot (Claude reads the colors), site URL
   (Claude fetches CSS colors and fonts), DESIGN.md (#897 importer),
   Figma variables later. Import seeds the directions; it doesn't replace
   them.

Every layer writes the same thing: a state diff over a preset. Claude
reads it, cards render it, the studio edits it and snapshots freeze it.

## Tools (model-facing)

| Tool | What it does |
| --- | --- |
| `get_design_axes` | Presets + identity axes; teaches shape roles (spike lesson) |
| `propose_directions` | Directions card |
| `ask_color` · `ask_type` · `ask_shape` | One card each, with Claude's candidates as input |
| `refine` | Current + delta → Compare card |
| `review` | Fullscreen board + contrast report (from the closed `check` tool) |
| `show_screen` | Screen card: block id + content |
| `save` | Mints a version → Ready card (today: `create_design_system`) |
| `open_studio` / `get_version` | Round-trip with the studio |
| `install_steps` | Per host and package manager, new vs existing project |

App-only tools (`visibility: ["app"]`) cover font search, `mint` and
ramp previews. Claude never sees them.

## Making life easier: the concrete wins

- **No blank page, no design vocabulary.** Users react to options; they
  never need to know what "tonal surfaces" means.
- **No token copying.** One command installs 83 accessible components,
  themed.
- **No drift.** The agent docs mean every later session builds with the
  system instead of around it.
- **No surprise contrast bugs.** Review fails loudly, with a one-click fix.
- **Change is cheap.** Compare, then Update, with a file diff.
- **Works where they already are:** Claude, ChatGPT, Cursor, VS Code.

## Tested in claude.ai (Oct 21, three rounds)

Two full runs, Lumen (fintech) and Kiln (pottery marketplace): directions →
color → type → save → refine → re-save. Opus 5.5, dark theme.

**Works:**

- Every card renders and reacts live in Claude's sandbox: fonts, light and
  dark, dragging the color area, measured contrast, clipboard copy.
- Claude carries the whole design `{ preset, shape, axes }` across five
  steps and folds each pick's axes in.
- Claude reaches for `shape` on its own for corner requests, and re-saves
  on Accept.
- Its replies stay at one or two sentences, and it offers the first screen
  as the next step.

**Fixed between rounds:**

- A renamed `ui://` URI broke cards for anyone with a cached tool list.
  URIs are now only added, never renamed.
- Result texts listed every direction, so Claude restated them. They now
  say "the user is looking at a live card".
- `IBM Plex Mono` (not in the catalog) cost a retry. Refused fonts now come
  back with the closest families.
- Side by side, a 6→10px radius was invisible. Compare now flips one
  preview in place.
- Four pairings left one tile alone; they now sit 2×2.
- Tile titles didn't line up; they do now.
- The specimens' invoice copy looked wrong for non-fintech products; it's
  product-neutral now.

**Host constraints (claude.ai, not fixable from the server):**

- **Approvals.** Every card tool asks "Allow once / Always allow" on first
  use, five prompts in a first run. Users can pick Always allow; fewer
  tools would mean fewer prompts.
- **Picks are pre-filled, not sent.** The card's pick lands in the composer
  under a red "Use caution before running this prompt" banner, and the
  user presses Enter. The text is short and plain, so it reads fine, but
  it's an extra step on every card.
- **Tool list cache.** New tools need Settings → Connectors → dotUI →
  ⋮ → Refresh tools list.
- **Pace.** The first directions card takes about 30–40 s (catalog plus
  composing three systems); later cards take about 10 s.

## Non-goals (for now)

- A full studio inside chat. Deep work belongs to the studio, one click
  away.
- A brief intake form.
- Generating components. The registry is the product; Claude writes
  screens with it.
- Accounts before launch. Versions in the conversation plus snapshot ids
  are enough to start.

## Measuring it

- **Time to installed system.** Target under 5 minutes.
- **Pick rate.** The share of Directions cards where the user picks one
  instead of saying "none of these". This measures direction quality.
- **Refinements before save.** Fewer means better directions; zero
  everywhere means nobody customizes.
- **Return rate.** Users who come back for a second version within 30
  days. This measures whether the system stays in use.
- **The eval harness** (`claude -p`) for brief fit, now judged on what
  the user picked.

## Roadmap

1. **v0.2, the create loop (built Oct 21):** Color, Type and Compare cards;
   `create_design_system` returns the Ready card; shape roles in the
   catalog. Done when a founder goes from brief to install command in five
   cards.
   - **Tools:** `ask_color`, `ask_type`, `refine`, plus a UI on
     `create_design_system`.
   - **Designs:** every design is `{ preset, shape, axes }`, where `shape`
     is one of the panel's five corner looks.
   - **Catalog:** lists the shapes and the 540-font catalog the font axes
     actually accept.
   - **Cards:** one bundle, routed by `structuredContent.card`. The Color
     card measures contrast on the rendered components.
2. **v0.3, see it real:** Review (fullscreen, blocks + contrast) and the
   Screen card.
3. **v0.4, keep it alive:** versions, `refine` on a saved system, the
   studio round-trip, the update flow in Claude Code.
4. **v0.5, bring your brand, take it anywhere:** logo/URL/DESIGN.md
   import seeding directions. Export DESIGN.md, plus a repo Claude Design
   can import.
5. **v1, distribution:** Anthropic directory (Suggested Connectors), the
   ChatGPT directory, which is empty for this category so submit it as
   soon as v0.2 holds up, the Claude Code plugin with the no-UI fallback,
   and accounts for "my design systems".

## Decisions for Mehdi

- **Directions from Claude or from presets?** Recommendation: Claude
  composes each direction as one preset plus at most six axes. That keeps
  each direction coherent (the preset carries the hard-won fidelity) and
  distinct (Claude's deltas).
- **Does the studio adopt the cards?** Recommendation: yes. Build cards
  and studio rows from the same row components, so the chat and the
  studio never disagree.
- **Where do versions live before accounts?** Recommendation: in the
  conversation, as model context plus snapshot ids. Add accounts at v1.
