// Isolate the LAYOUT cost per frame during the morph (excludes GPU paint, which
// headless software-rasters and which dominates the rAF interval). If layout/frame
// is small, real hardware (GPU paint) is smooth even though headless isn't.
import { spawn } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9342
const URL = process.argv[2] || 'http://localhost:4445/'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const userDataDir = mkdtempSync(join(tmpdir(), 'cdp-v5-'))
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${userDataDir}`, '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--window-size=1500,1300', '--force-device-scale-factor=1', 'about:blank'], { stdio: 'ignore' })
async function getJSON(p) { return (await fetch(`http://127.0.0.1:${PORT}${p}`)).json() }
let v; for (let i = 0; i < 100; i++) { try { v = await getJSON('/json/version'); break } catch { await sleep(100) } }
const ws = new WebSocket(v.webSocketDebuggerUrl); await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej })
let id = 1, sid = null; const pend = new Map()
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { const { resolve, reject } = pend.get(m.id); pend.delete(m.id); m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result) } }
const send = (method, params = {}, useS = true) => { const i = id++; ws.send(JSON.stringify({ id: i, method, params, ...(useS && sid ? { sessionId: sid } : {}) })); return new Promise((resolve, reject) => pend.set(i, { resolve, reject })) }
const { targetInfos } = await send('Target.getTargets', {}, false)
sid = (await send('Target.attachToTarget', { targetId: targetInfos.find((t) => t.type === 'page').targetId, flatten: true }, false)).sessionId
await send('Page.enable'); await send('Runtime.enable')
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] })
await send('Emulation.setDeviceMetricsOverride', { width: 1500, height: 1300, deviceScaleFactor: 1, mobile: false })
const evalJS = async (expr, awaitPromise = false) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise, returnByValue: true }); if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails)); return r.result.value }
await send('Page.navigate', { url: URL }); await sleep(3800)

const measure = (name) => `(async () => {
  const grid = () => document.querySelector('[data-dotui-scope]')?.parentElement;
  const sw = document.querySelector('[role=radiogroup]'); if (sw) window.scrollTo(0, Math.max(0, sw.getBoundingClientRect().top + window.scrollY - 16));
  await new Promise(r => setTimeout(r, 300));
  const btn = [...document.querySelectorAll('[role=radio]')].find(b => b.textContent.trim() === ${JSON.stringify(name)});
  // Time the click → first forced layout (React render + style recalc + layout).
  grid()?.getBoundingClientRect();
  const c0 = performance.now(); btn?.click(); grid()?.getBoundingClientRect();
  const clickToLayout = performance.now() - c0;
  // Then time a forced layout each frame for the rest of the tween (pure layout).
  const layout = [];
  await new Promise((resolve) => {
    const t0 = performance.now();
    function frame() {
      const l0 = performance.now(); grid()?.getBoundingClientRect(); layout.push(performance.now() - l0);
      if (performance.now() - t0 < 600) requestAnimationFrame(frame); else resolve();
    }
    requestAnimationFrame(frame);
  });
  layout.sort((a,b)=>a-b);
  const p = (q) => layout.length ? +layout[Math.min(layout.length-1, Math.floor(q*layout.length))].toFixed(1) : 0;
  return { clickToLayoutMs: +clickToLayout.toFixed(1), frames: layout.length,
    layoutMedianMs: p(0.5), layoutP90Ms: p(0.9), layoutMaxMs: +Math.max(...layout).toFixed(1) };
})()`

const out = {}
out.toComfortable = await evalJS(measure('Material You'), true)
await sleep(800)
out.toCompact = await evalJS(measure('Vercel'), true)
console.log(JSON.stringify(out, null, 2))
ws.close(); chrome.kill()
