import type { CSSProperties, ReactNode } from "react"

import { SANS } from "./data"

/* macOS window chrome shared by the terminal and the editor. */

export function Window({
  width,
  height,
  bar,
  title,
  children,
  style,
}: {
  width: number
  height: number
  bar: number
  title: ReactNode
  children: ReactNode
  style?: CSSProperties
}) {
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: 16,
        overflow: "hidden",
        background: "linear-gradient(180deg, #131316 0%, #0c0c0e 100%)",
        boxShadow: [
          "inset 0 0 0 1px rgba(255,255,255,0.09)",
          "inset 0 1px 0 rgba(255,255,255,0.07)",
          "0 0 0 1px rgba(0,0,0,0.6)",
          "0 30px 80px -20px rgba(0,0,0,0.8)",
          "0 60px 160px -40px rgba(0,0,0,0.7)",
        ].join(", "),
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "0 0 auto 0",
          height: bar,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.025)",
          fontFamily: SANS,
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: "-0.01em",
          color: "rgba(255,255,255,0.46)",
        }}
      >
        <TrafficLights style={{ position: "absolute", left: 20 }} />
        {title}
      </div>
      {children}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(125deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0) 38%)",
        }}
      />
    </div>
  )
}

function TrafficLights({ style }: { style?: CSSProperties }) {
  return (
    <div style={{ display: "flex", gap: 8, ...style }}>
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
        <span
          key={c}
          style={{
            width: 13,
            height: 13,
            borderRadius: 99,
            background: c,
            boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.25)",
          }}
        />
      ))}
    </div>
  )
}
