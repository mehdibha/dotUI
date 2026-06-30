// Drives real headless Chrome over the DevTools Protocol (Node 24 built-in WebSocket).
// Loads harness.html, CPU-throttles to emulate real devices, runs each animation
// mode, and prints aggregated frame-pacing + main-thread-blocking metrics.
import { spawn } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9334
const HARNESS = 'file://' + join(import.meta.dirname, 'harness.html')
const OUT = join(import.meta.dirname, 'results.json')
// CPU throttle multipliers. 1 = unthrottled desktop, 4 ~ a mid-range laptop /
// high-end phone. (6x was dropped: the pathological `current` mode stalls the
// renderer for minutes at that rate — itself a finding, but it blocks measuring.)
const RATES = [1, 4]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const userDataDir = mkdtempSync(join(tmpdir(), 'cdp-'))
const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${userDataDir}`, '--no-first-run', '--no-default-browser-check',
  '--disable-extensions', '--window-size=1500,1200', '--force-device-scale-factor=1',
  '--allow-file-access-from-files', HARNESS,
], { stdio: 'ignore' })

async function getJSON(path) {
  const res = await fetch(`http://127.0.0.1:${PORT}${path}`)
  return res.json()
}

// Wait for the debugger HTTP endpoint.
let version
for (let i = 0; i < 100; i++) {
  try { version = await getJSON('/json/version'); break } catch { await sleep(100) }
}
if (!version) { chrome.kill(); throw new Error('Chrome did not start') }

const ws = new WebSocket(version.webSocketDebuggerUrl)
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej })

let nextId = 1
const pending = new Map()
let sessionId = null
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data)
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id)
    pending.delete(msg.id)
    msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result)
  }
}
function send(method, params = {}, useSession = true) {
  const id = nextId++
  const payload = { id, method, params }
  if (useSession && sessionId) payload.sessionId = sessionId
  ws.send(JSON.stringify(payload))
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }))
}

// Attach to the page target created from the harness URL.
const { targetInfos } = await send('Target.getTargets', {}, false)
let page = targetInfos.find((t) => t.type === 'page' && t.url.includes('harness.html'))
for (let i = 0; i < 50 && !page; i++) {
  await sleep(100)
  const r = await send('Target.getTargets', {}, false)
  page = r.targetInfos.find((t) => t.type === 'page')
}
const att = await send('Target.attachToTarget', { targetId: page.targetId, flatten: true }, false)
sessionId = att.sessionId

await send('Page.enable')
await send('Runtime.enable')
await send('Emulation.setDeviceMetricsOverride', {
  width: 1500, height: 1200, deviceScaleFactor: 1, mobile: false,
})

async function evalJS(expression, awaitPromise = false) {
  const r = await send('Runtime.evaluate', {
    expression, awaitPromise, returnByValue: true,
  })
  if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails))
  return r.result.value
}

// Wait for the harness to mount + signal ready.
for (let i = 0; i < 100; i++) {
  const ready = await evalJS('window.__READY__ === true').catch(() => false)
  if (ready) break
  await sleep(100)
}

const report = {}
for (const rate of RATES) {
  await send('Emulation.setCPUThrottlingRate', { rate })
  await sleep(300)
  const res = await evalJS('window.__run()', true)
  report[`cpu_${rate}x`] = res
  // Persist + print after EACH rate so a later stall never loses earlier data.
  writeFileSync(OUT, JSON.stringify(report, null, 2))
  process.stderr.write(`  done cpu ${rate}x (nodes=${res.nodeCount})\n`)
}

console.log(JSON.stringify(report, null, 2))

ws.close()
chrome.kill()
