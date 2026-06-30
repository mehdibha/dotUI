# Scroll-restoration flash + performance comparison (dotUI vs TanStack vs shadcn)

> Status: investigated and fixed 2026-06-30. Fix = a head script that defers the first paint until scroll restoration has landed, but only when reloading at a saved non-zero scroll (`www/src/routes/__root.tsx`). An earlier attempt (re-enabling native restoration) was proven insufficient on a real browser — see Root cause. Benchmark numbers are a point-in-time snapshot of the live production sites; do not treat them as kept-current.

## 1. The scroll-restoration flash

### Symptom

Reload any dotUI page while scrolled down (e.g. scrolled to the bottom). For one frame the page appears at the top, then jumps to the restored scroll position. tanstack.com — same framework (TanStack Start) — does not visibly do this.

### Root cause

dotUI runs `scrollRestoration: true` on the router (`www/src/router.tsx`); TanStack restores scroll from JavaScript after hydration. But the real cause is more fundamental than the restore mechanism: **our pages are server-rendered, so the browser paints the content at the top before the scroll can be restored.** On a heavy page the browser can't reach the saved offset until the document is parsed and tall enough — which is *after* first paint.

Crucially this is true of the browser's own **native** scroll restoration too, not just TanStack's JS. Measured in a real (headful) browser, forcing native restoration on and blocking all JS scroll:

- first paint at **184 ms** with the page still at the top (scrollY 0),
- native restore lands at **239 ms** — **55 ms after** first paint → the flash.

So you cannot fix this by switching the restore mechanism (native vs JS); both lose to the early paint. Headless Chrome hides the bug entirely — it paints once, at end-of-parse, after restoration — which is why a native-restoration-only attempt (my first commit) looked clean in headless yet still flashed on a real browser.

### Why tanstack.com looks fine despite the same config

tanstack.com also sets `scrollRestoration: true`, on near-identical versions (router 1.170.x, start 1.168.x). The difference is **what gets painted when, not configuration.** Its docs content is largely client-rendered — the document is short until JS builds it — so the browser has nothing to paint until *after* hydration runs and scroll is restored. It paints late, already in the right place. dotUI's SSR content is paintable immediately, so it paints early, before restore. The fix makes dotUI behave the same way: paint after restoration.

### The fix

Defer the first paint until the scroll has actually landed — but only when it matters. When (and only when) we're reloading at a saved non-zero scroll, the head script hides `<html>` and reveals it the moment `scrollY` reaches the saved offset, so the first paint the user sees is already in the right place. First visits and reloads at the top read no saved offset, so they never hide and pay nothing.

```js
// runs before first paint, inline in <head>
var target = savedScrollForThisEntry()        // the router's sessionStorage scroll cache
if (target > 0) {
  document.documentElement.style.visibility = "hidden"
  // reveal as soon as scroll lands: scroll event + rAF loop, 1.5s safety net
  reveal when window.scrollY >= target
}
```

It also flips `history.scrollRestoration` back to `"auto"` so native restoration helps the scroll land sooner (shorter hidden window); TanStack re-arms `"manual"` during hydration, so in-app navigation restoration is untouched.

Trade-off: on a reload partway down the page, the user now sees a brief blank (~0.2–0.4 s in dev, less in prod) instead of a flash-and-jump — scoped to that case only. Normal navigations, first loads and reloads at the top are unchanged, so Core Web Vitals (measured cold, at scroll 0) are unaffected. The deeper fix is to make dotUI paint less eagerly / hydrate faster (see §3) so paint and restore coincide the way tanstack's do; the head script is the pragmatic stopgap.

### Verification (real browser)

Headless can't reproduce the flash, so this was verified headful (real Chrome, instrumented frame-by-frame) on a local production build, fix toggled on/off:

| dotUI, real browser, reload at the bottom | what the user sees |
|---|---|
| **Before** (no fix / native-only attempt) | first paint at the top (scrollY 0), restore ~55 ms later → **flash** |
| **After** (this PR) | every frame while `scrollY < target` is `visibility: hidden`; first *visible* frame is already at the restored offset (`y = 1456 = target`) → **no flash** |

A screenshot 400 ms post-reload shows the restored (bottom) content, not the top. `history.scrollRestoration` still ends `"manual"`, so TanStack's in-app restoration is untouched. The script is gated on the router's scroll cache; if that cache's shape ever changes it no-ops back to the previous behavior.

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
