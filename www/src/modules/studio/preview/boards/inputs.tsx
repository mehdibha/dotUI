"use client"

import { ChevronDownIcon, CopyIcon, MailIcon, SendIcon } from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { Combobox } from "@/registry/ui/combobox"
import { Description, FieldError, Label } from "@/registry/ui/field"
import {
  Input,
  InputGroup,
  InputGroupAddon,
  TextArea,
} from "@/registry/ui/input"
import { useStyles as useInputStyles } from "@/registry/ui/input/styles"
import { ListBox, ListBoxItem } from "@/registry/ui/list-box"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
} from "@/registry/ui/number-field"
import {
  OTPField,
  OTPFieldGroup,
  OTPFieldSeparator,
} from "@/registry/ui/otp-field"
import { Popover } from "@/registry/ui/popover"
import { useStyles as usePopoverStyles } from "@/registry/ui/popover/styles"
import { SearchField } from "@/registry/ui/search-field"
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
  useLoop,
} from "./board"

/* ---------------------------------- States --------------------------------- */

type FieldState =
  | "rest"
  | "hover"
  | "focus"
  | "invalid"
  | "disabled"
  | "readonly"

const STATES: { state: FieldState; label: string; value: string }[] = [
  { state: "rest", label: "Rest", value: "ada@acme.dev" },
  { state: "hover", label: "Hover", value: "ada@acme.dev" },
  { state: "focus", label: "Focus", value: "ada@acme.dev" },
  { state: "invalid", label: "Invalid", value: "ada@acme" },
  { state: "disabled", label: "Disabled", value: "ada@acme.dev" },
  { state: "readonly", label: "Read-only", value: "ada@acme.dev" },
]

// The state each key styles, so its cell stands out while the panel edits it.
const STATE_OF_AXIS: Record<string, FieldState> = {
  inputHover: "hover",
  focusInputStyle: "focus",
  focusInputColor: "focus",
  inputMotion: "focus",
  inputError: "invalid",
}

/** Input's `focus:` reads `data-focused`, so a frozen field needs it too. */
function fieldAttributes(state: FieldState) {
  if (state === "readonly") return { ...stateProps("rest"), readOnly: true }
  if (state === "focus")
    return { ...stateProps("focus"), "data-focused": "true" }
  if (state === "invalid")
    return { ...stateProps("invalid"), "aria-invalid": true }
  if (state === "disabled") return { ...stateProps("disabled"), disabled: true }
  return stateProps(state)
}

function InputStates() {
  const { input } = useInputStyles()()
  const { axis } = useBoardFocus()
  const emphasis = axis ? STATE_OF_AXIS[axis] : undefined
  const replay = useLoop(axis === "inputMotion", 1100, true)
  return (
    <div
      inert
      className="grid w-full grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-3"
    >
      {STATES.map(({ state, label, value }) => {
        const shown = state === "focus" && !replay ? "rest" : state
        return (
          <div
            key={state}
            className={cn(
              "flex min-w-0 flex-col items-center gap-2 transition-opacity duration-300",
              emphasis && emphasis !== state && "opacity-35",
            )}
          >
            <input
              data-input=""
              aria-label={label}
              defaultValue={value}
              tabIndex={-1}
              {...fieldAttributes(shown)}
              className={input({ className: "w-full" })}
            />
            <span className={CAPTION}>{label}</span>
          </div>
        )
      })}
    </div>
  )
}

/* -------------------------------- Specimens -------------------------------- */

function Grid({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 items-start gap-x-8 gap-y-7 sm:grid-cols-2",
        className,
      )}
    >
      {children}
    </div>
  )
}

function TextFields() {
  return (
    <Grid>
      <TextField defaultValue="acme">
        <Label>Website</Label>
        <InputGroup>
          <InputGroupAddon>https://</InputGroupAddon>
          <Input />
          <InputGroupAddon>.dev</InputGroupAddon>
        </InputGroup>
      </TextField>
      <TextField defaultValue="dotui.org/join/7hk2q">
        <Label>Invite link</Label>
        <InputGroup>
          <Input />
          <InputGroupAddon>
            <Button variant="quiet" isIconOnly aria-label="Copy link">
              <CopyIcon />
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </TextField>
      <SearchField aria-label="Search" placeholder="Search projects" />
      <TextField aria-label="Email">
        <InputGroup>
          <InputGroupAddon>
            <MailIcon />
          </InputGroupAddon>
          <Input placeholder="you@company.com" />
        </InputGroup>
      </TextField>
      <TextField
        className="sm:col-span-2"
        defaultValue="Fixed the export dialog losing its scroll position on resize."
      >
        <Label>Release notes</Label>
        <TextArea />
      </TextField>
    </Grid>
  )
}

function Fields() {
  return (
    <Grid className="md:grid-cols-3">
      <TextField defaultValue="Acme Inc.">
        <Label>Workspace name</Label>
        <Input />
        <Description>Shown on invoices.</Description>
      </TextField>
      <TextField isRequired>
        <Label>Email</Label>
        <Input placeholder="you@company.com" />
        <Description>We send a confirmation link.</Description>
      </TextField>
      <TextField defaultValue="ada" isInvalid>
        <Label>Username</Label>
        <Input />
        <FieldError>That username is taken.</FieldError>
      </TextField>
    </Grid>
  )
}

function NumberFields() {
  return (
    <Grid className="md:grid-cols-3">
      <NumberField defaultValue={12} minValue={1}>
        <Label>Seats</Label>
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <Input />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
      <NumberField
        defaultValue={24}
        minValue={0}
        formatOptions={{ style: "currency", currency: "USD" }}
      >
        <Label>Price</Label>
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <Input />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
      <NumberField
        defaultValue={0.15}
        step={0.05}
        minValue={0}
        maxValue={1}
        formatOptions={{ style: "percent" }}
      >
        <Label>Discount</Label>
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <Input />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
    </Grid>
  )
}

function Code({
  value,
  isInvalid,
  children,
}: {
  value: string
  isInvalid?: boolean
  children: React.ReactNode
}) {
  const digits = Array.from({ length: 3 }, (_, i) => i)
  return (
    <OTPField
      length={6}
      defaultValue={value}
      isInvalid={isInvalid}
      className="w-fit"
    >
      <Label>Verification code</Label>
      <div className="flex items-center">
        <OTPFieldGroup>
          {digits.map((i) => (
            <Input key={i} aria-label={`Digit ${i + 1}`} />
          ))}
        </OTPFieldGroup>
        <OTPFieldSeparator className="px-2 text-fg-muted">-</OTPFieldSeparator>
        <OTPFieldGroup>
          {digits.map((i) => (
            <Input key={i} aria-label={`Digit ${i + 4}`} />
          ))}
        </OTPFieldGroup>
      </div>
      {children}
    </OTPField>
  )
}

function Codes() {
  return (
    <div className="flex w-full flex-wrap justify-center gap-x-12 gap-y-7">
      <Code value="4829">
        <Description>Sent to ada@acme.dev</Description>
      </Code>
      <Code value="482913" isInvalid>
        <FieldError>This code has expired.</FieldError>
      </Code>
    </div>
  )
}

const PLANS = [
  { id: "free", name: "Free" },
  { id: "pro", name: "Pro" },
  { id: "team", name: "Team" },
  { id: "enterprise", name: "Enterprise" },
]

const COUNTRIES = [
  { id: "ca", name: "Canada" },
  { id: "fr", name: "France" },
  { id: "de", name: "Germany" },
  { id: "jp", name: "Japan" },
  { id: "tn", name: "Tunisia" },
]

/** An open select, frozen: its trigger over the list it opens. */
function OpenSelect() {
  const { popover } = usePopoverStyles()()
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <Select defaultSelectedKey="pro">
        <Label>Plan</Label>
        <SelectTrigger className="w-full" />
        <SelectContent items={PLANS}>
          {(plan) => <SelectItem>{plan.name}</SelectItem>}
        </SelectContent>
      </Select>
      <div inert className={popover({ className: "w-full" })}>
        <ListBox
          aria-label="Plans"
          items={PLANS}
          selectionMode="single"
          defaultSelectedKeys={["pro"]}
        >
          {(plan) => <ListBoxItem>{plan.name}</ListBoxItem>}
        </ListBox>
      </div>
    </div>
  )
}

function Selects() {
  return (
    <Grid className="md:grid-cols-3">
      <Select defaultSelectedKey="fra">
        <Label>Region</Label>
        <SelectTrigger className="w-full" />
        <SelectContent>
          <SelectItem id="fra">Frankfurt</SelectItem>
          <SelectItem id="iad">Washington</SelectItem>
          <SelectItem id="sin">Singapore</SelectItem>
        </SelectContent>
      </Select>
      <Combobox
        defaultSelectedKey="de"
        defaultInputValue="Germany"
        defaultItems={COUNTRIES}
      >
        <Label>Country</Label>
        <InputGroup>
          <Input />
          <InputGroupAddon>
            <Button variant="quiet" isIconOnly aria-label="Show countries">
              <ChevronDownIcon />
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <Popover>
          <ListBox>
            {(country: (typeof COUNTRIES)[number]) => (
              <ListBoxItem>{country.name}</ListBoxItem>
            )}
          </ListBox>
        </Popover>
      </Combobox>
      <OpenSelect />
    </Grid>
  )
}

/** A field beside the button that submits it: heights and styles meet. */
function Pairs() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-4">
      <div className="flex items-center gap-2">
        <TextField aria-label="Invite by email" className="min-w-0 flex-1">
          <Input placeholder="you@company.com" />
        </TextField>
        <Button variant="primary">
          <SendIcon />
          Invite
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Select
          aria-label="Branch"
          defaultSelectedKey="main"
          className="min-w-0 flex-1"
        >
          <SelectTrigger className="w-full" />
          <SelectContent>
            <SelectItem id="main">main</SelectItem>
            <SelectItem id="dev">develop</SelectItem>
          </SelectContent>
        </Select>
        <Button>Deploy</Button>
      </div>
      <div className="flex items-center gap-2">
        <SearchField
          aria-label="Filter"
          placeholder="Filter members"
          className="min-w-0 flex-1"
        />
        <Button>Export</Button>
      </div>
    </div>
  )
}

export default function InputsBoard() {
  return (
    <Board id="inputs">
      <BoardSection
        member="input"
        title="Input"
        axes={[
          "inputStyle",
          "inputHover",
          "focusInputStyle",
          "focusInputColor",
          "roleControl",
          "inputMotion",
          "inputError",
        ]}
      >
        <InputStates />
      </BoardSection>
      <BoardSection
        member="input"
        title="Text fields"
        axes={["inputStyle", "inputHeight", "roleControl"]}
      >
        <TextFields />
      </BoardSection>
      <BoardSection
        member="field"
        title="Field"
        axes={["fieldLabel", "inputError"]}
      >
        <Fields />
      </BoardSection>
      <BoardSection
        member="number-field"
        title="Number field"
        axes={["numberLayout"]}
      >
        <NumberFields />
      </BoardSection>
      <BoardSection member="otp" title="OTP field" axes={["otpStyle"]}>
        <Codes />
      </BoardSection>
      <BoardSection
        member="select"
        title="Select"
        axes={["selectTrigger", "pickerCaret"]}
      >
        <Selects />
      </BoardSection>
      <BoardSection
        member="input"
        title="With a button"
        axes={["buttonStyle", "inputHeight"]}
      >
        <Pairs />
      </BoardSection>
    </Board>
  )
}
