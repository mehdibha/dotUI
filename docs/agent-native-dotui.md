# dotUI inside your agent: exploration (draft, Oct 2026)

> The idea (Mehdi, 2026-10-21): you start a project by opening Claude and
> adding dotUI. Claude asks about your brand with interactive cards and smart
> inputs (color picker, font picker, live previews), creates the right dotUI
> design system, and sets the project up.

## Verdict

Doable now, and it fixes the problem the September MCP couldn't. dotUI
already has every backend piece. The new part is the in-chat UI, and
**MCP Apps** provides it. That spec has been stable since 2026-01-26 and
renders in claude.ai, Claude Desktop, Claude mobile, ChatGPT, VS Code
Copilot and Cursor. One remote server covers all of them. The one big gap is
Claude Code itself, which calls the tools but renders no UI, so it needs
its own path (see Hosts).

The September MCP (closed PRs #771, #813, #831) had the agent design the
system blind: it read the axis catalog, set values, and ran a contrast
check. The scores stalled at 7.0/10, and the eval named "agent judgment" as
the cause. A render tool didn't help: agents looked at their screenshot and
changed nothing. The interview turns that around: **Claude asks and
proposes, the user looks at live previews and picks.** Taste stays with the
human, and Claude handles the translation and setup.

One correction to the premise: users still need dotui.org, but less as a
place they visit. Chat becomes the front door, the way most people start.
The studio stays where the long work happens (46 chapters can't be an
interview), and dotui.org keeps serving the registry, the docs and the
snapshots everything installs from. So build the in-chat cards and the
studio rows from the same parts, rather than as a competing product.

## What already exists

| Piece | Where | Agent use |
| --- | --- | --- |
| Pure state → design system | `modules/studio/axes/*`, `designSystemOf(state)` | No React, runs in a server or an iframe |
| Strict validation + migration | `validate`, `migrate`, `salvageState` | Turns a wrong agent value into a clear error |
| Mint a design system | `POST /api/snapshots` `{name, state}` → `{id}` (10-char hash, 16 KB) | One call makes an installable system |
| Install it | `npx shadcn@latest init https://dotui.org/r/s/<id>/init.json` | Already the export path |
| Reopen in the studio | `/studio?s=<id>` | The way to "refine by hand" |
| Setup prompt | `modules/studio/export/prompt.ts` | Steps tested on 7 AI builders (#884) |
| MCP tools (closed) | branch `claude/mcp-round-3`: `list_axes` brief/full, `set_axes` with honest noop output, `check` (contrast per mode) | Reuse the engine wrapper, drop the blind-designer workflow |
| DESIGN.md import (draft) | #897, `modules/studio/design-md/` | Covers "I already have a brand doc" |
| Agent docs (closed) | #782: DESIGN.md + skill + rules written by `/r/init` | Covers "made to work well with AI" after setup |
| Real-agent eval harness | `claude -p` against local `/mcp` + judge workflow | Measures the new flow |

## The interview

The questions are about the brand. Axes stay underneath. The studio spec
already defines this session as **first touch** ("make it mine", 2–10
minutes, identity axes only). Refinements inherit from identity, so the
interview never needs to open a component page.

| # | Claude asks | Card | Sets |
| --- | --- | --- | --- |
| 0 | What are you building, and for whom? (inferred from context when possible) | none, plain chat | `density`, `uiTextSize`, mobile axes |
| 1 | Do you have a site, logo, brand guide or DESIGN.md? | upload / URL | seeds for 4–5 (agent extracts hex + fonts; DESIGN.md goes through #897) |
| 2 | Which products feel close to what you want? | logo chips (Linear, Vercel, Stripe, Notion…) | starting preset |
| 3 | **Here are three directions.** | 3 live mini-UIs side by side, light/dark, "Use this" | `style`, `shape`, `titleStyle`, `motion`, neutral tint (whole systems, composed by Claude) |
| 4 | Your brand color? | color input + suggested swatches, ramp, buttons, dark-mode check | `brand`, `buttonColor`, `neutralHue`, `neutralTint`, `vividness` |
| 5 | Pick a type pairing. | 3–4 rendered specimens + search | `headingFont`, `bodyFont`, `monoFont` |
| 6 | (optional) Details | icon grid, density ×3, radius slider | `iconLibrary`, `density`, `radiusPx` |
| 7 | Review | full overview preview (fullscreen) + contrast summary from `check` | none, confirms |
| 8 | Where should it go? | new app / this repo / v0 / Lovable | runs the setup |

Card 3 is the main moment. The owner's rule for taste decisions ("2–3
concrete artifacts to react to, not abstract questions") also suits most
users. Cards 4–6 then adjust the chosen direction. Every card has a "skip,
you choose" path.

Claude's inline-card rules shape the cards:

- Height fits the content, with no nested scroll.
- At most two actions per card. Tiles are selectable, and one button reads
  "Continue with this".
- No menus or popovers. Use swatches, segmented controls and tiles inline,
  and keep React Aria popovers (the full color picker, font search) for
  card 7, which opens fullscreen.

## Architecture

```
Claude / ChatGPT / VS Code …                    dotui.org (same TanStack app)
┌───────────────────────────┐   MCP (HTTP)    ┌────────────────────────────────┐
│ model ── tools/call ──────┼────────────────▶│ /mcp  stateless server         │
│   ▲                       │                 │  tools: propose_directions,    │
│   │ ui/message (the pick) │                 │   ask_color, ask_type, review, │
│ ┌─┴─────────────────────┐ │  tools/call     │   check, create_design_system, │
│ │ MCP App iframe        │─┼────────────────▶│   setup_steps                  │
│ │ ui://dotui/cards.html │ │ (from the card, │  resource: ui://dotui/cards    │
│ │ registry components + │ │  no model turn) │  calls createSnapshot() in-    │
│ │ axes + color engine   │ │                 │  process, not over HTTP        │
│ └───────────────────────┘ │                 └────────────────────────────────┘
└───────────────────────────┘
```

- **One card bundle**, routed by tool: a small React app built from the
  registry components plus `designSystemOf`. It has to be bundled, because
  Claude blocks nested iframes (`frameDomains` is "pending security
  review"), so `/preview/*` can't be embedded. Previews render in the client
  from a draft `StudioState`, with no network round trip per change. That
  meets the spec's "live, always" rule. Fonts come from Google Fonts,
  declared in `_meta.ui.csp.resourceDomains`.
- **The draft lives in the conversation**: tool args and results carry a
  state diff. The server stays stateless, as in September. Only the final
  step mints a snapshot. Its id is then the reference everywhere (studio
  link, install URL, `components.json`).
- **The card talks back three ways**:
  - `ui/update-model-context` keeps the current draft in front of the model
    without starting a turn.
  - `ui/message` posts the pick ("Warm studio, #e8590c") and moves the
    interview on.
  - App-only tools (`visibility: ["app"]`) handle font search, ramps and
    minting. The model never sees them.
- **Every tool also returns plain text**, so hosts without UI degrade to a
  normal Q&A with a studio link.
- **Ops:** Claude serves cards from `<hash>.claudemcpcontent.com`, so CORS
  must allowlist by `Origin` (iOS drops `Referer`). Tool results are capped
  at about 150k characters. SDK: `@modelcontextprotocol/ext-apps`
  (`registerAppTool`, `registerAppResource`, React hooks).

## Live rendering of the real components

Yes, in every host that renders MCP Apps. The card is a standalone copy of
the studio's `/preview` iframe, which already switches every axis at
runtime. It is not an embed, because Claude blocks nested iframes.

- **The pieces:** an HTML shell, plus `cards.js` and `cards.css` from
  dotui.org (declared in `resourceDomains`, cached after the first load).
  The bundle has React, the registry components, CSS precompiled for every
  tv variant (Tailwind over the registry source, as www does), and
  `designSystemOf` + the color engine.
- **Two ways it updates:**
  - When you change something in the card, it applies the draft as CSS
    variables and params in the browser. That's instant.
  - When Claude changes something, it makes a new tool call with the new
    state, and the card re-themes when the tool input arrives.
- **It's real React.** Buttons press, inputs type, switches toggle, tabs
  switch, and light/dark mode switches too.
- **Inline cards are chat-width** and grow with their content, with no
  popovers. So they show the in-flow components: buttons, fields, switches,
  tabs, cards, badges, a table.
- **Fullscreen covers the rest:** Select, Menu, Dialog, Date picker, and
  the full overview or blocks.
- **What it can't do:** build *your repo's* components in chat-only hosts.
  Once the system is installed, the real live render is your dev server.
  In the Claude desktop Code tab, Claude can open that server in the
  built-in browser pane. Before setup, the pane can show
  `/studio?s=<draft>` the same way. That's the visual fallback for the one
  host where cards don't render.
- **Untested:** how big a bundle hosts tolerate (target < 300 KB gz),
  whether fonts load through the CSP, and whether popovers behave in
  fullscreen. The spike tests all three.

## Hosts and fallbacks

Verified 2026-10-21 against the MCP Apps spec, claude.com connector docs,
code.claude.com and developers.openai.com.

| Host | In-chat UI | Interview runs as | Setup |
| --- | --- | --- | --- |
| claude.ai web, Claude Desktop (chat) | MCP Apps, inline + fullscreen | cards | no file system: artifact + handoff links |
| Claude mobile | MCP Apps (WebView); connector added on web/desktop first | cards | handoff links |
| ChatGPT / Codex | MCP Apps standard, plus `window.openai` extras | cards | links; Codex runs commands |
| VS Code Copilot, Cursor, Goose | MCP Apps | cards | **runs the commands**: the full vision works here today |
| Claude Code CLI (likely the Desktop Code tab too) | none; UI resources are skipped | a skill drives AskUserQuestion (≤4 questions × 4 options) + form elicitation (hex as a string, enums), and links to the studio for looking | runs the commands |

Claude Code is the gap that matters most, because it's where projects get
set up. Three ways to give it eyes, cheapest first:

1. AskUserQuestion with option previews. The Desktop app's version takes a
   per-option `preview` (it's in this session's tool schema), but the docs
   only cover it for the Agent SDK. Text and HTML-without-style, so it suits
   structure, not color.
2. A studio link: "open this, then tell me what you think".
3. URL-mode elicitation to a studio handoff page. The user picks in the
   browser, and "Send to Claude" completes the pending tool call. This
   needs a short-lived handoff record (Blob), since the server is otherwise
   stateless. It's the same mechanism as the studio round-trip below.

## Setup step

- **Claude Code / any agent with a shell:** `create_design_system` returns
  the install URLs, and the agent runs the existing `prompt.ts` steps: scaffold
  if empty, `shadcn init …/r/s/<id>/init.json`, `add @dotui/all`. Then the
  agent docs from #782 go in, so later sessions build with the system.
- **claude.ai / ChatGPT (no file system):** build a first screen as an
  artifact, then hand off: studio link, v0 (registry item), Lovable/Bolt
  prompts (#884).

## Distribution

- **Now: an "Add to Claude" button** on dotui.org, using the custom-connector
  install link
  (`claude.ai/customize/connectors?modal=add-custom-connector&connectorName=dotUI&connectorUrl=https://dotui.org/mcp`).
  No review needed. Free plans get one custom connector, and on Team or
  Enterprise only Owners can add one.
- **One plugin** (skills + remote MCP server). Claude Code installs it with
  `/plugin marketplace add mehdibha/…`, and claude.ai chat also loads a
  plugin's skills and remote MCP. OpenAI's "plugins" (ChatGPT + Codex) have
  the same shape: skills + MCP + optional UI.
- **Anthropic directory**: no-auth is allowed. It requires tool titles,
  `readOnlyHint`/`destructiveHint` annotations, a privacy policy and 3–5
  screenshots of the app. The payoff is **Suggested Connectors**: Claude
  recommends dotUI in chat when someone starts a project. That is the
  "open Claude, add dotUI" moment from the idea. Links to dotui.org also
  skip the confirmation modal.
- **ChatGPT directory**: org and domain verification, 5 positive and 3
  negative test cases, and a demo video.
- **Open lane:** the research found no in-chat theme or brand generator
  (shadcn, tweakcn, v0 or Bolt). This is unverified, but nothing showed up.
  The closest precedents are Canva and Figma: preview inline, then "Edit in
  Figma" to continue. That's the same shape as "Open in studio".

## Risks

1. **Direction quality is the whole product.** Three weak directions are
   worse than none. Claude composes them from the nearest presets, which
   ties this to the preset fidelity work (#484). Measure with the eval
   harness: brief → picked direction → brief fit.
2. **Colour rewrite is queued.** The colour card calls the engine and
   holds no colour logic, so the rewrite swaps underneath without touching it.
3. **Bundle weight.** Registry components + engine inside an iframe. Budget
   it (target < 300 KB gz), and load fonts lazily.
4. **Rate limits.** Remote connectors call from the host vendor's servers,
   so the snapshot firewall rule (30/min/IP) would throttle every Claude
   user at once if `/mcp` went through HTTP. Call `createSnapshot` in
   process, and rate-limit `/mcp` per MCP session, not per IP. Check the
   source IPs before shipping.
5. **Young spec, uneven hosts.** Keep the text fallback first-class, test
   every host, and keep host-specific code out of the cards.

## Plan

1. **Spike (1–2 days):** one tool, `propose_directions`, returns the card
   with 3 real dotUI mini-previews built from 3 state diffs, plus a
   "Continue with this" button. Add it as a custom connector and test in
   claude.ai, ChatGPT and VS Code, which is the host with UI plus a shell.
   This answers four questions: do real components render in the sandbox,
   do Google Fonts load through `resourceDomains`, how do auto-height and
   fullscreen behave, and how far do the hosts differ? Nothing else gets
   built until this works.
2. **MVP connector:** the 8 interview steps, `create_design_system`,
   server instructions that script the interview, and `check` reused from
   `claude/mcp-round-3`.
3. **Claude Code:** a plugin (remote MCP + a `new-project` skill), the
   AskUserQuestion fallback, setup recipes, the agent docs, and an eval with
   the existing harness.
4. **Studio round-trip:** "Open in studio" ↔ "Send back to Claude".
5. **Listings:** an "Add to Claude" button (possible from step 2), then the
   Anthropic directory for Suggested Connectors, the ChatGPT directory, and
   a docs page.

## Spike (Oct 21): directions card

Built on this branch: `www/src/modules/mcp/` plus the routes `/mcp`,
`/mcp-app/$file` and the dev-only `/internal/mcp-host`.

- **Tools:** `get_design_axes` (presets + 47 identity axes, 10 KB),
  `propose_directions` (an MCP App), `create_design_system` (mints a
  snapshot in process and returns the studio link and the install command).
- **Card:** real registry components. Each direction renders in its own
  scoped `DesignSystemProvider` with light and dark modes. The pick's full
  Controls card is live, with selectable tiles and one "Continue" action.
  On Continue the card posts `ui/message`, and the exact axes go in through
  `ui/update-model-context`.
- **Delivery:** the resource is a 0.6 KB HTML shell. The JS (369 KB gz)
  and CSS (51 KB gz) are hashed files served with `ACAO: *` and immutable
  caching, declared in `resourceDomains`. Icon libraries load only when a
  direction uses them. A single-file bundle was 2.7 MB / 673 KB gz.
- **Verified locally** in headless Chrome through the dev host, which
  talks to `/mcp` through the official `AppBridge`. Rendering, auto-resize,
  light/dark, picking and the message/context hand-off all work. So do
  Google Fonts under the CSP and a production build serving the files
  through the route. The minted snapshot's `init.json` installs the system.
- **Not verified:** a real host (claude.ai, ChatGPT, VS Code). That needs
  a public URL, as described below.
- **Learned:**
  - In dev, Vite claims `/mcp-app/*` by the `Sec-Fetch-Dest` header, so
    a dev middleware serves those files there.
  - An opaque-origin iframe can't reach localhost at all (Chrome Local
    Network Access). The dev host shares its origin for that reason.
  - The card must set `color-scheme` to the host theme, or Chrome paints
    an opaque canvas behind it.
  - Overlays: the registry decides "mobile" by width (`useIsMobile`, under
    768px), and a chat column is narrower than that, so Select and Menu
    opened as bottom sheets off-screen. Inline, the card's own height is
    its viewport, so a sheet never fits there on any device. The card now
    pins anchored popovers and centered modals for the preview. Only a
    phone in fullscreen, judged from the host's `platform` and
    `deviceCapabilities`, keeps the design's sheets. The picked axes are
    untouched.
  - Composition: a preset's shape roles beat `radiusPx`. "Sharp corners"
    on Linear stayed pill-shaped, so the instructions need to teach role
    keys.
- **Follow-ups:**
  - zod is ~80 KB gz of the card, pulled in by the MCP SDK. A small
    hand-written bridge would remove it.
  - Teach shape roles in `get_design_axes`.
  - Add `ask_color` and `ask_type` cards next.

### Testing it in Claude

Claude calls connectors from Anthropic's servers, so it needs a public
HTTPS URL. With `cloudflared` (`brew install cloudflared`):

1. In `www`: `pnpm build && PORT=4455 node .output/server/index.mjs`.
2. `cloudflared tunnel --url http://localhost:4455` prints
   `https://<random>.trycloudflare.com`.
3. In claude.ai, go to Settings → Connectors → Add custom connector, and use
   `https://<random>.trycloudflare.com/mcp`. Free plans get one custom
   connector; on Team or Enterprise only Owners can add one.
4. In a new chat: "I'm starting Lumen, a budgeting app for freelancers. Use
   dotUI to set up its design system."

Locally, without a host: `pnpm dev` and open `/internal/mcp-host`.

## Open questions

- Accounts: anonymous is fine for v1 (snapshots are public and
  content-addressed). "My design systems" across chats needs auth later.
- Should the directions come from Claude (flexible, can be uneven) or from
  a deterministic generator over presets (consistent, narrower)? Proposal:
  Claude picks the presets and the deltas, the server validates them, and
  the card renders them.
- Naming: `/dotui` in Claude Code, "dotUI" as the connector.
