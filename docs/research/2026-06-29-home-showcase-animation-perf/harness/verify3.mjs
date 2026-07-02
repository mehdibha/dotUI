// Verify the per-card layout morph: each showcase card carries a view-transition-name,
// the morph class toggles during a swap, cycling works, no errors.
import { spawn } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9339
const URL = process.argv[2] || 'http://localhost:4444/'
const SHOT = join(import.meta.dirname, 'vt-layout-morph.jpg')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const userDataDir = mkdtempSync(join(tmpdir(), 'cdp-v3-'))
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${userDataDir}`,
  '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--window-size=1500,1300',
  '--force-device-scale-factor=1', 'about:blank'], { stdio: 'ignore' })
async function getJSON(p) { return (await fetch(`http://127.0.0.1:${PORT}${p}`)).json() }
let version
for (let i = 0; i < 100; i++) { try { version = await getJSON('/json/version'); break } catch { await sleep(100) } }
const ws = new WebSocket(version.webSocketDebuggerUrl)
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej })
let nextId = 1, sessionId = null
const pending = new Map()
ws.onmessage = (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { const { resolve, reject } = pending.get(m.id); pending.delete(m.id); m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result) } }
function send(method, params = {}, useSession = true) { const id = nextId++; ws.send(JSON.stringify({ id, method, params, ...(useSession && sessionId ? { sessionId } : {}) })); return new Promise((resolve, reject) => pending.set(id, { resolve, reject })) }
const { targetInfos } = await send('Target.getTargets', {}, false)
const page = targetInfos.find((t) => t.type === 'page')
sessionId = (await send('Target.attachToTarget', { targetId: page.targetId, flatten: true }, false)).sessionId
await send('Page.enable'); await send('Runtime.enable')
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] })
await send('Emulation.setDeviceMetricsOverride', { width: 1500, height: 1300, deviceScaleFactor: 1, mobile: false })
async function evalJS(expression, awaitPromise = false) { const r = await send('Runtime.evaluate', { expression, awaitPromise, returnByValue: true }); if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails)); return r.result.value }

await send('Page.navigate', { url: URL })
await sleep(3500)
await evalJS(`window.__errs=[];addEventListener('error',e=>window.__errs.push(String(e.message)));`)

const probe = `(async () => {
  const out = {};
  const row = document.querySelector('[data-dotui-scope]')?.parentElement;
  if (row) window.scrollTo(0, Math.max(0, row.getBoundingClientRect().top + window.scrollY - 120));
  await new Promise(r => setTimeout(r, 400));
  // Cards carrying a view-transition-name (inline style).
  const named = [...document.querySelectorAll('[style*="view-transition-name"]')]
    .map(el => getComputedStyle(el).viewTransitionName).filter(n => n && n !== 'none');
  out.namedCount = named.length;
  out.sampleNames = named.slice(0, 6);
  // Watch the morph class + distinct palettes over a few swaps.
  let morphClassSeen = false;
  const obs = new MutationObserver(() => { if (document.documentElement.classList.contains('dotui-showcase-morphing')) morphClassSeen = true; });
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  const palettes = new Set();
  const t0 = performance.now();
  while (performance.now() - t0 < 10000) {
    const css = document.querySelector('style[data-dotui-color]')?.textContent || '';
    if (css) palettes.add(css.length + ':' + css.slice(0, 120));
    if (document.documentElement.classList.contains('dotui-showcase-morphing')) morphClassSeen = true;
    await new Promise(r => setTimeout(r, 100));
  }
  obs.disconnect();
  out.morphClassSeen = morphClassSeen;
  out.distinctPalettes = palettes.size;
  out.vtSupported = typeof document.startViewTransition === 'function';
  return out;
})()`

const result = await evalJS(probe, true)
result.pageErrors = await evalJS('window.__errs || []')
const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 70, clip: { x: 0, y: 0, width: 1500, height: 950, scale: 1 } })
writeFileSync(SHOT, Buffer.from(shot.data, 'base64'))
console.log(JSON.stringify(result, null, 2))
ws.close(); chrome.kill()
