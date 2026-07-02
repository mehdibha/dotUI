// Measure the click-driven spacing morph: click a preset, sample frame intervals +
// long-tasks during the ~500ms tween, confirm the grid height actually animates
// (density applied), and capture a mid-morph frame to eyeball column-jumping.
import { spawn } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9340
const URL = process.argv[2] || 'http://localhost:4445/'
const DIR = import.meta.dirname
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const userDataDir = mkdtempSync(join(tmpdir(), 'cdp-v4-'))
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
async function shot(name, clip) { const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 72, clip: { ...clip, scale: 1 } }); writeFileSync(join(DIR, name), Buffer.from(s.data, 'base64')) }

await send('Page.navigate', { url: URL })
await sleep(3500)
await evalJS(`window.__errs=[];addEventListener('error',e=>window.__errs.push(String(e.message)));`)

// Inject the morph harness + scroll the selector into view.
await evalJS(`(() => {
  const grid = () => document.querySelector('[data-dotui-scope]')?.parentElement;
  const sw = document.querySelector('[role=radiogroup]');
  if (sw) window.scrollTo(0, Math.max(0, sw.getBoundingClientRect().top + window.scrollY - 24));
  window.__startMorph = (name) => {
    const g = grid(); window.__h0 = g?.offsetHeight || 0;
    const btn = [...document.querySelectorAll('[role=radio]')].find(b => b.textContent.trim() === name);
    window.__frames=[]; window.__lt=[]; window.__flag=false; window.__done=false; window.__hF=0;
    try { new PerformanceObserver(l=>{for(const e of l.getEntries())window.__lt.push(e.duration)}).observe({entryTypes:['longtask']}); } catch {}
    const mo = new MutationObserver(()=>{ if(document.querySelector('[data-dotui-transition]')) window.__flag=true; });
    mo.observe(document.documentElement,{attributes:true,subtree:true,attributeFilter:['data-dotui-transition']});
    const t0=performance.now(); let last=t0;
    function frame(now){ window.__frames.push(now-last); last=now; if(now-t0<750) requestAnimationFrame(frame); else { mo.disconnect(); window.__hF=grid()?.offsetHeight||0; window.__done=true; } }
    const ok = !!btn; if (btn) btn.click();
    requestAnimationFrame(frame);
    return ok;
  };
  window.__getStats = () => { const f=window.__frames||[]; const lt=window.__lt||[]; return {
    h0: window.__h0, hF: window.__hF, heightDelta: (window.__hF||0)-(window.__h0||0), flag: window.__flag, done: window.__done,
    frames: f.length, jankFrames32: f.filter(d=>d>32).length, jankFrames50: f.filter(d=>d>50).length,
    maxFrameMs: +Math.max(0,...f).toFixed(1), meanFrameMs: +(f.reduce((s,d)=>s+d,0)/(f.length||1)).toFixed(1),
    longTaskMs: +lt.reduce((s,d)=>s+d,0).toFixed(1), maxLongTaskMs: +Math.max(0,...lt).toFixed(1), longTaskCount: lt.length };
  };
})()`)
await sleep(300)

const out = { modes: {} }
// Selector UI shot.
await shot('selector.jpg', { x: 0, y: 0, width: 1500, height: 360 })

async function runMorph(label, target, rate) {
  await send('Emulation.setCPUThrottlingRate', { rate })
  await sleep(200)
  const clicked = await evalJS(`window.__startMorph(${JSON.stringify(target)})`)
  await sleep(260)
  await shot(`morph-${label}.jpg`, { x: 0, y: 200, width: 1500, height: 900 }) // mid-morph
  await sleep(650)
  const stats = await evalJS(`window.__getStats()`)
  await send('Emulation.setCPUThrottlingRate', { rate: 1 })
  return { clicked, ...stats }
}

// Default(compact) -> Material You(comfortable): biggest spacing increase, native.
out.modes.toComfortable_1x = await runMorph('comfortable', 'Material You', 1)
await sleep(700)
// Back to a compact preset (shrink).
out.modes.toCompact_1x = await runMorph('compact', 'Vercel', 1)
await sleep(700)
// Stress: comfortable again under 4x CPU.
out.modes.toComfortable_4x = await runMorph('comfortable4x', 'Material You', 4)

out.pageErrors = await evalJS('window.__errs || []')
console.log(JSON.stringify(out, null, 2))
ws.close(); chrome.kill()
