"use client"

import { useComponentParams } from "@/lib/styles"
import { MailIcon } from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { Checkbox } from "@/registry/ui/checkbox"
import { Description, FieldError, Label } from "@/registry/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { useStyles as useInputStyles } from "@/registry/ui/input/styles"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/ui/select"
import { TextField } from "@/registry/ui/text-field"

import {
  Board,
  BoardSection,
  CAPTION,
  stateProps,
  useBoardFocus,
  useReplay,
  useSteps,
} from "./board"

type FieldState = "rest" | "hover" | "focus" | "invalid" | "disabled"

const LABEL: Record<FieldState, string> = {
  rest: "Rest",
  hover: "Hover",
  focus: "Focus",
  invalid: "Invalid",
  disabled: "Disabled",
}

const DIM = "transition-opacity duration-300"

/** Input's `focus:` reads `data-focused`, so a frozen field needs it too. */
function fieldAttributes(state: FieldState) {
  if (state === "focus")
    return { ...stateProps("focus"), "data-focused": "true" }
  if (state === "invalid")
    return { ...stateProps("invalid"), "aria-invalid": true }
  if (state === "disabled") return { ...stateProps("disabled"), disabled: true }
  return stateProps(state)
}

export function FrozenInput({ state }: { state: FieldState }) {
  const { input } = useInputStyles()()
  return (
    <input
      data-input=""
      aria-label={LABEL[state]}
      value="ada@acme.dev"
      readOnly
      tabIndex={-1}
      {...fieldAttributes(state)}
      className={input({ className: "w-full" })}
    />
  )
}

function States() {
  const { axis } = useBoardFocus()
  const hover = (useComponentParams("input").hover ?? "none") !== "none"
  // Hover draws nothing on some shells; show it then only while it is edited.
  const states: FieldState[] =
    hover || axis === "inputHover"
      ? ["rest", "hover", "focus", "disabled"]
      : ["rest", "focus", "disabled"]
  const emphasis = axis === "inputHover" ? "hover" : undefined
  return (
    <div
      inert
      style={{ "--cols": `repeat(${states.length},minmax(0,1fr))` } as object}
      className="grid w-full grid-cols-1 gap-x-5 gap-y-5 @md/section:grid-cols-2 @xl/section:grid-cols-(--cols)"
    >
      {states.map((state) => (
        <div
          key={state}
          className={cn(
            "flex min-w-0 flex-col items-center gap-2",
            DIM,
            emphasis && emphasis !== state && "opacity-35",
          )}
        >
          <FrozenInput state={state} />
          <span className={CAPTION}>{LABEL[state]}</span>
        </div>
      ))}
    </div>
  )
}

function Fields() {
  const { axis } = useBoardFocus()
  const dim = axis === "inputError" && "opacity-35"
  return (
    <div className="grid w-full grid-cols-1 items-start gap-x-5 gap-y-6 @2xl/section:grid-cols-3">
      <TextField defaultValue="Acme Inc." className={cn(DIM, dim)}>
        <Label>Workspace name</Label>
        <Input />
        <Description>Shown on invoices.</Description>
      </TextField>
      <TextField className={cn(DIM, dim)}>
        <Label>Invite a teammate</Label>
        <div className="flex items-center gap-2">
          <InputGroup className="min-w-0 flex-1">
            <InputGroupAddon>
              <MailIcon />
            </InputGroupAddon>
            <Input placeholder="name@acme.dev" />
          </InputGroup>
          <Button variant="primary">Invite</Button>
        </div>
        <Description>They join as a member.</Description>
      </TextField>
      <TextField defaultValue="ada" isInvalid>
        <Label>Username</Label>
        <Input />
        <FieldError>That username is taken.</FieldError>
      </TextField>
    </div>
  )
}

const LOOP: FieldState[] = ["rest", "hover", "focus", "invalid"]

function Replay() {
  const motion = useReplay("fieldMotion")
  const step = useSteps(motion, 1000)
  if (!motion.running)
    return (
      <TextField
        aria-label="Email"
        defaultValue="ada@acme.dev"
        className="w-full max-w-xs"
      >
        <Input />
      </TextField>
    )
  return (
    <div inert className="w-full max-w-xs">
      <FrozenInput state={LOOP[step % LOOP.length] ?? "rest"} />
    </div>
  )
}

function Invalid() {
  return (
    <div className="grid w-full grid-cols-1 items-start gap-x-4 gap-y-5 sm:grid-cols-[1fr_1fr_auto]">
      <TextField defaultValue="ada@example" isInvalid>
        <Label>Email</Label>
        <Input />
        <FieldError>Enter a valid email.</FieldError>
      </TextField>
      <Select isInvalid placeholder="Choose a plan">
        <Label>Plan</Label>
        <SelectTrigger />
        <SelectContent>
          <SelectItem>Starter</SelectItem>
          <SelectItem>Team</SelectItem>
          <SelectItem>Enterprise</SelectItem>
        </SelectContent>
        <FieldError>Pick a plan.</FieldError>
      </Select>
      <Checkbox isInvalid className="sm:self-center">
        Accept terms
      </Checkbox>
    </div>
  )
}

export default function FieldBoard() {
  return (
    <Board id="field">
      <BoardSection title="States">
        <States />
      </BoardSection>
      <BoardSection title="In context">
        <Fields />
      </BoardSection>
      <BoardSection title="Invalid">
        <Invalid />
      </BoardSection>
      <BoardSection title="Motion">
        <Replay />
      </BoardSection>
    </Board>
  )
}
