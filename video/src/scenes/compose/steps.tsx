import type { CSSProperties, ReactNode } from "react"
import { AbsoluteFill } from "remotion"

import { MailIcon } from "@/registry/icons"
import { Button } from "@/registry/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/ui/card"
import { Description, Label } from "@/registry/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { TextField } from "@/registry/ui/text-field"

import { Theme } from "../../lib/theme"

/* The newsletter field, built up one composition at a time. Each step is the
   real registry tree; `data-flip` names the parts the preview morphs between
   steps (see flip.ts). A part can carry several names when one element plays
   two roles (a bare Input is both the field box and the text). */

export const PLACEHOLDER = "you@example.com"
export const TITLE = "Stay in the loop"
export const HINT = "No spam, ever."

export const CODES = [
  `<Input placeholder="${PLACEHOLDER}" />`,
  `<TextField>
  <Label>Email</Label>
  <Input placeholder="${PLACEHOLDER}" />
</TextField>`,
  `<TextField>
  <Label>Email</Label>
  <Input placeholder="${PLACEHOLDER}" />
  <Description>${HINT}</Description>
</TextField>`,
  `<TextField>
  <Label>Email</Label>
  <InputGroup>
    <InputGroupAddon>
      <MailIcon />
    </InputGroupAddon>
    <Input placeholder="${PLACEHOLDER}" />
  </InputGroup>
  <Description>${HINT}</Description>
</TextField>`,
  `<TextField>
  <Label>Email</Label>
  <InputGroup>
    <InputGroupAddon>
      <MailIcon />
    </InputGroupAddon>
    <Input placeholder="${PLACEHOLDER}" />
    <InputGroupAddon>
      <Button variant="primary">Subscribe</Button>
    </InputGroupAddon>
  </InputGroup>
  <Description>${HINT}</Description>
</TextField>`,
  `<Card>
  <CardHeader>
    <CardTitle>${TITLE}</CardTitle>
  </CardHeader>
  <CardContent>
    <TextField>
      <Label>Email</Label>
      <InputGroup>
        <InputGroupAddon>
          <MailIcon />
        </InputGroupAddon>
        <Input placeholder="${PLACEHOLDER}" />
        <InputGroupAddon>
          <Button variant="primary">Subscribe</Button>
        </InputGroupAddon>
      </InputGroup>
      <Description>${HINT}</Description>
    </TextField>
  </CardContent>
</Card>`,
] as const

export const LAST_STEP = CODES.length - 1

/** Width of the field block (component px, before any zoom). */
export const FIELD_WIDTH = 320

export function Newsletter({
  step = LAST_STEP,
  focus,
}: {
  step?: number
  /** Which control shows its keyboard focus ring. */
  focus?: "button"
}) {
  if (step === 0) {
    return (
      <Input
        data-flip="field text"
        aria-label="Email"
        placeholder={PLACEHOLDER}
        style={{ width: FIELD_WIDTH }}
      />
    )
  }

  const control =
    step < 3 ? (
      <Input data-flip="field text" placeholder={PLACEHOLDER} />
    ) : (
      <InputGroup data-flip="field">
        <InputGroupAddon data-flip="icon">
          <MailIcon />
        </InputGroupAddon>
        <Input
          data-flip="text"
          data-compose-input=""
          placeholder={PLACEHOLDER}
        />
        {step >= 4 ? (
          <InputGroupAddon data-flip="action">
            <Button
              variant="primary"
              data-compose-button=""
              className={focus === "button" ? "focus-ring" : undefined}
            >
              Subscribe
            </Button>
          </InputGroupAddon>
        ) : null}
      </InputGroup>
    )

  const field = (
    <TextField style={{ width: FIELD_WIDTH }}>
      <Label data-flip="label">Email</Label>
      {control}
      {step >= 2 ? <Description data-flip="hint">{HINT}</Description> : null}
    </TextField>
  )

  if (step < LAST_STEP) return field

  return (
    <Card data-flip="card" data-compose-card="">
      <CardHeader data-flip="header">
        <CardTitle>{TITLE}</CardTitle>
      </CardHeader>
      <CardContent>{field}</CardContent>
    </Card>
  )
}

/* The card's layout box: a fixed stage (component px) with its content
   centred. Compose builds inside it; HandoffCard is the same box holding the
   finished card, so both scenes lay the card out identically. */
export const STAGE = { width: 420, height: 260 } as const

export const CENTERED: CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}

export function CardStage({
  zoom,
  children,
}: {
  zoom: number
  children: ReactNode
}) {
  return (
    <div
      style={{
        position: "relative",
        zoom,
        width: STAGE.width,
        height: STAGE.height,
        flex: "none",
      }}
    >
      {children}
    </div>
  )
}

/** Screen px per component px on Compose's last frame. */
export const HANDOFF_SCALE = 2

/**
 * Compose's last frame, minus the ground: the finished card, default builder
 * state, light mode, centred at (960, 540) at HANDOFF_SCALE, nothing focused.
 * Render it full-frame with no transform to match the cut pixel for pixel.
 */
export function HandoffCard() {
  return (
    <Theme mode="light">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <CardStage zoom={HANDOFF_SCALE}>
          <div style={CENTERED}>
            <Newsletter />
          </div>
        </CardStage>
      </AbsoluteFill>
    </Theme>
  )
}
