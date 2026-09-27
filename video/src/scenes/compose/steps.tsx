import { MailIcon } from "@/registry/icons"
import { Button } from "@/registry/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/ui/card"
import { Description, Label } from "@/registry/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { TextField } from "@/registry/ui/text-field"

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
      <Button>Subscribe</Button>
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
          <Button>Subscribe</Button>
        </InputGroupAddon>
      </InputGroup>
      <Description>${HINT}</Description>
    </TextField>
  </CardContent>
</Card>`,
] as const

export const LAST_STEP = CODES.length - 1

/** Width of the field block (component px, before the preview's scale). */
export const FIELD_WIDTH = 320

export function Newsletter({
  step,
  focus,
}: {
  step: number
  /** Which control shows its keyboard focus ring. */
  focus?: "input" | "button"
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
