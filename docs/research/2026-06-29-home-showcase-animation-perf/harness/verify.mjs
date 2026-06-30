// Loads the REAL running dev server home page in headless Chrome and verifies the
// preset morph: that it cycles (scoped color <style> changes), that the transition
// flag fires, and — the key claim — how much main-thread blocking a real swap costs.
import { spawn } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9336
const URL = process.argv[2] || 'http://localhost:4446/'
const SHOT = join(import.meta.dirname, 'real-morph.jpg')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const userDataDir = mkdtempSync(join(tmpdir(), 'cdp-v-'))
const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${userDataDir}`,
  '--no-first-run', '--no-default-browser-check', '--disable-extensions',
  '--window-size=1500,1300', '--force-device-scale-factor=1', 'about:blank',
], { stdio: 'ignore' })

async function getJSON(p) { return (await fetch(`http://127.0.0.1:${PORT}${p}`)).json() }
let version
for (let i = 0; i < 100; i++) { try { version = await getJSON('/json/version'); break } catch { await sleep(100) } }
if (!version) { chrome.kill(); throw new Error('Chrome did not start') }

const ws = new WebSocket(version.webSocketDebuggerUrl)
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej })
let nextId = 1, sessionId = null
const pending = new Map()
ws.onmessage = (ev) => {
  const m = JSON.parse(ev.data)
  if (m.id && pending.has(m.id)) { const { resolve, reject } = pending.get(m.id); pending.delete(m.id); m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result) }
}
function send(method, params = {}, useSession = true) {
  const id = nextId++
  ws.send(JSON.stringify({ id, method, params, ...(useSession && sessionId ? { sessionId } : {}) }))
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }))
}

const { targetInfos } = await send('Target.getTargets', {}, false)
const page = targetInfos.find((t) => t.type === 'page')
sessionId = (await send('Target.attachToTarget', { targetId: page.targetId, flatten: true }, false)).sessionId
await send('Page.enable'); await send('Runtime.enable')
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] })
await send('Emulation.setDeviceMetricsOverride', { width: 1500, height: 1300, deviceScaleFactor: 1, mobile: false })

async function evalJS(expression, awaitPromise = false) {
  const r = await send('Runtime.evaluate', { expression, awaitPromise, returnByValue: true })
  if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails))
  return r.result.value
}

await send('Page.navigate', { url: URL })
await sleep(3500) // load + hydrate + let the cycle interval settle past first paint

// Observe main-thread blocking over `ms` (catches several 3s-interval swaps), while
// counting distinct scoped palettes (proves cycling) and whether the flag fires.
// `override` injects CSS to change the transition behavior for this window:
//   off     -> transitions disabled (isolates the per-swap stylesheet-rebuild + recalc)
//   paint   -> the shipped rule (no override)
//   layout  -> re-adds layout props (what PR #302 animates) on top of paint
const probe = (label, ms, override) => `(async () => {
  const out = { label: ${JSON.stringify(label)}, distinctThemes: 0, flagFired: false, longTaskCount: 0, longTaskMs: 0, maxLongTaskMs: 0 };
  document.getElementById('__ov')?.remove();
  const ov = ${JSON.stringify(override)};
  if (ov) { const s = document.createElement('style'); s.id='__ov'; s.textContent = ov; document.head.appendChild(s); }
  const scopeStyle = () => document.querySelector('style[data-dotui-color]');
  let flag = false;
  const mo = new MutationObserver(() => { if (document.querySelector('[data-dotui-transition]')) flag = true; });
  mo.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ['data-dotui-transition'] });
  const lt = [];
  let obs; try { obs = new PerformanceObserver(l => { for (const e of l.getEntries()) lt.push(e); }); obs.observe({ entryTypes: ['longtask'] }); } catch {}
  const seen = new Set();
  const t0 = performance.now();
  while (performance.now() - t0 < ${ms}) { const c = scopeStyle()?.textContent || ''; if (c) seen.add(c.length + ':' + c.slice(0,160)); await new Promise(r=>setTimeout(r,200)); }
  obs?.disconnect(); mo.disconnect();
  out.distinctThemes = seen.size; out.flagFired = flag;
  out.longTaskCount = lt.length;
  out.longTaskMs = +lt.reduce((s,e)=>s+e.duration,0).toFixed(1);
  out.maxLongTaskMs = +lt.reduce((m,e)=>Math.max(m,e.duration),0).toFixed(1);
  return out;
})()`

const LAYOUT_OVERRIDE = `@media (prefers-reduced-motion: no-preference){[data-dotui-transition],[data-dotui-transition] *{transition-property:color,background-color,border-color,padding,gap,width,height,min-height,font-size,line-height,border-radius,box-shadow!important;transition-duration:450ms!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important}}`
const OFF_OVERRIDE = `[data-dotui-transition],[data-dotui-transition] *{transition-duration:0s!important}`

await send('Runtime.evaluate', { expression: `window.__errs=[];addEventListener('error',e=>window.__errs.push(String(e.message)));` })

const WINDOW = 12000 // ~4 swaps per mode
const result = { scopeFound: await evalJS(`!!document.querySelector('[data-dotui-scope]')`), modes: {} }
result.modes.paint_shipped  = await evalJS(probe('paint_shipped', WINDOW, ''), true)
result.modes.transition_off = await evalJS(probe('transition_off', WINDOW, OFF_OVERRIDE), true)
result.modes.layout_pr302   = await evalJS(probe('layout_pr302', WINDOW, LAYOUT_OVERRIDE), true)
await evalJS(`document.getElementById('__ov')?.remove()`)
result.pageErrors = await evalJS('window.__errs || []')

// Screenshot (likely mid-cycle).
const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 70, clip: { x: 0, y: 0, width: 1500, height: 900, scale: 1 } })
writeFileSync(SHOT, Buffer.from(shot.data, 'base64'))

console.log(JSON.stringify(result, null, 2))
ws.close(); chrome.kill()
