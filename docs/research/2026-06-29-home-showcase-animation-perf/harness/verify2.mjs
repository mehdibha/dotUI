// VT density-morph verification on the real dev server. Measures: VT support, that
// cycling works (distinct palettes), that the CSS flag does NOT fire (VT path), the
// main-thread cost per swap, and — critically — how much the page below SHIFTS as
// density cycles (documentElement.scrollHeight + the "Built on" section's top).
import { spawn } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9337
const URL = process.argv[2] || 'http://localhost:4447/'
const SHOT = join(import.meta.dirname, 'vt-morph.jpg')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const userDataDir = mkdtempSync(join(tmpdir(), 'cdp-v2-'))
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${userDataDir}`,
  '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--window-size=1500,1300',
  '--force-device-scale-factor=1', 'about:blank'], { stdio: 'ignore' })

async function getJSON(p) { return (await fetch(`http://127.0.0.1:${PORT}${p}`)).json() }
let version
for (let i = 0; i < 100; i++) { try { version = await getJSON('/json/version'); break } catch { await sleep(100) } }
if (!version) { chrome.kill(); throw new Error('Chrome did not start') }
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
  // Scroll the showcase into view (it sits below a full-height hero); the swap gate
  // pauses while it's off-screen, so cycling only runs once it's visible.
  const row = document.querySelector('[data-dotui-scope]')?.parentElement;
  if (row) window.scrollTo(0, Math.max(0, row.getBoundingClientRect().top + window.scrollY - 120));
  await new Promise(r => setTimeout(r, 400));
  const r0 = row?.getBoundingClientRect();
  out.afterScroll = r0 ? { top: Math.round(r0.top), bottom: Math.round(r0.bottom), vh: window.innerHeight } : null;
  out.vtSupported = typeof document.startViewTransition === 'function';
  out.scopeFound = !!document.querySelector('[data-dotui-scope]');
  const findSection = () => [...document.querySelectorAll('section')].find(s => /Built on/i.test(s.textContent||''));
  const scopeStyle = () => document.querySelector('style[data-dotui-color]');
  let flagFired = false;
  new MutationObserver(()=>{ if(document.querySelector('[data-dotui-transition]')) flagFired=true; })
    .observe(document.documentElement,{attributes:true,subtree:true,attributeFilter:['data-dotui-transition']});
  const lt=[]; try{ new PerformanceObserver(l=>{for(const e of l.getEntries())lt.push(e)}).observe({entryTypes:['longtask']});}catch{}
  const palettes=new Set(); let minH=Infinity,maxH=0,minT=Infinity,maxT=0, sawSection=false;
  const t0=performance.now();
  while(performance.now()-t0 < 26000){
    const h=document.documentElement.scrollHeight; minH=Math.min(minH,h); maxH=Math.max(maxH,h);
    const sec=findSection(); if(sec){sawSection=true; const top=sec.getBoundingClientRect().top+window.scrollY; minT=Math.min(minT,top); maxT=Math.max(maxT,top);}
    const css=scopeStyle()?.textContent||''; if(css) palettes.add(css.length+':'+css.slice(0,120));
    await new Promise(r=>setTimeout(r,200));
  }
  out.distinctPalettes=palettes.size;
  out.pageHeightDelta=maxH-minH;
  out.sectionTopShift= sawSection ? Math.round(maxT-minT) : null;
  out.flagFired=flagFired;
  out.longTaskCount=lt.length; out.longTaskMs=+lt.reduce((s,e)=>s+e.duration,0).toFixed(1); out.maxLongTaskMs=+lt.reduce((m,e)=>Math.max(m,e.duration),0).toFixed(1);
  return out;
})()`

const result = await evalJS(probe, true)
result.pageErrors = await evalJS('window.__errs || []')
const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 70, clip: { x: 0, y: 0, width: 1500, height: 950, scale: 1 } })
writeFileSync(SHOT, Buffer.from(shot.data, 'base64'))
console.log(JSON.stringify(result, null, 2))
ws.close(); chrome.kill()
