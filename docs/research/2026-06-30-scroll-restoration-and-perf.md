# Scroll-restoration flash + performance comparison (dotUI vs TanStack vs shadcn)

> Status: investigated and fixed 2026-06-30. Fix = a one-line head script that re-enables native scroll restoration (`www/src/routes/__root.tsx`). Benchmark numbers are a point-in-time snapshot of the live production sites; do not treat them as kept-current.

## 1. The scroll-restoration flash

### Symptom

Reload any dotUI page while scrolled down (e.g. scrolled to the bottom). For one frame the page appears at the top, then jumps to the restored scroll position. tanstack.com — same framework (TanStack Start) — does not visibly do this.

### Root cause

dotUI runs `scrollRestoration: true` on the router (`www/src/router.tsx`). TanStack implements that by setting `history.scrollRestoration = "manual"` — turning off the browser's native restoration — and restoring scroll from JavaScript instead, via two paths: a small inline script near `</body>`, and a post-hydration `onRendered` handler.

Our pages are server-rendered, so the browser has paintable content immediately and paints it at the top early. The JavaScript restore then lands after that first paint, and you see the jump. Measured on the live site (instrumented headless Chrome, scroll to bottom then reload):

- `onRendered` restore consistently fires **~100 ms after** first contentful paint (e.g. FCP 1384 ms, restore 1487 ms).
- The before-paint inline script only wins by a razor-thin **~40–45 ms** in headless — and headless paints once at end-of-parse. A real browser progressively paints a heavy (~440 KB / ~2000-node) document and shows the top before that end-of-body script runs, so the visible restore becomes the post-paint `onRendered`. That is the flash.

### Why tanstack.com looks fine despite the same config

tanstack.com also sets `scrollRestoration: true`, on near-identical versions (router 1.170.x, start 1.168.x). The difference is **timing, not configuration**. Measured the same way on a long tanstack docs page (scrolled to 19140 px, reloaded): the restore fires at **548 ms, before first paint at 656 ms** — 108 ms early. Their restore wins the race against paint; ours loses it on heavier pages. So this is not something tanstack does differently in code; it is an emergent property of page weight and hydration timing.

### The fix

Re-enable the browser's **native** scroll restoration for full-page loads. Native restoration runs as part of the browser's layout pipeline, before any paint — it cannot lose the race the way a script can. A blocking inline script in `<head>`, which runs before first paint, flips the mode back:

```html
<script>try{history.scrollRestoration="auto"}catch(e){}</script>
```

The router re-arms `"manual"` during hydration (verified), so in-app client-side navigation restoration — the reason `scrollRestoration: true` is enabled — is untouched. The head script only governs the brief window of the initial document load, where native restoration is strictly better for our SSR'd content.

### Verification

- **Mechanism (live site):** with `history.scrollRestoration="auto"` set at document start and *every* JS `window.scrollTo` blocked, the page still restored to the saved position, at t≈31 ms, before FCP (156 ms). The browser records scroll even in manual mode and restores it natively before paint.
- **Emission:** React 19 SSR emits the inline `<script>` inside `<head>`; confirmed in the dev server's served HTML (script present before `</head>`).
- **End-to-end (local build with the fix):** with all JS `scrollTo` blocked, scroll still restored to the saved position — purely native — and `history.scrollRestoration` ended as `"manual"`, i.e. TanStack's in-app restoration re-armed.

Caveat: the visible flash is a real-browser progressive-paint effect that headless Chrome (single paint at end-of-parse) does not reproduce, so the final confirmation is the timing/native-restore evidence above plus a manual reload on a real browser.

## 2. Performance comparison

### Methodology

Headless Chrome 141, cold cache, desktop viewport 1366×900, a fixed network pipe (~20 Mbps down / 5 Mbps up / 40 ms RTT) applied equally to all sites so the comparison reflects site weight rather than connection jitter. Median of the best 5 of 6 runs (slowest run by FCP dropped). Live production sites, 2026-06-30. Bytes are CDP `encodedDataLength` (over-the-wire), counting all resource types. Cells below are `median (best)`.

TTFB is the noisiest metric — it depends on CDN cache and serverless cold-start state, not just the app. dotUI's TTFB swung 145–999 ms across runs as the Vercel function warmed up; read it loosely.

### Landing pages — dotui.org · tanstack.com · ui.shadcn.com

| Metric | dotUI | TanStack | shadcn |
|---|---|---|---|
| TTFB ms | **187 (145)** | 1255 (947) | 419 (135) |
| FCP ms | **520 (412)** | 1644 (1340) | 964 (608) |
| LCP ms | **520 (412)** | 1704 (1340) | 964 (608) |
| load ms | **1858** | 1949 | 2148 |
| TBT ms | 26 | 1 | **0** |
| long-task ms | 76 | 51 | **0** |
| total KB | 1771 | **999** | 3055 |
| JS KB | 817 | **763** | 2370 |
| requests | 162 | **36** | 119 |
| DOM nodes | 2040 | 2024 | **1752** |
| JS heap MB | 23 | **16** | 68 |

### Docs / component pages — /docs/components/button (dotUI, shadcn) · router docs overview (TanStack)

| Metric | dotUI | shadcn | TanStack |
|---|---|---|---|
| TTFB ms | **180** | 434 | 252 |
| FCP ms | 588 | 1584 | **556** |
| LCP ms | 588 | 1584 | **556** |
| load ms | 2284 | 6793 | **1027** |
| TBT ms | 2 | **0** | 18 |
| total KB | **893** | 3807 | 1280 |
| JS KB | **744** | 2566 | 969 |
| requests | 148 | 202 | **89** |
| DOM nodes | **966** | 1541 | 1639 |
| JS heap MB | **24** | 47 | 26 |

### Reading

- **dotUI renders fast.** Fastest FCP/LCP on the landing (520 ms) and essentially tied with TanStack on docs (588 vs 556 ms); both beat shadcn by ~1 s. Lean DOM and JS heap.
- **dotUI ships lean JavaScript.** 817 KB (landing) / 744 KB (docs) over the wire — comparable to TanStack and roughly a third of shadcn (2.4–2.6 MB). shadcn is the heavy one across bytes, JS, heap, and load time (its docs pull a ~460 KB data payload — the registry JSON).
- **dotUI's one real weakness is request fan-out.** 162 requests on the landing vs TanStack's 36 — ~4.5× more, mostly small JS chunks (the live-component showcase pulls in many modules). dotUI also has the highest main-thread blocking on the landing (TBT 26 ms, long-tasks 76 ms).
- That request/hydration overhead is exactly what made the JS scroll-restore land after first paint. The native-restoration fix sidesteps it entirely (restoration no longer depends on hydration timing), but the fan-out is worth reducing on its own merits.

## 3. Follow-up opportunities (not in this PR)

- **Cut landing request count.** ~160 requests to render the landing is the standout regression vs TanStack's ~36. The component showcase appears to load many per-component chunks eagerly. Bundling the above-the-fold showcase and lazy-loading the rest would cut requests and landing hydration time.
- **Trim landing hydration main-thread time** (TBT 26 ms / 76 ms long-tasks) — same root as the request fan-out.
- **TTFB on cold Vercel functions.** The landing's first-byte time spikes on cold start; if it isn't already, the marketing routes are good candidates for prerender/ISR so first-byte is CDN-served like shadcn's.
