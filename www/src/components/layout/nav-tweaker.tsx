import { useEffect, useState, type ReactNode } from 'react'

// TEMP (#305): floating panel to dial in the navbar tint darkness + dither grain.
// Visible only with `?tweak` in the URL; writes --nav-tint / --nav-dither on :root
// so the header's tint + dither update live (no rebuild). The defaults here mirror
// the `var(..., default)` fallbacks in header.tsx — keep them in sync. Delete this
// file + its <NavTweaker /> in header.tsx once the values are chosen.
const TINT_DEFAULT = 0.88
const DITHER_DEFAULT = 0.05

export function NavTweaker() {
  const [show, setShow] = useState(false)
  const [tint, setTint] = useState(TINT_DEFAULT)
  const [dither, setDither] = useState(DITHER_DEFAULT)

  // Prerendered routes don't surface ?tweak via the router — read the URL directly.
  useEffect(() => {
    setShow(new URLSearchParams(window.location.search).has('tweak'))
  }, [])

  useEffect(() => {
    if (!show) return
    const root = document.documentElement
    root.style.setProperty('--nav-tint', String(tint))
    root.style.setProperty('--nav-dither', String(dither))
    return () => {
      root.style.removeProperty('--nav-tint')
      root.style.removeProperty('--nav-dither')
    }
  }, [show, tint, dither])

  if (!show) return null

  return (
    <div
      style={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        zIndex: 100,
        width: 236,
        padding: 14,
        borderRadius: 12,
        background: 'rgba(18, 18, 18, 0.92)',
        color: '#e5e5e5',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        fontSize: 12,
        lineHeight: 1.4,
        boxShadow: '0 10px 34px rgba(0, 0, 0, 0.55)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <div
        style={{
          fontWeight: 600,
          marginBottom: 12,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>Navbar tweaker</span>
        <span style={{ opacity: 0.45 }}>#305</span>
      </div>

      <Row label="Tint darkness" value={tint.toFixed(2)}>
        <input
          type="range"
          aria-label="Tint darkness"
          min={0.4}
          max={1}
          step={0.02}
          value={tint}
          onChange={(e) => setTint(Number(e.target.value))}
          style={{ width: '100%' }}
        />
      </Row>

      <Row label="Dither grain" value={dither.toFixed(3)}>
        <input
          type="range"
          aria-label="Dither grain"
          min={0}
          max={0.12}
          step={0.005}
          value={dither}
          onChange={(e) => setDither(Number(e.target.value))}
          style={{ width: '100%' }}
        />
      </Row>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 4,
        }}
      >
        <code style={{ opacity: 0.6, fontSize: 11 }}>
          {tint.toFixed(2)} / {dither.toFixed(3)}
        </code>
        <button
          type="button"
          onClick={() => {
            setTint(TINT_DEFAULT)
            setDither(DITHER_DEFAULT)
          }}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            color: '#e5e5e5',
            borderRadius: 6,
            padding: '2px 8px',
            fontSize: 11,
            cursor: 'pointer',
          }}
        >
          Reset
        </button>
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  children,
}: {
  label: string
  value: string
  children: ReactNode
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 5,
        }}
      >
        <span>{label}</span>
        <span style={{ opacity: 0.6 }}>{value}</span>
      </div>
      {children}
    </div>
  )
}
