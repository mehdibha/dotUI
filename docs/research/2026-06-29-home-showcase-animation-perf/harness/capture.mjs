import { spawn } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9341
const URL = process.argv[2] || 'http://localhost:4445/'
const DIR = import.meta.dirname
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const userDataDir = mkdtempSync(join(tmpdir(), 'cdp-cap-'))
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
const shot = async (name) => { const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 75 }); writeFileSync(join(DIR, name), Buffer.from(s.data, 'base64')) }
await send('Page.navigate', { url: URL }); await sleep(3800)
// Scroll so the selector sits near the top of the viewport.
await evalJS(`(() => { const sw = document.querySelector('[role=radiogroup]'); if (sw) window.scrollTo(0, Math.max(0, sw.getBoundingClientRect().top + window.scrollY - 16)); })()`)
await sleep(400)
await shot('cap-before.jpg') // selector + grid at the default (compact) preset
// Click Material You (comfortable) and let the morph settle.
await evalJS(`(() => { const b = [...document.querySelectorAll('[role=radio]')].find(b => b.textContent.trim()==='Material You'); if (b) b.click(); })()`)
await sleep(900)
await shot('cap-after.jpg') // comfortable: spacing opened up
console.log('captured')
ws.close(); chrome.kill()
