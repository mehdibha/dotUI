# dotUI components API

Every chapter: import block, then usage. Generated from registry demos and docs.

# Buttons

## Button

```tsx
import { Button } from "@/components/ui/button"
```

```tsx
<Button>Button</Button>
```

## Button variants & sizes

`variant` is one of primary, secondary, quiet, warning, danger; `size` is xs, sm, md, lg.

```tsx
import { Button } from "@/components/ui/button"
```

```tsx
<Button variant="primary" size="sm">Primary</Button>
<Button variant="secondary" size="md">Secondary</Button>
<Button variant="quiet" size="lg">Quiet</Button>
<Button variant="warning">Warning</Button>
<Button variant="danger">Danger</Button>
```

## Button disabled

```tsx
import { Button } from "@/components/ui/button"
```

```tsx
<Button isDisabled>Button</Button>
```

## Button with prefix/suffix icon

Icons placed before or after the label; `data-icon-start` / `data-icon-end` mark their position.

```tsx
import { ArrowRightIcon, UploadIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
```

```tsx
<Button>
  <UploadIcon data-icon-start="" /> Upload
</Button>
<Button>
  Continue <ArrowRightIcon data-icon-end="" />
</Button>
```

## Icon Button

Icon-only buttons need `isIconOnly` and an `aria-label`; add `rounded-full` for a circular shape.

```tsx
import { UploadIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
```

```tsx
<Button size="sm" isIconOnly aria-label="Upload">
  <UploadIcon />
</Button>
<Button size="md" isIconOnly aria-label="Upload" className="rounded-full">
  <UploadIcon />
</Button>
```

## Button loading

`isPending` renders a centered Loader over the label; pair it with `onPress` for async work.

```tsx
import React from "react"

import { Button } from "@/components/ui/button"
```

```tsx
const [isPending, setPending] = React.useState(false)

<Button
  isPending={isPending}
  onPress={() => {
    setPending(true)
    setTimeout(() => setPending(false), 2000)
  }}
>
  Click me
</Button>
```

## Link Button

A button-styled anchor; accepts every Link prop (`href`, `target`, `rel`).

```tsx
import { LogInIcon } from "@/components/icons"
import { LinkButton } from "@/components/ui/button"
```

```tsx
<LinkButton href="/dashboard">Dashboard</LinkButton>
<LinkButton href="/login" variant="secondary">
  <LogInIcon />
  Login
</LinkButton>
```

## Toggle Button

```tsx
import { PinIcon } from "@/components/icons"
import { ToggleButton } from "@/components/ui/toggle-button"
```

```tsx
<ToggleButton isIconOnly aria-label="Toggle pin">
  <PinIcon className="rotate-45" />
</ToggleButton>
```

## Toggle Button with text and icon

```tsx
import { PinIcon } from "@/components/icons"
import { ToggleButton } from "@/components/ui/toggle-button"
```

```tsx
<ToggleButton>
  <PinIcon data-icon-start="" className="rotate-45" />
  Pin
</ToggleButton>
<ToggleButton>
  Pin
  <PinIcon data-icon-end="" className="rotate-45" />
</ToggleButton>
```

## Toggle Button variants & sizes

`variant` is primary, secondary or quiet; `size` is xs, sm, md, lg; `isDisabled` disables it.

```tsx
import { PinIcon } from "@/components/icons"
import { ToggleButton } from "@/components/ui/toggle-button"
```

```tsx
<ToggleButton variant="primary" size="sm">
  <PinIcon data-icon-start="" className="rotate-45" />
  Pin
</ToggleButton>
<ToggleButton variant="quiet" size="lg" isIconOnly aria-label="Toggle pin" className="rounded-full">
  <PinIcon className="rotate-45" />
</ToggleButton>
<ToggleButton isDisabled>
  <PinIcon data-icon-start="" className="rotate-45" />
  Pin
</ToggleButton>
```

## Toggle Button uncontrolled

```tsx
import { PinIcon } from "@/components/icons"
import { ToggleButton } from "@/components/ui/toggle-button"
```

```tsx
<ToggleButton isIconOnly aria-label="Toggle pin" defaultSelected>
  <PinIcon className="rotate-45" />
</ToggleButton>
```

## Toggle Button controlled

```tsx
import React from "react"

import { PinIcon } from "@/components/icons"
import { ToggleButton } from "@/components/ui/toggle-button"
```

```tsx
const [isSelected, setSelected] = React.useState(true)

<ToggleButton
  isIconOnly
  isSelected={isSelected}
  onChange={setSelected}
  aria-label="Toggle pin"
>
  <PinIcon className="rotate-45" />
</ToggleButton>
```

## Toggle Button favorite

A quiet icon toggle whose icon fills when selected.

```tsx
import React from "react"

import { HeartIcon } from "@/components/icons"
import { ToggleButton } from "@/components/ui/toggle-button"
```

```tsx
const [isFavorite, setFavorite] = React.useState(false)

<ToggleButton
  variant="quiet"
  isIconOnly
  isSelected={isFavorite}
  onChange={setFavorite}
  aria-label="Add to favorites"
>
  <HeartIcon className={isFavorite ? "fill-current text-danger" : undefined} />
</ToggleButton>
```

## Toggle Button toolbar (independent toggles)

Multiple independent quiet toggles sharing one array state, without a group.

```tsx
import React from "react"

import { BoldIcon, ItalicIcon, UnderlineIcon } from "@/components/icons"
import { ToggleButton } from "@/components/ui/toggle-button"
```

```tsx
const [formats, setFormats] = React.useState<string[]>(["bold"])
const toggle = (format: string) => (isSelected: boolean) =>
  setFormats((prev) =>
    isSelected ? [...prev, format] : prev.filter((f) => f !== format),
  )

<div className="flex w-fit items-center gap-1 rounded-lg border p-1">
  <ToggleButton variant="quiet" isIconOnly isSelected={formats.includes("bold")} onChange={toggle("bold")} aria-label="Bold">
    <BoldIcon />
  </ToggleButton>
  <ToggleButton variant="quiet" isIconOnly isSelected={formats.includes("italic")} onChange={toggle("italic")} aria-label="Italic">
    <ItalicIcon />
  </ToggleButton>
  <ToggleButton variant="quiet" isIconOnly isSelected={formats.includes("underline")} onChange={toggle("underline")} aria-label="Underline">
    <UnderlineIcon />
  </ToggleButton>
</div>
```

## Toggle Button view switcher (mutually exclusive toggles)

```tsx
import React from "react"

import { LayoutGridIcon, ListIcon } from "@/components/icons"
import { ToggleButton } from "@/components/ui/toggle-button"
```

```tsx
const [view, setView] = React.useState<"list" | "grid">("grid")

<div className="flex items-center gap-1 rounded-lg border p-1">
  <ToggleButton variant="quiet" isIconOnly isSelected={view === "list"} onChange={() => setView("list")} aria-label="List view">
    <ListIcon />
  </ToggleButton>
  <ToggleButton variant="quiet" isIconOnly isSelected={view === "grid"} onChange={() => setView("grid")} aria-label="Grid view">
    <LayoutGridIcon />
  </ToggleButton>
</div>
```

## Toggle Button Group

Each ToggleButton needs an `id`; the group defaults to single selection.

```tsx
import { BoldIcon, ItalicIcon, UnderlineIcon } from "@/components/icons"
import { ToggleButton } from "@/components/ui/toggle-button"
import { ToggleButtonGroup } from "@/components/ui/toggle-button-group"
```

```tsx
<ToggleButtonGroup aria-label="Text formatting">
  <ToggleButton id="bold" isIconOnly aria-label="Bold">
    <BoldIcon />
  </ToggleButton>
  <ToggleButton id="italic" isIconOnly aria-label="Italic">
    <ItalicIcon />
  </ToggleButton>
  <ToggleButton id="underline" isIconOnly aria-label="Underline">
    <UnderlineIcon />
  </ToggleButton>
</ToggleButtonGroup>
```

## Toggle Button Group with text

```tsx
import { ToggleButton } from "@/components/ui/toggle-button"
import { ToggleButtonGroup } from "@/components/ui/toggle-button-group"
```

```tsx
<ToggleButtonGroup aria-label="Text alignment" defaultSelectedKeys={["left"]}>
  <ToggleButton id="left">Left</ToggleButton>
  <ToggleButton id="center">Center</ToggleButton>
  <ToggleButton id="right">Right</ToggleButton>
</ToggleButtonGroup>
```

## Toggle Button Group multiple selection

```tsx
import { BoldIcon, ItalicIcon, UnderlineIcon } from "@/components/icons"
import { ToggleButton } from "@/components/ui/toggle-button"
import { ToggleButtonGroup } from "@/components/ui/toggle-button-group"
```

```tsx
<ToggleButtonGroup
  selectionMode="multiple"
  defaultSelectedKeys={["bold", "underline"]}
  aria-label="Text formatting"
>
  <ToggleButton id="bold" isIconOnly aria-label="Bold">
    <BoldIcon />
  </ToggleButton>
  <ToggleButton id="italic" isIconOnly aria-label="Italic">
    <ItalicIcon />
  </ToggleButton>
  <ToggleButton id="underline" isIconOnly aria-label="Underline">
    <UnderlineIcon />
  </ToggleButton>
</ToggleButtonGroup>
```

## Toggle Button Group controlled

`selectedKeys` is a Set of ids.

```tsx
import React from "react"
import type { Key } from "react-aria-components"

import { ToggleButton } from "@/components/ui/toggle-button"
import { ToggleButtonGroup } from "@/components/ui/toggle-button-group"
```

```tsx
const [selected, setSelected] = React.useState<Set<Key>>(new Set(["bold"]))

<ToggleButtonGroup
  selectionMode="multiple"
  selectedKeys={selected}
  onSelectionChange={setSelected}
  aria-label="Text formatting"
>
  <ToggleButton id="bold">Bold</ToggleButton>
  <ToggleButton id="italic">Italic</ToggleButton>
  <ToggleButton id="underline">Underline</ToggleButton>
</ToggleButtonGroup>
```

## Toggle Button Group variants & sizes

`variant`, `size` and `isIconOnly` set on the group are provided to every child ToggleButton.

```tsx
import { BoldIcon, ItalicIcon, UnderlineIcon } from "@/components/icons"
import { ToggleButton } from "@/components/ui/toggle-button"
import { ToggleButtonGroup } from "@/components/ui/toggle-button-group"
```

```tsx
<ToggleButtonGroup variant="primary" size="sm" aria-label="Text formatting">
  <ToggleButton id="bold" isIconOnly aria-label="Bold">
    <BoldIcon />
  </ToggleButton>
  <ToggleButton id="italic" isIconOnly aria-label="Italic">
    <ItalicIcon />
  </ToggleButton>
  <ToggleButton id="underline" isIconOnly aria-label="Underline">
    <UnderlineIcon />
  </ToggleButton>
</ToggleButtonGroup>
```

## Toggle Button Group vertical

```tsx
import { LayoutGridIcon, ListIcon, TableIcon } from "@/components/icons"
import { ToggleButton } from "@/components/ui/toggle-button"
import { ToggleButtonGroup } from "@/components/ui/toggle-button-group"
```

```tsx
<ToggleButtonGroup orientation="vertical" aria-label="View mode">
  <ToggleButton id="list" isIconOnly aria-label="List view">
    <ListIcon />
  </ToggleButton>
  <ToggleButton id="grid" isIconOnly aria-label="Grid view">
    <LayoutGridIcon />
  </ToggleButton>
  <ToggleButton id="table" isIconOnly aria-label="Table view">
    <TableIcon />
  </ToggleButton>
</ToggleButtonGroup>
```

## Segmented Control

Always single selection with `disallowEmptySelection`; an animated indicator slides between items.

```tsx
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/components/ui/segmented-control"
```

```tsx
<SegmentedControl defaultSelectedKeys={["week"]} aria-label="Date range">
  <SegmentedControlItem id="day">Day</SegmentedControlItem>
  <SegmentedControlItem id="week">Week</SegmentedControlItem>
  <SegmentedControlItem id="month">Month</SegmentedControlItem>
</SegmentedControl>
```

## Segmented Control with icons

```tsx
import { LayoutGridIcon, ListIcon, TableIcon } from "@/components/icons"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/components/ui/segmented-control"
```

```tsx
<SegmentedControl defaultSelectedKeys={["grid"]} aria-label="View">
  <SegmentedControlItem id="grid">
    <LayoutGridIcon />
    Grid
  </SegmentedControlItem>
  <SegmentedControlItem id="list">
    <ListIcon />
    List
  </SegmentedControlItem>
  <SegmentedControlItem id="table">
    <TableIcon />
    Table
  </SegmentedControlItem>
</SegmentedControl>
```

## Segmented Control controlled

```tsx
import React from "react"
import type { Key } from "react-aria-components"

import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/components/ui/segmented-control"
```

```tsx
const [selected, setSelected] = React.useState<Set<Key>>(new Set(["week"]))

<SegmentedControl
  aria-label="Date range"
  selectedKeys={selected}
  onSelectionChange={setSelected}
>
  <SegmentedControlItem id="day">Day</SegmentedControlItem>
  <SegmentedControlItem id="week">Week</SegmentedControlItem>
  <SegmentedControlItem id="month">Month</SegmentedControlItem>
</SegmentedControl>
```

## File Trigger

Wraps a Button; `onSelect` receives a FileList (or null).

```tsx
import React from "react"

import { UploadIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { FileTrigger } from "@/components/ui/file-trigger"
```

```tsx
const [file, setFile] = React.useState<string | null>(null)

<FileTrigger
  onSelect={(e) => {
    if (e) {
      const fileName = Array.from(e)[0]?.name
      if (fileName) setFile(fileName)
    }
  }}
>
  <Button>
    <UploadIcon /> Upload
  </Button>
</FileTrigger>
{file && <p>You selected {file}</p>}
```

## File Trigger multiple files

```tsx
import React from "react"

import { UploadIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { FileTrigger } from "@/components/ui/file-trigger"
```

```tsx
const [files, setFiles] = React.useState<string[] | null>(null)

<FileTrigger
  allowsMultiple
  onSelect={(e) => {
    if (e) setFiles(Array.from(e).map((file) => file.name))
  }}
>
  <Button>
    <UploadIcon /> Upload
  </Button>
</FileTrigger>
{files && <p>You selected {files.join(", ")}</p>}
```

## File Trigger with accepted file types

```tsx
import { UploadIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { FileTrigger } from "@/components/ui/file-trigger"
```

```tsx
<FileTrigger acceptedFileTypes={["image/*"]}>
  <Button>
    <UploadIcon /> Upload image
  </Button>
</FileTrigger>
```

## File Trigger directory selection

```tsx
import React from "react"

import { UploadIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { FileTrigger } from "@/components/ui/file-trigger"
```

```tsx
const [files, setFiles] = React.useState<string[] | null>(null)

<FileTrigger
  acceptDirectory
  onSelect={(e) => {
    if (e) setFiles(Array.from(e).map((file) => file.name))
  }}
>
  <Button>
    <UploadIcon /> Upload a directory
  </Button>
</FileTrigger>
{files && (
  <ul>
    {files.map((file) => (
      <li key={file}>{file}</li>
    ))}
  </ul>
)}
```

## File Trigger media capture

`defaultCamera` opens the device camera on mobile ("user" or "environment").

```tsx
import { CameraIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { FileTrigger } from "@/components/ui/file-trigger"
```

```tsx
<FileTrigger defaultCamera="environment">
  <Button>
    <CameraIcon /> Take a picture
  </Button>
</FileTrigger>
```

## File Trigger profile picture (with Avatar)

```tsx
import React from "react"

import { UploadIcon } from "@/components/icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { FileTrigger } from "@/components/ui/file-trigger"
```

```tsx
const [src, setSrc] = React.useState<string | null>(null)

<Avatar size="lg">
  {src && <AvatarImage src={src} alt="Profile picture" />}
  <AvatarFallback>M</AvatarFallback>
</Avatar>
<FileTrigger
  acceptedFileTypes={["image/*"]}
  onSelect={(e) => {
    const file = e && Array.from(e)[0]
    if (file) setSrc(URL.createObjectURL(file))
  }}
>
  <Button variant="secondary" size="sm">
    <UploadIcon /> {src ? "Change photo" : "Upload photo"}
  </Button>
</FileTrigger>
```

## File Trigger document list (upload + remove)

```tsx
import React from "react"

import { FileTextIcon, TrashIcon, UploadIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { FileTrigger } from "@/components/ui/file-trigger"
```

```tsx
const [docs, setDocs] = React.useState<string[]>([])

<FileTrigger
  acceptedFileTypes={["application/pdf"]}
  allowsMultiple
  onSelect={(e) => {
    if (e) setDocs((prev) => [...prev, ...Array.from(e).map((f) => f.name)])
  }}
>
  <Button variant="secondary" className="w-full">
    <UploadIcon /> Upload documents
  </Button>
</FileTrigger>
<ul className="flex flex-col gap-1">
  {docs.map((name, i) => (
    <li key={`${name}-${i}`} className="flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-sm">
      <FileTextIcon className="size-4 shrink-0 text-fg-muted" />
      <span className="flex-1 truncate">{name}</span>
      <Button
        variant="quiet"
        size="xs"
        isIconOnly
        aria-label={`Remove ${name}`}
        onPress={() => setDocs((prev) => prev.filter((_, idx) => idx !== i))}
      >
        <TrashIcon />
      </Button>
    </li>
  ))}
</ul>
```

## File Trigger image gallery (dashed add tile)

```tsx
import React from "react"

import { ImageIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { FileTrigger } from "@/components/ui/file-trigger"
```

```tsx
const [images, setImages] = React.useState<string[]>([])

<div className="grid grid-cols-3 gap-2">
  {images.map((src, i) => (
    <img key={`${src}-${i}`} src={src} alt={`Upload ${i + 1}`} className="aspect-square w-full rounded-md border object-cover" />
  ))}
  <FileTrigger
    acceptedFileTypes={["image/*"]}
    allowsMultiple
    onSelect={(e) => {
      if (e) setImages((prev) => [...prev, ...Array.from(e).map((f) => URL.createObjectURL(f))])
    }}
  >
    <Button
      variant="quiet"
      aria-label="Add images"
      className="flex aspect-square size-full flex-col gap-1 border border-dashed text-fg-muted"
    >
      <ImageIcon className="size-5" />
    </Button>
  </FileTrigger>
</div>
```

## Link

```tsx
import { Link } from "@/components/ui/link"
```

```tsx
<Link href="/docs">Documentation</Link>
```

## Link external

```tsx
import { Link } from "@/components/ui/link"
```

```tsx
<Link href="https://dotui.org" target="_blank" rel="noreferrer">
  dotUI
</Link>
```

## Link in text

```tsx
import { Link } from "@/components/ui/link"
```

```tsx
<p className="max-w-xs text-sm text-fg-muted">
  Built on <Link href="#">React Aria Components</Link> for accessibility and
  styled with <Link href="#">Tailwind CSS</Link>. Read the{" "}
  <Link href="#">getting started guide</Link> to learn more.
</p>
```

## Link with icon

```tsx
import { ArrowRightIcon, BookOpenIcon, ExternalLinkIcon } from "@/components/icons"
import { Link } from "@/components/ui/link"
```

```tsx
<Link href="#">
  <BookOpenIcon className="size-4" />
  Read the docs
</Link>
<Link href="#">
  Read the changelog
  <ArrowRightIcon className="size-4" />
</Link>
<Link href="#" variant="quiet">
  Open in v0
  <ExternalLinkIcon className="size-3.5" />
</Link>
```

## Link quiet (footer navigation)

`variant="quiet"` drops the underline for navigation lists.

```tsx
import { Link } from "@/components/ui/link"
```

```tsx
<div className="flex flex-col gap-2">
  <span className="text-xs font-medium text-fg-muted">Product</span>
  <Link href="/features" variant="quiet" className="text-sm">Features</Link>
  <Link href="/pricing" variant="quiet" className="text-sm">Pricing</Link>
  <Link href="/changelog" variant="quiet" className="text-sm">Changelog</Link>
</div>
```

## Kbd

```tsx
import { Kbd } from "@/components/ui/kbd"
```

```tsx
<Kbd>Ctrl</Kbd>
<Kbd>⌘K</Kbd>
<Kbd>Ctrl + B</Kbd>
```

## Kbd modifier keys

Separate Kbd elements for each key of a shortcut.

```tsx
import { Kbd } from "@/components/ui/kbd"
```

```tsx
<div className="flex items-center gap-2">
  <Kbd>⌘</Kbd>
  <Kbd>C</Kbd>
</div>
```

## Kbd arrow keys

```tsx
import { Kbd } from "@/components/ui/kbd"
```

```tsx
<Kbd>↑</Kbd>
<Kbd>↓</Kbd>
<Kbd>←</Kbd>
<Kbd>→</Kbd>
```

## Kbd Group

```tsx
import { Kbd, KbdGroup } from "@/components/ui/kbd"
```

```tsx
<KbdGroup>
  <Kbd>Ctrl</Kbd>
  <Kbd>Shift</Kbd>
  <Kbd>P</Kbd>
</KbdGroup>
```

## Kbd with icons

```tsx
import { ArrowLeftIcon, ArrowRightIcon, CircleDashedIcon } from "@/components/icons"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
```

```tsx
<KbdGroup>
  <Kbd>
    <CircleDashedIcon />
  </Kbd>
  <Kbd>
    <ArrowLeftIcon />
  </Kbd>
  <Kbd>
    <ArrowRightIcon />
  </Kbd>
</KbdGroup>
```

## Kbd with icons and text

```tsx
import { ArrowLeftIcon, CircleDashedIcon } from "@/components/icons"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
```

```tsx
<KbdGroup>
  <Kbd>
    <ArrowLeftIcon />
    Left
  </Kbd>
  <Kbd>
    <CircleDashedIcon />
    Voice Enabled
  </Kbd>
</KbdGroup>
```

## Kbd with samp

```tsx
import { Kbd } from "@/components/ui/kbd"
```

```tsx
<Kbd>
  <samp>File</samp>
</Kbd>
```

## Kbd in InputGroup

```tsx
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { Kbd } from "@/components/ui/kbd"
import { TextField } from "@/components/ui/text-field"
```

```tsx
<TextField aria-label="Search">
  <InputGroup>
    <Input />
    <InputGroupAddon>
      <Kbd>Space</Kbd>
    </InputGroupAddon>
  </InputGroup>
</TextField>
```

## Kbd in Tooltip

```tsx
import { SaveIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { Tooltip, TooltipContent } from "@/components/ui/tooltip"
```

```tsx
<Tooltip>
  <Button isIconOnly size="sm" aria-label="Save">
    <SaveIcon />
  </Button>
  <TooltipContent>
    <div className="flex items-center gap-2">
      Save Changes <Kbd>S</Kbd>
    </div>
  </TooltipContent>
</Tooltip>
```

# Text inputs & forms

## Field (standalone control)

Wrap a control that has no field wrapper of its own (like Switch) so the label and description get wired up.

```tsx
import { Description, Field, Label } from "@/components/ui/field"
import { Switch, SwitchControl } from "@/components/ui/switch"
```

```tsx
<Field>
  <Label>Notifications</Label>
  <Switch>
    <SwitchControl />
  </Switch>
  <Description>Send me product updates.</Description>
</Field>
```

## Field horizontal orientation

```tsx
import { Description, Field, FieldContent, Label } from "@/components/ui/field"
import { Switch, SwitchControl } from "@/components/ui/switch"
```

```tsx
<Field orientation="horizontal">
  <FieldContent>
    <Label>Airplane Mode</Label>
    <Description>Disable all connections.</Description>
  </FieldContent>
  <Switch aria-label="Airplane Mode">
    <SwitchControl />
  </Switch>
</Field>
```

## Fieldset with Legend and FieldGroup

```tsx
import {
  Description,
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  Fieldset,
  Label,
  Legend,
} from "@/components/ui/field"
```

```tsx
<Fieldset>
  <Legend>Shipping</Legend>
  <FieldGroup>
    <Field>
      <FieldContent>
        <Label>Address</Label>
        <Description>Where we deliver.</Description>
      </FieldContent>
      <FieldError>Enter an address.</FieldError>
    </Field>
  </FieldGroup>
</Fieldset>
```

## FieldGroup login form

`FieldGroup` spaces stacked fields inside a form.

```tsx
import { Button } from "@/components/ui/button"
import { Description, FieldError, FieldGroup, Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"
```

```tsx
<form>
  <FieldGroup>
    <TextField type="email" defaultValue="ada@example" isInvalid>
      <Label>Email</Label>
      <Input placeholder="you@example.com" />
      <FieldError>Enter a valid email address.</FieldError>
    </TextField>
    <TextField type="password" isRequired>
      <Label>Password</Label>
      <Input placeholder="••••••••" />
      <Description>At least 8 characters.</Description>
    </TextField>
    <Button type="submit" variant="primary" className="w-full">
      Sign in
    </Button>
  </FieldGroup>
</form>
```

## FieldContent inside a Checkbox

```tsx
import { Checkbox, CheckboxControl } from "@/components/ui/checkbox"
import { Description, FieldContent, Label } from "@/components/ui/field"
```

```tsx
<Checkbox>
  <CheckboxControl />
  <FieldContent>
    <Label>Email me product updates</Label>
    <Description>You can unsubscribe anytime.</Description>
  </FieldContent>
</Checkbox>
```

## FieldGroup settings form with Select

```tsx
import { Button } from "@/components/ui/button"
import { Description, FieldGroup, Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { TextField } from "@/components/ui/text-field"
```

```tsx
<form>
  <FieldGroup>
    <TextField defaultValue="Ada Lovelace">
      <Label>Display name</Label>
      <Input placeholder="Your name" />
    </TextField>
    <TextField type="email" defaultValue="ada@example.com">
      <Label>Email</Label>
      <Input placeholder="you@example.com" />
      <Description>Used for sign-in and notifications.</Description>
    </TextField>
    <Select defaultSelectedKey="utc" placeholder="Select timezone">
      <Label>Timezone</Label>
      <SelectTrigger />
      <SelectContent>
        <SelectItem id="utc">UTC</SelectItem>
        <SelectItem id="est">Eastern Time</SelectItem>
        <SelectItem id="pst">Pacific Time</SelectItem>
      </SelectContent>
    </Select>
    <Button type="submit" variant="primary" className="w-full">
      Save changes
    </Button>
  </FieldGroup>
</form>
```

## Form (react-aria)

`Form` is not a registry item yet; demos use the React Aria primitive directly.

```tsx
import { Form } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Description, Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"
```

```tsx
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  const data = Object.fromEntries(new FormData(e.currentTarget))
}

<Form onSubmit={handleSubmit} className="space-y-4">
  <TextField isRequired>
    <Label>Name</Label>
    <Input name="name" minLength={2} placeholder="Name" />
    <Description>Please enter your full name.</Description>
  </TextField>
  <Button variant="primary" type="submit">
    Submit
  </Button>
</Form>
```

## Form with ARIA validation and server errors

```tsx
import { Form } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"
```

```tsx
<Form
  validationBehavior="aria"
  validationErrors={{ email: "Email already taken" }}
>
  <TextField name="email" isRequired>
    <Label>Email</Label>
    <Input type="email" />
  </TextField>
  <Button type="submit" variant="primary">
    Submit
  </Button>
</Form>
```

## Form registration with mixed fields

Native validation across TextField, RadioGroup, DatePicker, Combobox, Select and Checkbox.

```tsx
import { Form } from "react-aria-components"

import { ChevronDownIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Checkbox, CheckboxControl } from "@/components/ui/checkbox"
import { Combobox } from "@/components/ui/combobox"
import { DatePicker } from "@/components/ui/date-picker"
import { FieldGroup, Label } from "@/components/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { ListBox, ListBoxItem } from "@/components/ui/list-box"
import { Popover } from "@/components/ui/popover"
import { Radio, RadioControl, RadioGroup } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { TextField } from "@/components/ui/text-field"
```

```tsx
<Form onSubmit={handleSubmit} className="space-y-4">
  <TextField isRequired>
    <Label>Name</Label>
    <Input name="name" minLength={2} placeholder="Name" />
  </TextField>
  <RadioGroup name="gender" isRequired orientation="horizontal">
    <Label>Gender</Label>
    <FieldGroup>
      <Radio value="male">
        <RadioControl />
        <Label>Male</Label>
      </Radio>
      <Radio value="female">
        <RadioControl />
        <Label>Female</Label>
      </Radio>
    </FieldGroup>
  </RadioGroup>
  <DatePicker name="birth-date" isRequired className="w-full">
    <Label>Birth Date</Label>
    <Input placeholder="Birth Date" />
  </DatePicker>
  <Combobox name="language" isRequired>
    <Label>Preferred language</Label>
    <InputGroup>
      <Input />
      <InputGroupAddon>
        <Button variant="quiet" isIconOnly>
          <ChevronDownIcon />
        </Button>
      </InputGroupAddon>
    </InputGroup>
    <Popover>
      <ListBox items={languages}>
        {(item) => <ListBoxItem id={item.value}>{item.label}</ListBoxItem>}
      </ListBox>
    </Popover>
  </Combobox>
  <Select name="referral" isRequired>
    <Label>How did you hear about us?</Label>
    <SelectTrigger variant="secondary" className="w-full" />
    <SelectContent>
      <SelectItem id="linkedin">LinkedIn</SelectItem>
      <SelectItem id="x">X</SelectItem>
    </SelectContent>
  </Select>
  <Checkbox isRequired>
    <CheckboxControl />
    <Label>I agree to the terms and conditions</Label>
  </Checkbox>
  <Button type="submit">Register</Button>
</Form>
```

## Input

Standalone input; wrap it in `TextField` when it needs a label or validation.

```tsx
import { Input } from "@/components/ui/input"
```

```tsx
<Input placeholder="Enter text..." />
<Input disabled placeholder="Disabled input" />
<Input readOnly defaultValue="Read only" />
```

## Input sizes

```tsx
import { Input } from "@/components/ui/input"
```

```tsx
<Input size="sm" placeholder="Small" />
<Input size="md" placeholder="Medium" />
<Input size="lg" placeholder="Large" />
```

## TextArea (standalone)

Auto-resizes to its content; no prop to toggle it.

```tsx
import { TextArea } from "@/components/ui/input"
```

```tsx
<TextArea placeholder="Write something..." />
```

## InputGroup with text addon

```tsx
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
```

```tsx
<InputGroup>
  <InputGroupAddon>https://</InputGroupAddon>
  <Input placeholder="example.com" />
</InputGroup>
```

## InputGroup with icon addons

Addons before and/or after the control; an addon can hold several icons.

```tsx
import { CopyIcon, MicIcon, RadioIcon, SearchIcon, StarIcon } from "@/components/icons"
import { Label } from "@/components/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"
```

```tsx
<TextField>
  <Label>Search</Label>
  <InputGroup>
    <InputGroupAddon>
      <SearchIcon />
    </InputGroupAddon>
    <Input />
  </InputGroup>
</TextField>
<TextField>
  <Label>Channel</Label>
  <InputGroup>
    <InputGroupAddon>
      <MicIcon />
    </InputGroupAddon>
    <Input />
    <InputGroupAddon>
      <RadioIcon />
    </InputGroupAddon>
  </InputGroup>
</TextField>
<TextField>
  <Label>Favorite</Label>
  <InputGroup>
    <Input />
    <InputGroupAddon>
      <StarIcon />
      <CopyIcon />
    </InputGroupAddon>
  </InputGroup>
</TextField>
```

## InputGroup with Label inside an addon

```tsx
import { Label } from "@/components/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"
```

```tsx
<TextField>
  <InputGroup>
    <InputGroupAddon>
      <Label>Label</Label>
    </InputGroupAddon>
    <Input />
  </InputGroup>
</TextField>
<TextField aria-label="Optional">
  <InputGroup>
    <Input />
    <InputGroupAddon>(optional)</InputGroupAddon>
  </InputGroup>
</TextField>
```

## InputGroup with Button addon

```tsx
import { CopyIcon, TrashIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"
```

```tsx
<TextField aria-label="With button">
  <InputGroup>
    <InputGroupAddon>
      <Button variant="secondary">Button</Button>
    </InputGroupAddon>
    <Input />
  </InputGroup>
</TextField>
<TextField aria-label="With copy button">
  <InputGroup>
    <Input />
    <InputGroupAddon>
      <Button isIconOnly>
        <CopyIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
</TextField>
<TextField aria-label="With delete button">
  <InputGroup>
    <Input />
    <InputGroupAddon>
      <Button isIconOnly>
        <TrashIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
</TextField>
```

## InputGroup with Kbd

```tsx
import { SparklesIcon } from "@/components/icons"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { TextField } from "@/components/ui/text-field"
```

```tsx
<TextField aria-label="Search">
  <InputGroup>
    <Input />
    <InputGroupAddon>
      <Kbd>⌘K</Kbd>
    </InputGroupAddon>
  </InputGroup>
</TextField>
<TextField aria-label="Search for Apps">
  <InputGroup>
    <Input placeholder="Search for Apps..." />
    <InputGroupAddon className="gap-2">
      <span>Ask AI</span>
      <Kbd>Tab</Kbd>
    </InputGroupAddon>
  </InputGroup>
</TextField>
<TextField aria-label="Type to search">
  <InputGroup>
    <InputGroupAddon>
      <SparklesIcon />
    </InputGroupAddon>
    <Input placeholder="Type to search..." />
    <InputGroupAddon>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>C</Kbd>
      </KbdGroup>
    </InputGroupAddon>
  </InputGroup>
</TextField>
```

## InputGroup with status addon (Loader, result count, check)

```tsx
import { CheckIcon, SearchIcon } from "@/components/icons"
import { Description, Label } from "@/components/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { Loader } from "@/components/ui/loader"
import { TextField } from "@/components/ui/text-field"
```

```tsx
<TextField defaultValue="shadcn">
  <Label>Username</Label>
  <InputGroup>
    <Input />
    <InputGroupAddon>
      <div className="flex size-4 items-center justify-center rounded-full bg-green-500">
        <CheckIcon className="size-3 text-white" />
      </div>
    </InputGroupAddon>
  </InputGroup>
  <Description className="text-green-700">This username is available.</Description>
</TextField>
<TextField aria-label="Search documentation">
  <InputGroup>
    <InputGroupAddon>
      <SearchIcon />
    </InputGroupAddon>
    <Input placeholder="Search documentation..." />
    <InputGroupAddon>
      <span>12 results</span>
    </InputGroupAddon>
  </InputGroup>
</TextField>
<TextField isDisabled defaultValue="shadcn">
  <Label>Loading</Label>
  <InputGroup>
    <Input />
    <InputGroupAddon>
      <Loader />
    </InputGroupAddon>
  </InputGroup>
</TextField>
```

## InputGroup sizes

Set `size` on the group; it scales the control and addons together.

```tsx
import { SearchIcon } from "@/components/icons"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"
```

```tsx
<TextField aria-label="Size sm">
  <InputGroup size="sm">
    <InputGroupAddon>
      <SearchIcon />
    </InputGroupAddon>
    <Input />
  </InputGroup>
</TextField>
<TextField aria-label="Size md">
  <InputGroup size="md">
    <InputGroupAddon>
      <SearchIcon />
    </InputGroupAddon>
    <Input />
  </InputGroup>
</TextField>
<TextField aria-label="Size lg">
  <InputGroup size="lg">
    <InputGroupAddon>
      <SearchIcon />
    </InputGroupAddon>
    <Input />
  </InputGroup>
</TextField>
```

## InputGroup states (disabled, invalid, read-only)

State comes from the wrapping `TextField`, not the group.

```tsx
import { Label } from "@/components/ui/field"
import { Input, InputGroup } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"
```

```tsx
<TextField isDisabled>
  <Label>Disabled</Label>
  <InputGroup>
    <Input placeholder="disabled field" />
  </InputGroup>
</TextField>
<TextField isInvalid defaultValue="invalid field">
  <Label>Invalid</Label>
  <InputGroup>
    <Input />
  </InputGroup>
</TextField>
<TextField isReadOnly defaultValue="read only field">
  <Label>Read Only</Label>
  <InputGroup>
    <Input />
  </InputGroup>
</TextField>
```

## InputGroup with TextArea (block addons)

With a `TextArea`, addons stack above (block-start) or below (block-end) the control.

```tsx
import { ArrowUpIcon, InfoIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, TextArea } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"
```

```tsx
<TextField>
  <Label>Addon (block-start)</Label>
  <InputGroup>
    <InputGroupAddon>
      <span>Ask, Search or Chat...</span>
      <InfoIcon className="ml-auto" />
    </InputGroupAddon>
    <TextArea />
  </InputGroup>
</TextField>
<TextField>
  <Label>Addon (block-end)</Label>
  <InputGroup>
    <TextArea placeholder="Enter your text here..." />
    <InputGroupAddon>
      <span>0/280 characters</span>
      <Button variant="primary" isIconOnly size="xs" className="ml-auto rounded-full">
        <ArrowUpIcon />
        <span className="sr-only">Send</span>
      </Button>
    </InputGroupAddon>
  </InputGroup>
</TextField>
```

## InputGroup comment composer

```tsx
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, TextArea } from "@/components/ui/input"
```

```tsx
<InputGroup>
  <TextArea placeholder="Write a comment..." />
  <InputGroupAddon>
    <Button variant="quiet" size="xs" className="ml-auto">
      Cancel
    </Button>
    <Button size="sm" variant="primary">
      Comment
    </Button>
  </InputGroupAddon>
</InputGroup>
```

## InputGroup code editor

Two block addons around a TextArea act as header and footer.

```tsx
import { CodeIcon, CopyIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, TextArea } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"
```

```tsx
<TextField>
  <Label>Code Editor</Label>
  <InputGroup>
    <InputGroupAddon className="border-b">
      <CodeIcon />
      <span>script.js</span>
      <Button variant="quiet" isIconOnly size="xs" className="ml-auto">
        <CopyIcon />
      </Button>
    </InputGroupAddon>
    <TextArea placeholder="console.log('Hello, world!');" className="min-h-[240px]" />
    <InputGroupAddon className="border-t">
      <span>Line 1, Column 1</span>
      <span className="ml-auto">JavaScript</span>
    </InputGroupAddon>
  </InputGroup>
</TextField>
```

## InputGroup with Tooltip addon

```tsx
import { InfoIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"
import { Tooltip, TooltipContent } from "@/components/ui/tooltip"
```

```tsx
<TextField>
  <Label>Tooltip</Label>
  <InputGroup>
    <Input />
    <InputGroupAddon>
      <Tooltip>
        <Button variant="quiet" isIconOnly size="sm">
          <InfoIcon />
        </Button>
        <TooltipContent>This is content in a tooltip.</TooltipContent>
      </Tooltip>
    </InputGroupAddon>
  </InputGroup>
</TextField>
```

## InputGroup with Menu addon

```tsx
import { ChevronDownIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { Menu, MenuContent, MenuItem } from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
import { TextField } from "@/components/ui/text-field"
```

```tsx
const [country, setCountry] = useState("+1")

<TextField>
  <Label>Phone</Label>
  <InputGroup>
    <InputGroupAddon>
      <Menu>
        <Button variant="quiet" size="sm">
          {country}
          <ChevronDownIcon />
        </Button>
        <Popover>
          <MenuContent>
            <MenuItem onAction={() => setCountry("+1")}>+1</MenuItem>
            <MenuItem onAction={() => setCountry("+44")}>+44</MenuItem>
            <MenuItem onAction={() => setCountry("+46")}>+46</MenuItem>
          </MenuContent>
        </Popover>
      </Menu>
    </InputGroupAddon>
    <Input />
  </InputGroup>
</TextField>
```

## InputGroup with Popover (Dialog) addon

```tsx
import { InfoIcon, StarIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { Popover } from "@/components/ui/popover"
import { TextField } from "@/components/ui/text-field"
```

```tsx
<TextField>
  <Label>Website</Label>
  <InputGroup>
    <InputGroupAddon>
      <Dialog>
        <Button variant="quiet" isIconOnly size="sm">
          <InfoIcon />
        </Button>
        <Popover>
          <DialogContent className="w-64 space-y-1">
            <DialogTitle>Your connection is not secure.</DialogTitle>
            <p className="text-sm text-fg-muted">
              You should not enter any sensitive information on this site.
            </p>
          </DialogContent>
        </Popover>
      </Dialog>
      <span className="text-fg-muted">https://</span>
    </InputGroupAddon>
    <Input />
    <InputGroupAddon>
      <Button variant="quiet" isIconOnly size="sm">
        <StarIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
</TextField>
```

## InputGroup with DateInput

```tsx
import { DateField } from "@/components/ui/date-field"
import { DateInput, InputGroup } from "@/components/ui/input"
```

```tsx
<DateField aria-label="Date">
  <DateInput />
</DateField>
<DateField aria-label="Date">
  <InputGroup>
    <DateInput />
  </InputGroup>
</DateField>
```

## InputGroup search bar with clear button

```tsx
import { SearchIcon, XIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"
```

```tsx
const [value, setValue] = useState("")

<TextField aria-label="Search members" value={value} onChange={setValue}>
  <InputGroup>
    <InputGroupAddon>
      <SearchIcon />
    </InputGroupAddon>
    <Input placeholder="Search members..." />
    {value && (
      <InputGroupAddon>
        <Button
          variant="quiet"
          isIconOnly
          aria-label="Clear search"
          onPress={() => setValue("")}
        >
          <XIcon />
        </Button>
      </InputGroupAddon>
    )}
  </InputGroup>
</TextField>
```

## InputGroup form in a Card

```tsx
import { ExternalLinkIcon, MailIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/field"
import { Input, InputGroup, InputGroupAddon, TextArea } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"
```

```tsx
<Card>
  <CardHeader>
    <CardTitle>Card with Input Group</CardTitle>
    <CardDescription>This is a card with an input group.</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    <TextField>
      <Label>Email Address</Label>
      <InputGroup>
        <Input type="email" placeholder="you@example.com" />
        <InputGroupAddon>
          <MailIcon />
        </InputGroupAddon>
      </InputGroup>
    </TextField>
    <TextField>
      <Label>Website URL</Label>
      <InputGroup>
        <InputGroupAddon>
          <span>https://</span>
        </InputGroupAddon>
        <Input placeholder="example.com" />
        <InputGroupAddon>
          <ExternalLinkIcon />
        </InputGroupAddon>
      </InputGroup>
    </TextField>
    <TextField>
      <Label>Feedback &amp; Comments</Label>
      <InputGroup>
        <TextArea placeholder="Share your thoughts..." className="min-h-[100px]" />
        <InputGroupAddon>
          <span>0/500 characters</span>
        </InputGroupAddon>
      </InputGroup>
    </TextField>
  </CardContent>
  <CardFooter className="justify-end gap-2">
    <Button>Cancel</Button>
    <Button variant="primary">Submit</Button>
  </CardFooter>
</Card>
```

## TextField

Use `aria-label` when there is no visible `Label`.

```tsx
import { Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"
```

```tsx
<TextField>
  <Label>Email</Label>
  <Input placeholder="hello@example.com" />
</TextField>
<TextField aria-label="Email">
  <Input placeholder="hello@example.com" />
</TextField>
```

## TextField with description

```tsx
import { Description, Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"
```

```tsx
<TextField>
  <Label>Email</Label>
  <Input placeholder="hello@example.com" />
  <Description>Enter your email.</Description>
</TextField>
```

## TextField with error message

```tsx
import { FieldError, Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"
```

```tsx
<TextField defaultValue="hello@example.com" isInvalid>
  <Label>Email</Label>
  <Input />
  <FieldError>Enter a valid email address.</FieldError>
</TextField>
```

## TextField validation (isRequired + validate)

Native validation by default; `validationBehavior="aria"` defers to your own logic. An empty `FieldError` renders the computed message.

```tsx
import { FieldError, Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"
```

```tsx
<TextField
  isRequired
  validate={(value) => (value.includes("@") ? null : "Enter a valid email")}
>
  <Label>Email</Label>
  <Input />
  <FieldError />
</TextField>
```

## TextField controlled

`defaultValue` for uncontrolled state; `value` + `onChange` (receives the string) to control it.

```tsx
import { Input } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"
```

```tsx
const [inputValue, setInputValue] = React.useState("Hello world!")

<TextField aria-label="Controlled text field" value={inputValue} onChange={setInputValue}>
  <Input />
</TextField>
<TextField aria-label="Uncontrolled" defaultValue="Ada">
  <Input />
</TextField>
```

## TextField disabled and read-only

```tsx
import { Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"
```

```tsx
<TextField aria-label="Email" value="hello@example.com" isDisabled>
  <Input />
</TextField>
<TextField isReadOnly defaultValue="hello@example.com">
  <Label>Email</Label>
  <Input />
</TextField>
```

## TextField sizes

Size lives on the `Input`, not the field.

```tsx
import { Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"
```

```tsx
<TextField>
  <Label>Small</Label>
  <Input size="sm" />
</TextField>
<TextField>
  <Label>Medium</Label>
  <Input size="md" />
</TextField>
<TextField>
  <Label>Large</Label>
  <Input size="lg" />
</TextField>
```

## TextField with prefix and suffix

```tsx
import { Label } from "@/components/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"
```

```tsx
<TextField>
  <Label>Website</Label>
  <InputGroup>
    <InputGroupAddon>https://</InputGroupAddon>
    <Input />
  </InputGroup>
</TextField>
<TextField>
  <Label>Email</Label>
  <InputGroup>
    <Input />
    <InputGroupAddon>@example.com</InputGroupAddon>
  </InputGroup>
</TextField>
```

## TextField with clear button

Keeps a ref on the `Input` to refocus after clearing.

```tsx
import { XCircleIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"
import { Tooltip, TooltipContent } from "@/components/ui/tooltip"
```

```tsx
const [inputValue, setInputValue] = React.useState("Hello world!")
const inputRef = React.useRef<HTMLInputElement>(null)

<TextField aria-label="Textfield with clear input" value={inputValue} onChange={setInputValue}>
  <InputGroup>
    <Input ref={inputRef} />
    <InputGroupAddon>
      <Tooltip>
        <Button
          variant="quiet"
          isIconOnly
          onPress={() => {
            setInputValue("")
            inputRef.current?.focus()
          }}
        >
          <XCircleIcon />
        </Button>
        <TooltipContent placement="bottom">
          <p>Clear input</p>
        </TooltipContent>
      </Tooltip>
    </InputGroupAddon>
  </InputGroup>
</TextField>
```

## TextField login form (type + autoComplete)

`type`, `autoComplete` and `name` go on the `TextField`, not the `Input`.

```tsx
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"
```

```tsx
<form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
  <TextField type="email" autoComplete="email" isRequired>
    <Label>Email</Label>
    <Input placeholder="you@example.com" />
  </TextField>
  <TextField type="password" autoComplete="current-password" isRequired>
    <Label>Password</Label>
    <Input placeholder="••••••••" />
  </TextField>
  <Button type="submit" className="w-full">
    Sign in
  </Button>
</form>
```

## TextField newsletter signup

```tsx
import { Button } from "@/components/ui/button"
import { Description, Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"
```

```tsx
<form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
  <TextField type="email" autoComplete="email" isRequired>
    <Label>Subscribe to our newsletter</Label>
    <Input placeholder="you@example.com" />
    <Description>Get product updates. No spam, unsubscribe anytime.</Description>
  </TextField>
  <Button type="submit" className="w-full">
    Subscribe
  </Button>
</form>
```

## TextArea in a TextField

```tsx
import { Description, Label } from "@/components/ui/field"
import { TextArea } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"
```

```tsx
<TextField>
  <Label>Description</Label>
  <TextArea placeholder="Type your message here" />
  <Description>Type your description</Description>
</TextField>
```

## TextArea with error message

```tsx
import { FieldError, Label } from "@/components/ui/field"
import { TextArea } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"
```

```tsx
<TextField isInvalid>
  <Label>Comment</Label>
  <TextArea />
  <FieldError>You have exceeded the comment limit for one hour.</FieldError>
</TextField>
```

## TextArea controlled

```tsx
import { Label } from "@/components/ui/field"
import { TextArea } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"
```

```tsx
const [inputValue, setInputValue] = React.useState("Roses are red, violets are blue.")

<TextField value={inputValue} onChange={setInputValue}>
  <Label>Essay</Label>
  <TextArea />
</TextField>
```

## TextArea with character counter

Controlled value drives `isInvalid` and swaps `Description` for `FieldError`.

```tsx
import { Button } from "@/components/ui/button"
import { Description, FieldError, Label } from "@/components/ui/field"
import { TextArea } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"
```

```tsx
const MAX_LENGTH = 240
const [feedback, setFeedback] = useState("")
const isTooLong = feedback.length > MAX_LENGTH

<form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
  <TextField value={feedback} onChange={setFeedback} isInvalid={isTooLong}>
    <div className="flex items-center justify-between">
      <Label>Your feedback</Label>
      <span className="text-xs text-fg-muted tabular-nums">
        {feedback.length}/{MAX_LENGTH}
      </span>
    </div>
    <TextArea placeholder="Tell us what you think…" rows={4} />
    {isTooLong ? (
      <FieldError>Please keep it under {MAX_LENGTH} characters.</FieldError>
    ) : (
      <Description>Share what we could improve.</Description>
    )}
  </TextField>
  <Button type="submit" isDisabled={isTooLong || feedback.length === 0}>
    Send feedback
  </Button>
</form>
```

## TextArea validate on submit

Error only shows after the first submit attempt.

```tsx
import { Button } from "@/components/ui/button"
import { Description, FieldError, Label } from "@/components/ui/field"
import { TextArea } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"
```

```tsx
const MIN_LENGTH = 20
const [description, setDescription] = useState("")
const [submitted, setSubmitted] = useState(false)
const isTooShort = description.length < MIN_LENGTH

<form
  className="flex flex-col gap-4"
  onSubmit={(e) => {
    e.preventDefault()
    setSubmitted(true)
  }}
>
  <TextField
    value={description}
    onChange={(value) => {
      setDescription(value)
      setSubmitted(false)
    }}
    isInvalid={submitted && isTooShort}
  >
    <Label>Describe the issue</Label>
    <TextArea placeholder="Steps to reproduce, expected vs. actual behavior…" rows={5} />
    {submitted && isTooShort ? (
      <FieldError>Add at least {MIN_LENGTH} characters so we can investigate.</FieldError>
    ) : (
      <Description>Include steps to reproduce and what you expected.</Description>
    )}
  </TextField>
  <Button type="submit">Submit report</Button>
</form>
```

## TextArea comment composer with toolbar

Block addons hold a `Group` of quick actions above and a `ToggleButtonGroup` plus submit below.

```tsx
import { BoldIcon, ItalicIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/field"
import { Group } from "@/components/ui/group"
import { InputGroup, InputGroupAddon, TextArea } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"
import { ToggleButton } from "@/components/ui/toggle-button"
import { ToggleButtonGroup } from "@/components/ui/toggle-button-group"
```

```tsx
const [inputValue, setInputValue] = React.useState("")

<TextField value={inputValue} onChange={setInputValue}>
  <Label>Comment</Label>
  <InputGroup>
    <InputGroupAddon>
      <Group>
        <Button variant="quiet" onPress={() => setInputValue(`${inputValue}👍`)}>
          👍
        </Button>
        <Button variant="quiet" onPress={() => setInputValue(`${inputValue}❤️`)}>
          ❤️
        </Button>
      </Group>
    </InputGroupAddon>
    <TextArea placeholder="type something here" />
    <InputGroupAddon>
      <Group className="justify-between">
        <ToggleButtonGroup>
          <ToggleButton isIconOnly>
            <BoldIcon />
          </ToggleButton>
          <ToggleButton isIconOnly>
            <ItalicIcon />
          </ToggleButton>
        </ToggleButtonGroup>
        <Button variant="primary">Comment</Button>
      </Group>
    </InputGroupAddon>
  </InputGroup>
</TextField>
```

## SearchField

Renders a default `InputGroup` with a search icon and a clear button once non-empty.

```tsx
import { Input } from "@/components/ui/input"
import { SearchField } from "@/components/ui/search-field"
```

```tsx
<SearchField aria-label="Search">
  <Input />
</SearchField>
```

## SearchField with label and description

```tsx
import { Description, Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SearchField } from "@/components/ui/search-field"
```

```tsx
<SearchField>
  <Label>Search</Label>
  <Input />
  <Description>Enter your search query</Description>
</SearchField>
```

## SearchField with error message

```tsx
import { FieldError, Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SearchField } from "@/components/ui/search-field"
```

```tsx
<SearchField isRequired isInvalid>
  <Label>Search</Label>
  <Input />
  <FieldError>Please fill out this field.</FieldError>
</SearchField>
```

## SearchField controlled

```tsx
import { Input } from "@/components/ui/input"
import { SearchField } from "@/components/ui/search-field"
```

```tsx
const [inputValue, setInputValue] = React.useState("Is dotUI the next-gen ui lib?")

<SearchField aria-label="Search" value={inputValue} onChange={setInputValue}>
  <Input />
</SearchField>
<SearchField aria-label="Search" defaultValue="Marvel movies">
  <Input />
</SearchField>
```

## SearchField submit and clear

`onSubmit` fires on Enter; `onClear` on Escape or the clear button.

```tsx
import { Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SearchField } from "@/components/ui/search-field"
```

```tsx
<SearchField onSubmit={(value) => search(value)} onClear={() => reset()}>
  <Label>Search</Label>
  <Input />
</SearchField>
```

## SearchField disabled and read-only

```tsx
import { Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SearchField } from "@/components/ui/search-field"
```

```tsx
<SearchField aria-label="Search" defaultValue="Is dotUI the best ui library?" isDisabled>
  <Input />
</SearchField>
<SearchField isReadOnly defaultValue="Marvel movies">
  <Label>Search</Label>
  <Input />
</SearchField>
```

## SearchField sizes

```tsx
import { Input } from "@/components/ui/input"
import { SearchField } from "@/components/ui/search-field"
```

```tsx
<SearchField aria-label="sm">
  <Input placeholder="sm" size="sm" />
</SearchField>
<SearchField aria-label="md">
  <Input placeholder="md" size="md" />
</SearchField>
<SearchField aria-label="lg">
  <Input placeholder="lg" size="lg" />
</SearchField>
```

## SearchField in an app header

```tsx
import { BellIcon, LayoutGridIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchField } from "@/components/ui/search-field"
```

```tsx
<div className="flex items-center gap-3 rounded-lg border bg-bg px-3 py-2">
  <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-fg-on-primary">
    <LayoutGridIcon className="size-4" />
  </div>
  <SearchField aria-label="Search the app" className="flex-1">
    <Input placeholder="Search…" size="sm" />
  </SearchField>
  <Button variant="quiet" size="sm" isIconOnly aria-label="Notifications">
    <BellIcon />
  </Button>
</div>
```

## SearchField filtering a list

```tsx
import { Input } from "@/components/ui/input"
import { SearchField } from "@/components/ui/search-field"
```

```tsx
const [query, setQuery] = useState("")
const results = members.filter((member) =>
  `${member.name} ${member.email}`.toLowerCase().includes(query.toLowerCase()),
)

<div className="flex flex-col gap-3 rounded-lg border bg-bg p-4">
  <SearchField aria-label="Search members" value={query} onChange={setQuery}>
    <Input placeholder="Filter members…" />
  </SearchField>
  <ul className="flex flex-col gap-1">
    {results.length === 0 ? (
      <li className="px-2 py-6 text-center text-sm text-fg-muted">No members found.</li>
    ) : (
      results.map((member) => (
        <li key={member.email} className="flex items-center justify-between gap-3 rounded-md px-2 py-2 hover:bg-muted">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{member.name}</p>
            <p className="truncate text-xs text-fg-muted">{member.email}</p>
          </div>
          <span className="shrink-0 text-xs text-fg-muted">{member.role}</span>
        </li>
      ))
    )}
  </ul>
</div>
```

## SearchField with suggestions

```tsx
import { Input } from "@/components/ui/input"
import { SearchField } from "@/components/ui/search-field"
```

```tsx
const [query, setQuery] = useState("")
const suggestions = query
  ? cities.filter((city) => city.toLowerCase().includes(query.toLowerCase()))
  : []

<div>
  <SearchField aria-label="Search cities" value={query} onChange={setQuery}>
    <Input placeholder="Search cities…" />
  </SearchField>
  {suggestions.length > 0 && (
    <ul className="mt-2 overflow-hidden rounded-md border bg-bg shadow-md">
      {suggestions.map((city) => (
        <li key={city}>
          <button
            type="button"
            onClick={() => setQuery(city)}
            className="w-full px-3 py-2 text-left text-sm hover:bg-muted"
          >
            {city}
          </button>
        </li>
      ))}
    </ul>
  )}
</div>
```

## NumberField

Steppers are `Button`s with `slot="decrement"` / `slot="increment"`; `NumberFieldGroup` is a re-export of `Group`.

```tsx
import { Input } from "@/components/ui/input"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
} from "@/components/ui/number-field"
```

```tsx
<NumberField aria-label="Width" defaultValue={1024}>
  <NumberFieldGroup>
    <NumberFieldDecrement />
    <Input />
    <NumberFieldIncrement />
  </NumberFieldGroup>
</NumberField>
```

## NumberField with label, description and error

```tsx
import { Description, FieldError, Label } from "@/components/ui/field"
import { Group } from "@/components/ui/group"
import { Input } from "@/components/ui/input"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldIncrement,
} from "@/components/ui/number-field"
```

```tsx
<NumberField defaultValue={1024}>
  <Label>Width</Label>
  <Group>
    <NumberFieldDecrement />
    <Input />
    <NumberFieldIncrement />
  </Group>
  <Description>Enter the desired width.</Description>
</NumberField>
<NumberField defaultValue={1024} isRequired isInvalid>
  <Label>Width</Label>
  <Group>
    <NumberFieldDecrement />
    <Input />
    <NumberFieldIncrement />
  </Group>
  <FieldError>Please fill out this field.</FieldError>
</NumberField>
```

## NumberField controlled

`onChange` receives a number.

```tsx
import { Group } from "@/components/ui/group"
import { Input } from "@/components/ui/input"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldIncrement,
} from "@/components/ui/number-field"
```

```tsx
const [inputValue, setInputValue] = React.useState(69)

<NumberField aria-label="Width" value={inputValue} onChange={setInputValue}>
  <Group>
    <NumberFieldDecrement />
    <Input />
    <NumberFieldIncrement />
  </Group>
</NumberField>
```

## NumberField format options

`formatOptions` is an `Intl.NumberFormat` options object.

```tsx
import { Label } from "@/components/ui/field"
import { Group } from "@/components/ui/group"
import { Input } from "@/components/ui/input"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldIncrement,
} from "@/components/ui/number-field"
```

```tsx
<NumberField
  defaultValue={0}
  formatOptions={{ signDisplay: "exceptZero", minimumFractionDigits: 1, maximumFractionDigits: 2 }}
>
  <Label>Decimal</Label>
  <Group>
    <NumberFieldDecrement />
    <Input />
    <NumberFieldIncrement />
  </Group>
</NumberField>
<NumberField defaultValue={0.05} formatOptions={{ style: "percent" }}>
  <Label>Percentage</Label>
  <Group>
    <NumberFieldDecrement />
    <Input />
    <NumberFieldIncrement />
  </Group>
</NumberField>
<NumberField
  defaultValue={45}
  formatOptions={{ style: "currency", currency: "EUR", currencyDisplay: "code", currencySign: "accounting" }}
>
  <Label>Currency</Label>
  <Group>
    <NumberFieldDecrement />
    <Input />
    <NumberFieldIncrement />
  </Group>
</NumberField>
<NumberField defaultValue={4} formatOptions={{ style: "unit", unit: "inch", unitDisplay: "long" }}>
  <Label>Unit</Label>
  <Group>
    <NumberFieldDecrement />
    <Input />
    <NumberFieldIncrement />
  </Group>
</NumberField>
```

## NumberField min, max and step

```tsx
import { Group } from "@/components/ui/group"
import { Input } from "@/components/ui/input"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldIncrement,
} from "@/components/ui/number-field"
```

```tsx
<NumberField aria-label="Quantity" minValue={0} maxValue={100} step={5} defaultValue={10}>
  <Group>
    <NumberFieldDecrement />
    <Input />
    <NumberFieldIncrement />
  </Group>
</NumberField>
```

## NumberField with steppers inside an InputGroup

```tsx
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldIncrement,
} from "@/components/ui/number-field"
```

```tsx
<NumberField aria-label="Width" defaultValue={1024}>
  <InputGroup>
    <Input />
    <InputGroupAddon>
      <NumberFieldDecrement />
      <NumberFieldIncrement />
    </InputGroupAddon>
  </InputGroup>
</NumberField>
```

## NumberField sizes

Steppers accept `Button` props, so size the `Input` and both steppers together.

```tsx
import { Group } from "@/components/ui/group"
import { Input } from "@/components/ui/input"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldIncrement,
} from "@/components/ui/number-field"
```

```tsx
<NumberField aria-label="small (sm)" defaultValue={1024}>
  <Group>
    <NumberFieldDecrement size="sm" />
    <Input size="sm" />
    <NumberFieldIncrement size="sm" />
  </Group>
</NumberField>
<NumberField aria-label="large (lg)" defaultValue={1024}>
  <Group>
    <NumberFieldDecrement size="lg" />
    <Input size="lg" />
    <NumberFieldIncrement size="lg" />
  </Group>
</NumberField>
```

## NumberField disabled and read-only

```tsx
import { Label } from "@/components/ui/field"
import { Group } from "@/components/ui/group"
import { Input } from "@/components/ui/input"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldIncrement,
} from "@/components/ui/number-field"
```

```tsx
<NumberField defaultValue={20} isDisabled>
  <Label>Width</Label>
  <Group>
    <NumberFieldDecrement />
    <Input />
    <NumberFieldIncrement />
  </Group>
</NumberField>
<NumberField aria-label="Width" isReadOnly value={69}>
  <Group>
    <NumberFieldDecrement />
    <Input />
    <NumberFieldIncrement />
  </Group>
</NumberField>
```

## OTPField

`length` sets the slot count; each `Input` after the first needs its own `aria-label`.

```tsx
import { Label } from "@/components/ui/field"
import { Group } from "@/components/ui/group"
import { Input } from "@/components/ui/input"
import { OTPField } from "@/components/ui/otp-field"
```

```tsx
<OTPField length={6}>
  <Label>Verification code</Label>
  <Group>
    <Input />
    <Input aria-label="Digit 2" />
    <Input aria-label="Digit 3" />
    <Input aria-label="Digit 4" />
    <Input aria-label="Digit 5" />
    <Input aria-label="Digit 6" />
  </Group>
</OTPField>
```

## OTPField with separator

Split slots across `Group`s with an `OTPFieldSeparator` between them.

```tsx
import { Label } from "@/components/ui/field"
import { Group } from "@/components/ui/group"
import { Input } from "@/components/ui/input"
import { OTPField, OTPFieldSeparator } from "@/components/ui/otp-field"
```

```tsx
<OTPField length={6}>
  <Label>Verification code</Label>
  <div className="flex items-center">
    <Group>
      <Input />
      <Input aria-label="Digit 2" />
      <Input aria-label="Digit 3" />
    </Group>
    <OTPFieldSeparator className="px-2 text-fg-muted">-</OTPFieldSeparator>
    <Group>
      <Input aria-label="Digit 4" />
      <Input aria-label="Digit 5" />
      <Input aria-label="Digit 6" />
    </Group>
  </div>
</OTPField>
```

## OTPField four-digit PIN

```tsx
import { Label } from "@/components/ui/field"
import { Group } from "@/components/ui/group"
import { Input } from "@/components/ui/input"
import { OTPField } from "@/components/ui/otp-field"
```

```tsx
<OTPField length={4}>
  <Label>PIN</Label>
  <Group>
    <Input />
    <Input aria-label="Digit 2" />
    <Input aria-label="Digit 3" />
    <Input aria-label="Digit 4" />
  </Group>
</OTPField>
```

## OTPField alphanumeric

```tsx
import { Label } from "@/components/ui/field"
import { Group } from "@/components/ui/group"
import { Input } from "@/components/ui/input"
import { OTPField } from "@/components/ui/otp-field"
```

```tsx
<OTPField length={6} validationType="alphanumeric">
  <Label>Recovery code</Label>
  <Group>
    <Input />
    <Input aria-label="Character 2" />
    <Input aria-label="Character 3" />
    <Input aria-label="Character 4" />
    <Input aria-label="Character 5" />
    <Input aria-label="Character 6" />
  </Group>
</OTPField>
```

## OTPField controlled

`onChange` receives the whole string.

```tsx
import { Label } from "@/components/ui/field"
import { Group } from "@/components/ui/group"
import { Input } from "@/components/ui/input"
import { OTPField } from "@/components/ui/otp-field"
```

```tsx
const [value, setValue] = React.useState("123")

<OTPField length={6} value={value} onChange={setValue}>
  <Label>Verification code</Label>
  <Group>
    <Input />
    <Input aria-label="Digit 2" />
    <Input aria-label="Digit 3" />
    <Input aria-label="Digit 4" />
    <Input aria-label="Digit 5" />
    <Input aria-label="Digit 6" />
  </Group>
</OTPField>
```

## OTPField disabled

```tsx
import { Label } from "@/components/ui/field"
import { Group } from "@/components/ui/group"
import { Input } from "@/components/ui/input"
import { OTPField } from "@/components/ui/otp-field"
```

```tsx
<OTPField length={6} defaultValue="123456" isDisabled>
  <Label>Verification code</Label>
  <Group>
    <Input />
    <Input aria-label="Digit 2" />
    <Input aria-label="Digit 3" />
    <Input aria-label="Digit 4" />
    <Input aria-label="Digit 5" />
    <Input aria-label="Digit 6" />
  </Group>
</OTPField>
```

## OTPField validation in a form

`name` for submission; `isInvalid` surfaces `FieldError` next to `Description`.

```tsx
import { Button } from "@/components/ui/button"
import { Description, FieldError, Label } from "@/components/ui/field"
import { Group } from "@/components/ui/group"
import { Input } from "@/components/ui/input"
import { OTPField } from "@/components/ui/otp-field"
```

```tsx
const [value, setValue] = React.useState("")
const [submitted, setSubmitted] = React.useState(false)
const isInvalid = submitted && value.length !== 6

<form
  noValidate
  className="flex flex-col gap-4"
  onSubmit={(event) => {
    event.preventDefault()
    setSubmitted(true)
  }}
>
  <OTPField length={6} name="verification-code" value={value} onChange={setValue} isInvalid={isInvalid}>
    <Label>Verification code</Label>
    <Group>
      <Input />
      <Input aria-label="Digit 2" />
      <Input aria-label="Digit 3" />
      <Input aria-label="Digit 4" />
      <Input aria-label="Digit 5" />
      <Input aria-label="Digit 6" />
    </Group>
    <Description>Enter the six-digit code sent to your email.</Description>
    <FieldError>Enter all six digits.</FieldError>
  </OTPField>
  <Button type="submit">Submit</Button>
</form>
```

## OTPField verification with pending state

Visually hidden label, `isDisabled` while verifying, error swapped for description.

```tsx
import { MailIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Description, FieldError, Label } from "@/components/ui/field"
import { Group } from "@/components/ui/group"
import { Input } from "@/components/ui/input"
import { OTPField } from "@/components/ui/otp-field"
```

```tsx
const [value, setValue] = React.useState("")
const [isPending, setIsPending] = React.useState(false)
const [error, setError] = React.useState<string | null>(null)

<form noValidate className="flex flex-col gap-4 rounded-lg border bg-bg p-5" onSubmit={handleSubmit}>
  <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
    <MailIcon className="size-5" />
  </div>
  <h3 className="text-base font-semibold">Verify your email</h3>
  <p className="text-sm text-fg-muted">We sent a code to jane@acme.com</p>
  <OTPField
    length={6}
    name="code"
    value={value}
    onChange={(next) => {
      setValue(next)
      if (error) setError(null)
    }}
    isInvalid={Boolean(error)}
    isDisabled={isPending}
  >
    <Label className="sr-only">Email verification code</Label>
    <Group>
      <Input />
      <Input aria-label="Digit 2" />
      <Input aria-label="Digit 3" />
      <Input aria-label="Digit 4" />
      <Input aria-label="Digit 5" />
      <Input aria-label="Digit 6" />
    </Group>
    {error ? <FieldError>{error}</FieldError> : <Description>The code expires in 10 minutes.</Description>}
  </OTPField>
  <Button type="submit" className="w-full" isPending={isPending}>
    Continue
  </Button>
</form>
```

## OTPField two-factor with resend timer

```tsx
import { ShieldCheckIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { FieldError, Label } from "@/components/ui/field"
import { Group } from "@/components/ui/group"
import { Input } from "@/components/ui/input"
import { OTPField } from "@/components/ui/otp-field"
```

```tsx
const [value, setValue] = React.useState("")
const [submitted, setSubmitted] = React.useState(false)
const [seconds, setSeconds] = React.useState(30)
const isInvalid = submitted && value.length !== 6

<form noValidate className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }}>
  <ShieldCheckIcon className="size-5 text-primary" />
  <h3 className="text-base font-semibold">Two-factor authentication</h3>
  <OTPField length={6} name="code" value={value} onChange={setValue} isInvalid={isInvalid}>
    <Label className="sr-only">Authentication code</Label>
    <Group>
      <Input />
      <Input aria-label="Digit 2" />
      <Input aria-label="Digit 3" />
      <Input aria-label="Digit 4" />
      <Input aria-label="Digit 5" />
      <Input aria-label="Digit 6" />
    </Group>
    <FieldError>Enter all six digits.</FieldError>
  </OTPField>
  <Button type="submit" className="w-full">Verify</Button>
  <Button
    type="button"
    variant="quiet"
    size="sm"
    className="w-full"
    isDisabled={seconds > 0}
    onPress={() => { setSeconds(30); setValue(""); setSubmitted(false) }}
  >
    {seconds > 0 ? `Resend code in ${seconds}s` : "Resend code"}
  </Button>
</form>
```

## Group

```tsx
import { Button } from "@/components/ui/button"
import { Group } from "@/components/ui/group"
```

```tsx
<Group>
  <Button>Button</Button>
  <Button>Another Button</Button>
</Group>
```

## Group with icon buttons

```tsx
import { FlipHorizontalIcon, FlipVerticalIcon, RotateCwIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Group } from "@/components/ui/group"
```

```tsx
<Group>
  <Button isIconOnly>
    <FlipHorizontalIcon />
  </Button>
  <Button isIconOnly>
    <FlipVerticalIcon />
  </Button>
  <Button isIconOnly>
    <RotateCwIcon />
  </Button>
</Group>
```

## Group vertical

```tsx
import { MinusIcon, PlusIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Group } from "@/components/ui/group"
```

```tsx
<Group orientation="vertical" aria-label="Media controls" className="h-fit">
  <Button isIconOnly>
    <PlusIcon />
  </Button>
  <Button isIconOnly>
    <MinusIcon />
  </Button>
</Group>
```

## Group nested (segmented clusters)

Nest `Group`s to separate clusters inside one bar; works vertically too.

```tsx
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Group } from "@/components/ui/group"
```

```tsx
<Group>
  <Group>
    <Button size="sm">1</Button>
    <Button size="sm">2</Button>
    <Button size="sm">3</Button>
  </Group>
  <Group>
    <Button size="xs" isIconOnly>
      <ArrowLeftIcon />
    </Button>
    <Button size="xs" isIconOnly>
      <ArrowRightIcon />
    </Button>
  </Group>
</Group>
```

## Group vertical nested (tool palette)

```tsx
import { CopyIcon, SearchIcon, ShareIcon, TrashIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Group } from "@/components/ui/group"
```

```tsx
<Group orientation="vertical" aria-label="Design tools palette">
  <Group orientation="vertical">
    <Button isIconOnly>
      <SearchIcon />
    </Button>
    <Button isIconOnly>
      <CopyIcon />
    </Button>
    <Button isIconOnly>
      <ShareIcon />
    </Button>
  </Group>
  <Group orientation="vertical">
    <Button isIconOnly>
      <TrashIcon />
    </Button>
  </Group>
</Group>
```

## Group pagination

```tsx
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Group } from "@/components/ui/group"
```

```tsx
<Group>
  <Button size="sm">
    <ArrowLeftIcon />
    Previous
  </Button>
  <Button size="sm">1</Button>
  <Button size="sm">2</Button>
  <Button size="sm">3</Button>
  <Button size="sm">
    Next
    <ArrowRightIcon />
  </Button>
</Group>
```

## Group like button

```tsx
import { HeartIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Group } from "@/components/ui/group"
```

```tsx
<Group>
  <Button>
    <HeartIcon />
    Like
  </Button>
  <Button>1.2K</Button>
</Group>
```

## GroupText

Inline text segment between controls.

```tsx
import { Button } from "@/components/ui/button"
import { Group, GroupText } from "@/components/ui/group"
```

```tsx
<Group>
  <GroupText>Text</GroupText>
  <Button>Another Button</Button>
</Group>
```

## Group with Label and Input

```tsx
import { Label } from "@/components/ui/field"
import { Group } from "@/components/ui/group"
import { Input, InputGroup } from "@/components/ui/input"
```

```tsx
<Group>
  <Label htmlFor="input-text">GPU Size</Label>
  <InputGroup>
    <Input id="input-text" placeholder="Type something here..." />
  </InputGroup>
</Group>
```

## Group with Input and Button

Wrap the `Input` in an `InputGroup` so it joins the group's shared border.

```tsx
import { Button } from "@/components/ui/button"
import { Group } from "@/components/ui/group"
import { Input, InputGroup } from "@/components/ui/input"
```

```tsx
<Group>
  <Button>Button</Button>
  <InputGroup>
    <Input placeholder="Type something here..." />
  </InputGroup>
</Group>
<Group>
  <InputGroup>
    <Input placeholder="Type something here..." />
  </InputGroup>
  <Button>Button</Button>
</Group>
```

## Group with Select and Input

```tsx
import { Group } from "@/components/ui/group"
import { Input, InputGroup } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
```

```tsx
const durationItems = [
  { id: "hours", label: "Hours" },
  { id: "days", label: "Days" },
  { id: "weeks", label: "Weeks" },
]

<Group>
  <Select defaultSelectedKey="hours" aria-label="Duration unit">
    <SelectTrigger />
    <SelectContent items={durationItems}>
      {(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}
    </SelectContent>
  </Select>
  <InputGroup>
    <Input />
  </InputGroup>
</Group>
```

## Group amount form (Field + Select + Input + Button)

```tsx
import { ArrowRightIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Field, Label } from "@/components/ui/field"
import { Group } from "@/components/ui/group"
import { Input, InputGroup } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
```

```tsx
<Field>
  <Label>Amount</Label>
  <Group>
    <Select defaultSelectedKey="$" aria-label="Currency">
      <SelectTrigger />
      <SelectContent items={currencyItems}>
        {(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}
      </SelectContent>
    </Select>
    <InputGroup>
      <Input placeholder="Enter amount to send" />
    </InputGroup>
    <Button isIconOnly>
      <ArrowRightIcon />
    </Button>
  </Group>
</Field>
```

## Group numeric field with controls

`InputGroup` addons inside a `Group` with plain stepper buttons.

```tsx
import { MinusIcon, PlusIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, Label } from "@/components/ui/field"
import { Group } from "@/components/ui/group"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
```

```tsx
<FieldGroup className="grid grid-cols-3 gap-4">
  <Field className="col-span-2">
    <Label htmlFor="width">Width</Label>
    <Group>
      <InputGroup>
        <InputGroupAddon>W</InputGroupAddon>
        <Input id="width" />
        <InputGroupAddon>px</InputGroupAddon>
      </InputGroup>
      <Button isIconOnly>
        <MinusIcon />
      </Button>
      <Button isIconOnly>
        <PlusIcon />
      </Button>
    </Group>
  </Field>
</FieldGroup>
```

## Group labelled by a Label

```tsx
import { Button } from "@/components/ui/button"
import { Field, Label } from "@/components/ui/field"
import { Group } from "@/components/ui/group"
```

```tsx
<Field>
  <Label id="alignment-label">Text Alignment</Label>
  <Group aria-labelledby="alignment-label">
    <Button size="sm">Left</Button>
    <Button size="sm">Center</Button>
    <Button size="sm">Right</Button>
    <Button size="sm">Justify</Button>
  </Group>
</Field>
```

## Group split button with Menu

```tsx
import { ChevronDownIcon, TrashIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Group } from "@/components/ui/group"
import { Menu, MenuContent, MenuItem, MenuSection } from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
```

```tsx
<Group>
  <Button>Follow</Button>
  <Menu>
    <Button isIconOnly>
      <ChevronDownIcon />
    </Button>
    <Popover placement="bottom end" className="w-50">
      <MenuContent>
        <MenuSection>
          <MenuItem>Mark as Read</MenuItem>
          <MenuItem>Block User</MenuItem>
        </MenuSection>
        <Separator />
        <MenuSection>
          <MenuItem variant="danger">
            <TrashIcon />
            Delete Conversation
          </MenuItem>
        </MenuSection>
      </MenuContent>
    </Popover>
  </Menu>
</Group>
```

## Group chat composer

```tsx
import { MicIcon, PlusIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Group } from "@/components/ui/group"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { Tooltip, TooltipContent } from "@/components/ui/tooltip"
```

```tsx
<Group>
  <Group>
    <Button isIconOnly>
      <PlusIcon />
    </Button>
  </Group>
  <Group>
    <InputGroup>
      <Input placeholder="Send a message..." />
      <InputGroupAddon>
        <Tooltip>
          <Button isIconOnly variant="quiet">
            <MicIcon />
          </Button>
          <TooltipContent>Voice Mode</TooltipContent>
        </Tooltip>
      </InputGroupAddon>
    </InputGroup>
  </Group>
</Group>
```

## react-hook-form FormControl with TextField

`FormControl` wraps `Controller` and hands the render prop `value`, `onChange`, `onBlur`, `name`, `ref`, `isInvalid`, `isDisabled` and `errorMessage`, matching React Aria props.

```tsx
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { FormControl } from "@/components/ui/react-hook-form"
import { TextField } from "@/components/ui/text-field"
```

```tsx
const FormSchema = z.object({ name: z.string().min(2), email: z.email() })
const { handleSubmit, control } = useForm<z.infer<typeof FormSchema>>({
  resolver: zodResolver(FormSchema),
})

<form onSubmit={handleSubmit((data) => console.log(data))} className="space-y-4">
  <FormControl
    name="name"
    control={control}
    render={(props) => (
      <TextField {...props}>
        <Label>Name</Label>
        <Input placeholder="Name" />
      </TextField>
    )}
  />
  <FormControl
    name="email"
    control={control}
    render={(props) => (
      <TextField {...props}>
        <Label>Email</Label>
        <Input placeholder="Email" />
      </TextField>
    )}
  />
  <Button type="submit">Register</Button>
</form>
```

## react-hook-form FormControl with RadioGroup and Select

```tsx
import { FieldGroup, Label } from "@/components/ui/field"
import { Radio, RadioControl, RadioGroup } from "@/components/ui/radio-group"
import { FormControl } from "@/components/ui/react-hook-form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
```

```tsx
<FormControl
  name="gender"
  control={control}
  render={(props) => (
    <RadioGroup orientation="horizontal" {...props}>
      <Label>Gender</Label>
      <FieldGroup>
        <Radio value="male">
          <RadioControl />
          <Label>Male</Label>
        </Radio>
        <Radio value="female">
          <RadioControl />
          <Label>Female</Label>
        </Radio>
      </FieldGroup>
    </RadioGroup>
  )}
/>
<FormControl
  name="referral"
  control={control}
  render={(props) => (
    <Select className="w-full" {...props}>
      <Label>How did you hear about us?</Label>
      <SelectTrigger variant="secondary" className="w-full" />
      <SelectContent>
        <SelectItem id="linkedin">LinkedIn</SelectItem>
        <SelectItem id="x">X</SelectItem>
      </SelectContent>
    </Select>
  )}
/>
```

## react-hook-form FormControl with DatePicker (value mapping)

Destructure `value`/`onChange` to convert between the form's string and `DateValue`; picker is responsive (Drawer on mobile, Popover on desktop).

```tsx
import { parseDate } from "@internationalized/date"

import { CalendarIcon } from "@/components/icons"
import { Responsive } from "@/lib/responsive"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { DatePicker } from "@/components/ui/date-picker"
import { DialogContent } from "@/components/ui/dialog"
import { Drawer } from "@/components/ui/drawer"
import { Label } from "@/components/ui/field"
import { DateInput, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { Popover } from "@/components/ui/popover"
import { FormControl } from "@/components/ui/react-hook-form"
```

```tsx
<FormControl
  name="birth-date"
  control={control}
  render={({ value, onChange, ...props }) => (
    <DatePicker
      value={value ? parseDate(value) : undefined}
      onChange={(val) => onChange(val?.toString())}
      className="w-full"
      {...props}
    >
      <Label>Birth Date</Label>
      <InputGroup>
        <DateInput />
        <InputGroupAddon>
          <Button variant="secondary" size="sm" isIconOnly>
            <CalendarIcon />
          </Button>
        </InputGroupAddon>
      </InputGroup>
      <Responsive
        render={(isMobile) => {
          const content = (
            <DialogContent>
              <Calendar aria-label="Pick a date" />
            </DialogContent>
          )
          return isMobile ? <Drawer>{content}</Drawer> : <Popover>{content}</Popover>
        }}
      />
    </DatePicker>
  )}
/>
```

## react-hook-form FormControl with Combobox

```tsx
import { ChevronDownIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
import { Label } from "@/components/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { ListBox, ListBoxItem } from "@/components/ui/list-box"
import { Popover } from "@/components/ui/popover"
import { FormControl } from "@/components/ui/react-hook-form"
```

```tsx
<FormControl
  name="language"
  control={control}
  render={({ value, onChange, ...props }) => (
    <Combobox inputValue={value} onSelectionChange={onChange} className="w-full" {...props}>
      <Label>Preferred language</Label>
      <InputGroup>
        <Input />
        <InputGroupAddon>
          <Button variant="quiet" isIconOnly>
            <ChevronDownIcon />
          </Button>
        </InputGroupAddon>
      </InputGroup>
      <Popover>
        <ListBox items={languages}>
          {(item) => <ListBoxItem id={item.value}>{item.label}</ListBoxItem>}
        </ListBox>
      </Popover>
    </Combobox>
  )}
/>
```

## react-hook-form FormControl with Checkbox

Map `value` to `isSelected`.

```tsx
import { Checkbox, CheckboxControl } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/field"
import { FormControl } from "@/components/ui/react-hook-form"
```

```tsx
<FormControl
  name="terms"
  control={control}
  render={({ value, ...props }) => (
    <Checkbox isSelected={value} {...props}>
      <CheckboxControl />
      <Label>I agree to the terms and conditions</Label>
    </Checkbox>
  )}
/>
```

## TanStack Form useAppForm

Derived from the registry source (no demos or docs yet): `useAppForm` binds dotUI fields (TextField, NumberField, Checkbox, Switch, RadioGroup, Slider, Select, Combobox, SearchField, DateField, DatePicker, TimeField, ColorField, ColorPicker) plus `SubmitButton` / `ResetButton`; bound fields inject a `FieldError` from field meta.

```tsx
import { Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAppForm } from "@/components/ui/tanstack-form"
```

```tsx
const form = useAppForm({
  defaultValues: { name: "", age: 0 },
  onSubmit: async ({ value }) => console.log(value),
})

<form
  onSubmit={(e) => {
    e.preventDefault()
    form.handleSubmit()
  }}
  className="space-y-4"
>
  <form.AppField name="name">
    {(field) => (
      <field.TextField>
        <Label>Name</Label>
        <Input placeholder="Name" />
      </field.TextField>
    )}
  </form.AppField>
  <form.AppField name="age">
    {(field) => (
      <field.NumberField>
        <Label>Age</Label>
        <Input />
      </field.NumberField>
    )}
  </form.AppField>
  <form.AppForm>
    <form.SubmitButton>Submit</form.SubmitButton>
    <form.ResetButton>Reset</form.ResetButton>
  </form.AppForm>
</form>
```

# Selection controls

## Checkbox

```tsx
import { Checkbox, CheckboxControl } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/field"
```

```tsx
<Checkbox>
  <CheckboxControl />
  <Label>I accept the terms and conditions</Label>
</Checkbox>
```

## Checkbox shorthand (string child)

A string child renders the control and label for you.

```tsx
import { Checkbox } from "@/components/ui/checkbox"
```

```tsx
<Checkbox defaultSelected>Accept terms</Checkbox>
```

## Checkbox standalone (no label)

```tsx
import { Checkbox } from "@/components/ui/checkbox"
```

```tsx
<Checkbox aria-label="I accept the terms and conditions" defaultSelected />
```

## Checkbox with description

```tsx
import { Checkbox, CheckboxControl } from "@/components/ui/checkbox"
import { Description, Label } from "@/components/ui/field"
```

```tsx
<Checkbox defaultSelected>
  <CheckboxControl />
  <div className="flex flex-col gap-1">
    <Label>Accept terms and conditions</Label>
    <Description>
      By clicking this checkbox, you agree to the terms and conditions.
    </Description>
  </div>
</Checkbox>
```

## Checkbox card (indicator + content inside the control)

The whole card is the hit area: put `CheckboxIndicator` and `FieldContent` inside `CheckboxControl`.

```tsx
import {
  Checkbox,
  CheckboxControl,
  CheckboxIndicator,
} from "@/components/ui/checkbox"
import { Description, FieldContent, Label } from "@/components/ui/field"
```

```tsx
<Checkbox className="w-full">
  <CheckboxControl>
    <CheckboxIndicator />
    <FieldContent>
      <Label>I agree to the terms and conditions</Label>
      <Description>Please read the terms before proceeding</Description>
    </FieldContent>
  </CheckboxControl>
</Checkbox>
```

## Checkbox states (indeterminate, invalid, disabled, read-only)

```tsx
import { Checkbox, CheckboxControl } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/field"
```

```tsx
<Checkbox isIndeterminate>
  <CheckboxControl />
  <Label>Select all</Label>
</Checkbox>
<Checkbox isInvalid>
  <CheckboxControl />
  <Label>Accept terms and conditions</Label>
</Checkbox>
<Checkbox isDisabled>
  <CheckboxControl />
  <Label>I accept the terms and conditions</Label>
</Checkbox>
<Checkbox defaultSelected isReadOnly>
  <CheckboxControl />
  <Label>I accept the terms and conditions</Label>
</Checkbox>
```

## Checkbox controlled

```tsx
import React from "react"

import { Checkbox, CheckboxControl } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/field"
```

```tsx
const [isSelected, setIsSelected] = React.useState(false)

<Checkbox isSelected={isSelected} onChange={setIsSelected}>
  <CheckboxControl />
  <Label>Accept terms</Label>
</Checkbox>
```

## Checkbox list in a Fieldset

Independent checkboxes grouped under a `Legend` (no shared value; use CheckboxGroup for that).

```tsx
import {
  Checkbox,
  CheckboxControl,
  CheckboxIndicator,
} from "@/components/ui/checkbox"
import {
  Description,
  FieldContent,
  Fieldset,
  Label,
  Legend,
} from "@/components/ui/field"
```

```tsx
<Fieldset className="w-full max-w-sm">
  <Legend>Before you continue</Legend>
  <Checkbox className="w-full">
    <CheckboxControl>
      <CheckboxIndicator />
      <FieldContent>
        <Label>Terms of Service</Label>
        <Description>I have read and agree to the terms.</Description>
      </FieldContent>
    </CheckboxControl>
  </Checkbox>
  <Checkbox className="w-full" defaultSelected>
    <CheckboxControl>
      <CheckboxIndicator />
      <FieldContent>
        <Label>Marketing emails</Label>
        <Description>Send me product updates and offers.</Description>
      </FieldContent>
    </CheckboxControl>
  </Checkbox>
</Fieldset>
```

## Checkbox preferences list (data-driven)

```tsx
import {
  Checkbox,
  CheckboxControl,
  CheckboxIndicator,
} from "@/components/ui/checkbox"
import { Description, FieldContent, Label } from "@/components/ui/field"
```

```tsx
const preferences = [
  { id: "updates", label: "Product updates", description: "Get notified about new features.", defaultSelected: true },
  { id: "newsletter", label: "Weekly newsletter", description: "A digest of tips and news.", defaultSelected: false },
]

<div className="flex w-full max-w-sm flex-col gap-1">
  {preferences.map((pref) => (
    <Checkbox
      key={pref.id}
      defaultSelected={pref.defaultSelected}
      className="w-full rounded-md p-2 hover:bg-muted"
    >
      <CheckboxControl>
        <CheckboxIndicator />
        <FieldContent>
          <Label>{pref.label}</Label>
          <Description>{pref.description}</Description>
        </FieldContent>
      </CheckboxControl>
    </Checkbox>
  ))}
</div>
```

## CheckboxGroup

```tsx
import { Checkbox, CheckboxControl } from "@/components/ui/checkbox"
import { CheckboxGroup } from "@/components/ui/checkbox-group"
import { FieldGroup, Label } from "@/components/ui/field"
```

```tsx
<CheckboxGroup defaultValue={["nextjs"]}>
  <Label>React frameworks</Label>
  <FieldGroup>
    <Checkbox value="nextjs">
      <CheckboxControl />
      <Label>Next.js</Label>
    </Checkbox>
    <Checkbox value="remix">
      <CheckboxControl />
      <Label>Remix</Label>
    </Checkbox>
    <Checkbox value="gatsby">
      <CheckboxControl />
      <Label>Gatsby</Label>
    </Checkbox>
  </FieldGroup>
</CheckboxGroup>
```

## CheckboxGroup without visible label

```tsx
import { Checkbox, CheckboxControl } from "@/components/ui/checkbox"
import { CheckboxGroup } from "@/components/ui/checkbox-group"
import { FieldGroup, Label } from "@/components/ui/field"
```

```tsx
<CheckboxGroup defaultValue={["nextjs"]} aria-label="React frameworks">
  <FieldGroup>
    <Checkbox value="nextjs">
      <CheckboxControl />
      <Label>Next.js</Label>
    </Checkbox>
    <Checkbox value="remix">
      <CheckboxControl />
      <Label>Remix</Label>
    </Checkbox>
  </FieldGroup>
</CheckboxGroup>
```

## CheckboxGroup with description

```tsx
import { Checkbox, CheckboxControl } from "@/components/ui/checkbox"
import { CheckboxGroup } from "@/components/ui/checkbox-group"
import { Description, FieldGroup, Label } from "@/components/ui/field"
```

```tsx
<CheckboxGroup defaultValue={["nextjs"]}>
  <Label>React frameworks</Label>
  <Description>You can pick any frameworks.</Description>
  <FieldGroup>
    <Checkbox value="nextjs">
      <CheckboxControl />
      <Label>Next.js</Label>
    </Checkbox>
    <Checkbox value="remix">
      <CheckboxControl />
      <Label>Remix</Label>
    </Checkbox>
  </FieldGroup>
</CheckboxGroup>
```

## CheckboxGroup with validation (error message)

```tsx
import { Checkbox, CheckboxControl } from "@/components/ui/checkbox"
import { CheckboxGroup } from "@/components/ui/checkbox-group"
import { FieldError, FieldGroup, Label } from "@/components/ui/field"
```

```tsx
<CheckboxGroup isInvalid>
  <Label>React frameworks</Label>
  <FieldGroup>
    <Checkbox value="nextjs">
      <CheckboxControl />
      <Label>Next.js</Label>
    </Checkbox>
    <Checkbox value="remix">
      <CheckboxControl />
      <Label>Remix</Label>
    </Checkbox>
  </FieldGroup>
  <FieldError>Please select a framework.</FieldError>
</CheckboxGroup>
```

## CheckboxGroup states (required, disabled, read-only)

```tsx
import { Checkbox, CheckboxControl } from "@/components/ui/checkbox"
import { CheckboxGroup } from "@/components/ui/checkbox-group"
import { FieldGroup, Label } from "@/components/ui/field"
```

```tsx
<CheckboxGroup defaultValue={["nextjs"]} isRequired>
  <Label>React frameworks</Label>
  <FieldGroup>
    <Checkbox value="nextjs">
      <CheckboxControl />
      <Label>Next.js</Label>
    </Checkbox>
  </FieldGroup>
</CheckboxGroup>
<CheckboxGroup defaultValue={["nextjs"]} isDisabled>
  {/* ... */}
</CheckboxGroup>
<CheckboxGroup defaultValue={["nextjs"]} isReadOnly>
  {/* ... */}
</CheckboxGroup>
```

## CheckboxGroup controlled

```tsx
import React from "react"

import { Checkbox, CheckboxControl } from "@/components/ui/checkbox"
import { CheckboxGroup } from "@/components/ui/checkbox-group"
import { FieldGroup, Label } from "@/components/ui/field"
```

```tsx
const [frameworks, setFrameworks] = React.useState(["nextjs"])

<CheckboxGroup value={frameworks} onChange={setFrameworks}>
  <Label>React frameworks</Label>
  <FieldGroup>
    <Checkbox value="nextjs">
      <CheckboxControl />
      <Label>Next.js</Label>
    </Checkbox>
    <Checkbox value="remix">
      <CheckboxControl />
      <Label>Remix</Label>
    </Checkbox>
  </FieldGroup>
</CheckboxGroup>
```

## CheckboxGroup cards

```tsx
import {
  Checkbox,
  CheckboxControl,
  CheckboxIndicator,
} from "@/components/ui/checkbox"
import { CheckboxGroup } from "@/components/ui/checkbox-group"
import {
  Description,
  FieldContent,
  FieldGroup,
  Label,
} from "@/components/ui/field"
```

```tsx
<CheckboxGroup defaultValue={["nextjs"]} className="w-full max-w-xs">
  <Label>React frameworks</Label>
  <FieldGroup>
    <Checkbox value="nextjs">
      <CheckboxControl>
        <CheckboxIndicator />
        <FieldContent>
          <Label>Next.js</Label>
          <Description>The React framework for the web</Description>
        </FieldContent>
      </CheckboxControl>
    </Checkbox>
    <Checkbox value="remix">
      <CheckboxControl>
        <CheckboxIndicator />
        <FieldContent>
          <Label>Remix</Label>
          <Description>Full stack web framework</Description>
        </FieldContent>
      </CheckboxControl>
    </Checkbox>
  </FieldGroup>
</CheckboxGroup>
```

## CheckboxGroup in a Form (name + isRequired)

Groups submit under `name`; `isRequired` participates in native form validation.

```tsx
import * as FormPrimitives from "react-aria-components/Form"

import { Button } from "@/components/ui/button"
import { Checkbox, CheckboxControl } from "@/components/ui/checkbox"
import { CheckboxGroup } from "@/components/ui/checkbox-group"
import { Description, FieldGroup, Label } from "@/components/ui/field"
```

```tsx
<FormPrimitives.Form
  onSubmit={(e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
  }}
  className="w-full max-w-xs space-y-6"
>
  <CheckboxGroup name="dietary">
    <Label>Dietary restrictions</Label>
    <FieldGroup>
      <Checkbox value="vegetarian">
        <CheckboxControl />
        <Label>Vegetarian</Label>
      </Checkbox>
      <Checkbox value="vegan">
        <CheckboxControl />
        <Label>Vegan</Label>
      </Checkbox>
    </FieldGroup>
  </CheckboxGroup>
  <CheckboxGroup name="consent" isRequired>
    <Label>Consent</Label>
    <Description>Required to complete your RSVP.</Description>
    <FieldGroup>
      <Checkbox value="terms">
        <CheckboxControl />
        <Label>I accept the event terms</Label>
      </Checkbox>
    </FieldGroup>
  </CheckboxGroup>
  <Button type="submit" variant="primary" className="w-full">
    Confirm RSVP
  </Button>
</FormPrimitives.Form>
```

## RadioGroup

```tsx
import { FieldGroup, Label } from "@/components/ui/field"
import { Radio, RadioControl, RadioGroup } from "@/components/ui/radio-group"
```

```tsx
<RadioGroup defaultValue="nextjs">
  <Label>React frameworks</Label>
  <FieldGroup>
    <Radio value="nextjs">
      <RadioControl />
      <Label>Next.js</Label>
    </Radio>
    <Radio value="remix">
      <RadioControl />
      <Label>Remix</Label>
    </Radio>
    <Radio value="gatsby">
      <RadioControl />
      <Label>Gatsby</Label>
    </Radio>
  </FieldGroup>
</RadioGroup>
```

## Radio shorthand (string child)

```tsx
import { FieldGroup, Label } from "@/components/ui/field"
import { Radio, RadioGroup } from "@/components/ui/radio-group"
```

```tsx
<RadioGroup defaultValue="nextjs">
  <Label>React frameworks</Label>
  <FieldGroup>
    <Radio value="nextjs">Next.js</Radio>
    <Radio value="remix">Remix</Radio>
  </FieldGroup>
</RadioGroup>
```

## RadioGroup without visible label

```tsx
import { FieldGroup, Label } from "@/components/ui/field"
import { Radio, RadioControl, RadioGroup } from "@/components/ui/radio-group"
```

```tsx
<RadioGroup defaultValue="nextjs" aria-label="React frameworks">
  <FieldGroup>
    <Radio value="nextjs">
      <RadioControl />
      <Label>Next.js</Label>
    </Radio>
    <Radio value="remix">
      <RadioControl />
      <Label>Remix</Label>
    </Radio>
  </FieldGroup>
</RadioGroup>
```

## RadioGroup with description

```tsx
import { Description, FieldGroup, Label } from "@/components/ui/field"
import { Radio, RadioControl, RadioGroup } from "@/components/ui/radio-group"
```

```tsx
<RadioGroup defaultValue="nextjs">
  <Label>React frameworks</Label>
  <Description>You can pick one framework.</Description>
  <FieldGroup>
    <Radio value="nextjs">
      <RadioControl />
      <Label>Next.js</Label>
    </Radio>
    <Radio value="remix">
      <RadioControl />
      <Label>Remix</Label>
    </Radio>
  </FieldGroup>
</RadioGroup>
```

## RadioGroup with validation (error message)

```tsx
import { FieldError, FieldGroup, Label } from "@/components/ui/field"
import { Radio, RadioControl, RadioGroup } from "@/components/ui/radio-group"
```

```tsx
<RadioGroup defaultValue={null} isInvalid>
  <Label>React frameworks</Label>
  <FieldGroup>
    <Radio value="nextjs">
      <RadioControl />
      <Label>Next.js</Label>
    </Radio>
    <Radio value="remix">
      <RadioControl />
      <Label>Remix</Label>
    </Radio>
  </FieldGroup>
  <FieldError>Please select a framework.</FieldError>
</RadioGroup>
```

## RadioGroup states (required, disabled, read-only, orientation)

```tsx
import { FieldGroup, Label } from "@/components/ui/field"
import { Radio, RadioControl, RadioGroup } from "@/components/ui/radio-group"
```

```tsx
<RadioGroup defaultValue="nextjs" isRequired>
  <Label>React frameworks</Label>
  <FieldGroup>
    <Radio value="nextjs">
      <RadioControl />
      <Label>Next.js</Label>
    </Radio>
  </FieldGroup>
</RadioGroup>
<RadioGroup defaultValue="nextjs" isDisabled>{/* ... */}</RadioGroup>
<RadioGroup defaultValue="nextjs" isReadOnly>{/* ... */}</RadioGroup>
<RadioGroup defaultValue="nextjs" orientation="horizontal">{/* ... */}</RadioGroup>
```

## RadioGroup controlled

```tsx
import React from "react"

import { FieldGroup, Label } from "@/components/ui/field"
import { Radio, RadioControl, RadioGroup } from "@/components/ui/radio-group"
```

```tsx
const [framework, setFramework] = React.useState("nextjs")

<RadioGroup value={framework} onChange={setFramework}>
  <Label>React frameworks</Label>
  <FieldGroup>
    <Radio value="nextjs">
      <RadioControl />
      <Label>Next.js</Label>
    </Radio>
    <Radio value="remix">
      <RadioControl />
      <Label>Remix</Label>
    </Radio>
  </FieldGroup>
</RadioGroup>
```

## RadioGroup cards

The whole card is the hit area: put `RadioIndicator` and `FieldContent` inside `RadioControl`.

```tsx
import {
  Description,
  FieldContent,
  FieldGroup,
  Label,
} from "@/components/ui/field"
import {
  Radio,
  RadioControl,
  RadioGroup,
  RadioIndicator,
} from "@/components/ui/radio-group"
```

```tsx
<RadioGroup defaultValue="pro" className="w-full max-w-xs">
  <Label>Subscription plan</Label>
  <FieldGroup>
    <Radio value="starter">
      <RadioControl>
        <RadioIndicator />
        <FieldContent>
          <Label>Starter · $0/mo</Label>
          <Description>1 project, community support</Description>
        </FieldContent>
      </RadioControl>
    </Radio>
    <Radio value="pro">
      <RadioControl>
        <RadioIndicator />
        <FieldContent>
          <Label>Pro · $12/mo</Label>
          <Description>Unlimited projects, priority support</Description>
        </FieldContent>
      </RadioControl>
    </Radio>
  </FieldGroup>
</RadioGroup>
```

## Switch

```tsx
import { Label } from "@/components/ui/field"
import { Switch, SwitchControl } from "@/components/ui/switch"
```

```tsx
<Switch defaultSelected>
  <SwitchControl />
  <Label>Focus mode</Label>
</Switch>
```

## Switch shorthand (string child)

```tsx
import { Switch } from "@/components/ui/switch"
```

```tsx
<Switch defaultSelected>Focus mode</Switch>
```

## Switch standalone (no label)

```tsx
import { Switch } from "@/components/ui/switch"
```

```tsx
<Switch aria-label="Focus mode" defaultSelected />
```

## Switch anatomy (indicator + thumb)

```tsx
import { Label } from "@/components/ui/field"
import {
  Switch,
  SwitchControl,
  SwitchIndicator,
  SwitchThumb,
} from "@/components/ui/switch"
```

```tsx
<Switch>
  <SwitchControl>
    <SwitchIndicator>
      <SwitchThumb />
    </SwitchIndicator>
  </SwitchControl>
  <Label>Focus mode</Label>
</Switch>
```

## Switch with description

```tsx
import { Description, Label } from "@/components/ui/field"
import { Switch, SwitchControl } from "@/components/ui/switch"
```

```tsx
<Switch defaultSelected>
  <SwitchControl />
  <div className="flex flex-col gap-1">
    <Label>Focus mode</Label>
    <Description>Silence notifications so you can stay in flow.</Description>
  </div>
</Switch>
```

## Switch row (content left, indicator right)

Settings-row layout: `FieldContent` then `SwitchIndicator` inside `SwitchControl`, so the whole row toggles.

```tsx
import { Description, FieldContent, Label } from "@/components/ui/field"
import { Switch, SwitchControl, SwitchIndicator } from "@/components/ui/switch"
```

```tsx
<Switch className="w-full">
  <SwitchControl>
    <FieldContent>
      <Label>Focus mode</Label>
      <Description>Silence notifications so you can stay in flow.</Description>
    </FieldContent>
    <SwitchIndicator />
  </SwitchControl>
</Switch>
```

## Switch sizes & states

```tsx
import { Label } from "@/components/ui/field"
import { Switch, SwitchControl } from "@/components/ui/switch"
```

```tsx
<Switch size="sm" defaultSelected><SwitchControl /></Switch>
<Switch size="md" defaultSelected><SwitchControl /></Switch>
<Switch size="lg" defaultSelected><SwitchControl /></Switch>
<Switch isDisabled defaultSelected>
  <SwitchControl />
  <Label>Focus mode</Label>
</Switch>
<Switch defaultSelected isReadOnly>
  <SwitchControl />
  <Label>Focus mode</Label>
</Switch>
```

## Switch controlled

```tsx
import React from "react"

import { Label } from "@/components/ui/field"
import { Switch, SwitchControl } from "@/components/ui/switch"
```

```tsx
const [isSelected, setSelected] = React.useState(true)

<Switch isSelected={isSelected} onChange={setSelected}>
  <SwitchControl />
  <Label>Focus mode</Label>
</Switch>
```

## Switch settings list in a Fieldset

```tsx
import {
  Description,
  FieldContent,
  Fieldset,
  Label,
  Legend,
} from "@/components/ui/field"
import { Switch, SwitchControl, SwitchIndicator } from "@/components/ui/switch"
```

```tsx
const channels = [
  { label: "Email", description: "Updates sent to your inbox.", defaultSelected: true },
  { label: "SMS", description: "Text messages for urgent items.", defaultSelected: false },
]

<Fieldset className="w-full max-w-sm">
  <Legend>Notifications</Legend>
  <div className="flex flex-col gap-3">
    {channels.map((channel) => (
      <Switch key={channel.label} className="w-full" defaultSelected={channel.defaultSelected}>
        <SwitchControl>
          <FieldContent>
            <Label>{channel.label}</Label>
            <Description>{channel.description}</Description>
          </FieldContent>
          <SwitchIndicator />
        </SwitchControl>
      </Switch>
    ))}
  </div>
</Fieldset>
```

## Switch with Badge in label (feature flags)

```tsx
import { Badge } from "@/components/ui/badge"
import { Description, FieldContent, Label } from "@/components/ui/field"
import { Switch, SwitchControl, SwitchIndicator } from "@/components/ui/switch"
```

```tsx
<Switch className="w-full" defaultSelected>
  <SwitchControl>
    <FieldContent>
      <div className="flex items-center gap-2">
        <Label className="font-mono">ai-suggestions</Label>
        <Badge appearance="subtle" variant="info" size="sm">
          Beta
        </Badge>
      </div>
      <Description>Inline AI completions in the editor.</Description>
    </FieldContent>
    <SwitchIndicator />
  </SwitchControl>
</Switch>
```

## Slider

```tsx
import { Slider, SliderControl } from "@/components/ui/slider"
```

```tsx
<Slider aria-label="Opacity" defaultValue={50}>
  <SliderControl />
</Slider>
```

## Slider with label, output and description

```tsx
import { Description, Label } from "@/components/ui/field"
import { Slider, SliderControl, SliderOutput } from "@/components/ui/slider"
```

```tsx
<Slider defaultValue={50}>
  <div className="flex items-center justify-between">
    <Label>Opacity</Label>
    <SliderOutput />
  </div>
  <SliderControl />
  <Description>Adjust the background opacity.</Description>
</Slider>
```

## Slider anatomy (track, fill, thumb, icons)

```tsx
import { Volume1Icon, Volume2Icon } from "@/components/icons"
import { Description, Label } from "@/components/ui/field"
import {
  Slider,
  SliderControl,
  SliderFill,
  SliderOutput,
  SliderThumb,
  SliderTrack,
} from "@/components/ui/slider"
```

```tsx
<Slider defaultValue={50} className="flex flex-col gap-2">
  <div className="flex items-center justify-between gap-2">
    <Label>Volume</Label>
    <SliderOutput />
  </div>
  <div className="flex items-center gap-2">
    <Volume1Icon />
    <SliderControl>
      <SliderTrack>
        <SliderFill />
      </SliderTrack>
      <SliderThumb />
    </SliderControl>
    <Volume2Icon />
  </div>
  <Description>Adjust the volume.</Description>
</Slider>
```

## Slider range (two thumbs)

An array `defaultValue` renders one thumb per value.

```tsx
import { Label } from "@/components/ui/field"
import { Slider, SliderControl, SliderOutput } from "@/components/ui/slider"
```

```tsx
<Slider defaultValue={[200, 300]} minValue={100} maxValue={500}>
  <div className="flex items-center justify-between">
    <Label>Price Range</Label>
    <SliderOutput />
  </div>
  <SliderControl />
</Slider>
```

## Slider min/max/step

```tsx
import { Label } from "@/components/ui/field"
import { Slider, SliderControl } from "@/components/ui/slider"
```

```tsx
<Slider minValue={0} maxValue={100} step={5} defaultValue={50}>
  <Label>Opacity</Label>
  <SliderControl />
</Slider>
```

## Slider format options

```tsx
import { Label } from "@/components/ui/field"
import { Slider, SliderControl, SliderOutput } from "@/components/ui/slider"
```

```tsx
<Slider formatOptions={{ style: "currency", currency: "JPY" }} defaultValue={60}>
  <div className="flex items-center justify-between">
    <Label>Price</Label>
    <SliderOutput />
  </div>
  <SliderControl />
</Slider>
```

## Slider custom output (render prop)

```tsx
import { Label } from "@/components/ui/field"
import { Slider, SliderControl, SliderOutput } from "@/components/ui/slider"
```

```tsx
<Slider defaultValue={50}>
  <div className="flex items-center justify-between">
    <Label>Donuts to buy</Label>
    <SliderOutput>
      {({ state }) => `${state.values[0]} of 100 Donuts`}
    </SliderOutput>
  </div>
  <SliderControl />
</Slider>
```

## Slider vertical

```tsx
import { Slider, SliderControl } from "@/components/ui/slider"
```

```tsx
<Slider defaultValue={50} aria-label="Opacity" orientation="vertical" className="w-8">
  <SliderControl />
</Slider>
```

## Slider disabled

```tsx
import { Label } from "@/components/ui/field"
import { Slider, SliderControl } from "@/components/ui/slider"
```

```tsx
<Slider defaultValue={50} isDisabled>
  <Label>Opacity</Label>
  <SliderControl />
</Slider>
```

## Slider controlled

```tsx
import React from "react"

import { Label } from "@/components/ui/field"
import { Slider, SliderControl } from "@/components/ui/slider"
```

```tsx
const [value, setValue] = React.useState(50)

<Slider value={value} onChange={(value) => setValue(value as number)}>
  <Label>Opacity</Label>
  <SliderControl />
</Slider>
```

## TagGroup

```tsx
import { Label } from "@/components/ui/field"
import { Tag, TagGroup, TagList } from "@/components/ui/tag-group"
```

```tsx
<TagGroup>
  <Label>Categories</Label>
  <TagList>
    <Tag>News</Tag>
    <Tag>Travel</Tag>
    <Tag>Gaming</Tag>
    <Tag>Shopping</Tag>
  </TagList>
</TagGroup>
```

## TagGroup from items (dynamic collection)

```tsx
import { Label } from "@/components/ui/field"
import { Tag, TagGroup, TagList } from "@/components/ui/tag-group"
```

```tsx
const items = [
  { id: 1, name: "News" },
  { id: 2, name: "Travel" },
]

<TagGroup>
  <Label>Categories</Label>
  <TagList items={items}>{(item) => <Tag>{item.name}</Tag>}</TagList>
</TagGroup>
```

## TagGroup single selection

```tsx
import { Label } from "@/components/ui/field"
import { Tag, TagGroup, TagList } from "@/components/ui/tag-group"
```

```tsx
<TagGroup selectionMode="single" defaultSelectedKeys={["chocolate"]}>
  <Label>Favorite ice cream flavor</Label>
  <TagList>
    <Tag id="chocolate">Chocolate</Tag>
    <Tag id="mint">Mint</Tag>
    <Tag id="strawberry">Strawberry</Tag>
  </TagList>
</TagGroup>
```

## TagGroup multiple selection

```tsx
import { Label } from "@/components/ui/field"
import { Tag, TagGroup, TagList } from "@/components/ui/tag-group"
```

```tsx
<TagGroup selectionMode="multiple" defaultSelectedKeys={["news", "gaming"]}>
  <Label>Categories</Label>
  <TagList>
    <Tag id="news">News</Tag>
    <Tag id="travel">Travel</Tag>
    <Tag id="gaming">Gaming</Tag>
  </TagList>
</TagGroup>
```

## TagGroup disabled keys

```tsx
import { Label } from "@/components/ui/field"
import { Tag, TagGroup, TagList } from "@/components/ui/tag-group"
```

```tsx
<TagGroup selectionMode="multiple" disabledKeys={["gaming"]}>
  <Label>Categories</Label>
  <TagList>
    <Tag id="news">News</Tag>
    <Tag id="gaming">Gaming</Tag>
  </TagList>
</TagGroup>
```

## TagGroup removable

Passing `onRemove` renders a remove button inside each Tag.

```tsx
import * as React from "react"

import { Label } from "@/components/ui/field"
import { Tag, TagGroup, TagList } from "@/components/ui/tag-group"
```

```tsx
const [items, setItems] = React.useState([
  { id: 1, name: "News" },
  { id: 2, name: "Travel" },
  { id: 3, name: "Gaming" },
])

<TagGroup
  onRemove={(keys) =>
    setItems((prev) => prev.filter((item) => !keys.has(item.id)))
  }
>
  <Label>Categories</Label>
  <TagList items={items}>{(item) => <Tag>{item.name}</Tag>}</TagList>
</TagGroup>
```

## TagGroup empty state

```tsx
import { Label } from "@/components/ui/field"
import { Tag, TagGroup, TagList } from "@/components/ui/tag-group"
```

```tsx
<TagGroup>
  <Label>Filters</Label>
  <TagList<{ id: string; name: string }>
    items={[]}
    renderEmptyState={() => "No filters applied."}
  >
    {(item) => <Tag>{item.name}</Tag>}
  </TagList>
</TagGroup>
```

## Tag with icon

Non-string children need an explicit `textValue`.

```tsx
import { BookmarkIcon, FlameIcon, TagIcon } from "lucide-react"

import { Label } from "@/components/ui/field"
import { Tag, TagGroup, TagList } from "@/components/ui/tag-group"
```

```tsx
<TagGroup>
  <Label>Topics</Label>
  <TagList>
    <Tag textValue="General">
      <TagIcon /> General
    </Tag>
    <Tag textValue="Trending">
      <FlameIcon /> Trending
    </Tag>
    <Tag textValue="Saved">
      <BookmarkIcon /> Saved
    </Tag>
  </TagList>
</TagGroup>
```

## Tag links

```tsx
import { Label } from "@/components/ui/field"
import { Tag, TagGroup, TagList } from "@/components/ui/tag-group"
```

```tsx
<TagGroup>
  <Label>Tags</Label>
  <TagList>
    <Tag href="https://react-spectrum.adobe.com/" target="_blank">
      React Aria
    </Tag>
    <Tag href="https://tailwindcss.com" target="_blank">
      Tailwind
    </Tag>
  </TagList>
</TagGroup>
```

## TagGroup sizes

```tsx
import { Label } from "@/components/ui/field"
import { Tag, TagGroup, TagList } from "@/components/ui/tag-group"
```

```tsx
<TagGroup size="sm">
  <Label>Small</Label>
  <TagList>
    <Tag>News</Tag>
    <Tag>Travel</Tag>
  </TagList>
</TagGroup>
<TagGroup size="md">{/* ... */}</TagGroup>
<TagGroup size="lg">{/* ... */}</TagGroup>
```

## TagGroup inside a multiple Combobox (tags in the input)

Selected items render as removable tags inside the `InputGroup`, before the `Input`.

```tsx
import { Combobox, ComboboxValue } from "@/components/ui/combobox"
import { Label } from "@/components/ui/field"
import { Input, InputGroup } from "@/components/ui/input"
import { ListBox, ListBoxItem } from "@/components/ui/list-box"
import { Popover } from "@/components/ui/popover"
import { Tag, TagGroup, TagList } from "@/components/ui/tag-group"
```

```tsx
const frameworks = [
  { id: "react", name: "React" },
  { id: "vue", name: "Vue" },
  { id: "svelte", name: "Svelte" },
]
type Framework = (typeof frameworks)[number]

<Combobox<Framework, "multiple"> selectionMode="multiple" defaultValue={["react", "vue"]}>
  <Label>Frameworks</Label>
  <InputGroup>
    <ComboboxValue<Framework>>
      {({ selectedItems, state }) => (
        <TagGroup
          aria-label="Selected frameworks"
          onRemove={(keys) => {
            if (Array.isArray(state.value)) {
              state.setValue(state.value.filter((k) => !keys.has(k)))
            }
          }}
        >
          <TagList items={selectedItems.filter((item) => item != null)}>
            {(item) => <Tag>{item.name}</Tag>}
          </TagList>
        </TagGroup>
      )}
    </ComboboxValue>
    <Input />
  </InputGroup>
  <Popover>
    <ListBox items={frameworks}>
      {(item) => <ListBoxItem id={item.id}>{item.name}</ListBoxItem>}
    </ListBox>
  </Popover>
</Combobox>
```

## TagGroup below a multiple Combobox (tags outside the input)

Same wiring, with the `ComboboxValue` placed after the `InputGroup` and a chevron addon button.

```tsx
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Combobox, ComboboxValue } from "@/components/ui/combobox"
import { Label } from "@/components/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { ListBox, ListBoxItem } from "@/components/ui/list-box"
import { Popover } from "@/components/ui/popover"
import { Tag, TagGroup, TagList } from "@/components/ui/tag-group"
```

```tsx
<Combobox<Framework, "multiple"> selectionMode="multiple" defaultValue={["react", "vue"]}>
  <Label>Frameworks</Label>
  <InputGroup>
    <Input placeholder="Select frameworks" />
    <InputGroupAddon>
      <Button variant="quiet" isIconOnly>
        <ChevronDownIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <ComboboxValue<Framework>>
    {({ selectedItems, state }) => (
      <TagGroup
        aria-label="Selected frameworks"
        onRemove={(keys) => {
          if (Array.isArray(state.value)) {
            state.setValue(state.value.filter((k) => !keys.has(k)))
          }
        }}
      >
        <TagList items={selectedItems.filter((item) => item != null)}>
          {(item) => <Tag>{item.name}</Tag>}
        </TagList>
      </TagGroup>
    )}
  </ComboboxValue>
  <Popover>
    <ListBox items={frameworks}>
      {(item) => <ListBoxItem id={item.id}>{item.name}</ListBoxItem>}
    </ListBox>
  </Popover>
</Combobox>
```

## Tabs

```tsx
import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/tabs"
```

```tsx
<Tabs>
  <TabList>
    <Tab id="overview">Overview</Tab>
    <Tab id="usage">Usage</Tab>
    <Tab id="settings">Settings</Tab>
  </TabList>
  <TabPanel id="overview">Overview content</TabPanel>
  <TabPanel id="usage">Usage content</TabPanel>
  <TabPanel id="settings">Settings content</TabPanel>
</Tabs>
```

## Tabs line variant

`variant` lives on `TabList` ("default" | "line").

```tsx
import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/tabs"
```

```tsx
<Tabs>
  <TabList variant="line">
    <Tab id="overview">Overview</Tab>
    <Tab id="usage">Usage</Tab>
    <Tab id="settings">Settings</Tab>
  </TabList>
  <TabPanel id="overview">Overview content</TabPanel>
  <TabPanel id="usage">Usage content</TabPanel>
  <TabPanel id="settings">Settings content</TabPanel>
</Tabs>
```

## Tabs vertical

```tsx
import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/tabs"
```

```tsx
<Tabs orientation="vertical">
  <TabList>
    <Tab id="overview">Overview</Tab>
    <Tab id="usage">Usage</Tab>
    <Tab id="settings">Settings</Tab>
  </TabList>
  <TabPanel id="overview">Overview content</TabPanel>
  <TabPanel id="usage">Usage content</TabPanel>
  <TabPanel id="settings">Settings content</TabPanel>
</Tabs>
```

## Tabs disabled (whole group or single tab)

```tsx
import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/tabs"
```

```tsx
<Tabs isDisabled>
  <TabList>
    <Tab id="overview">Overview</Tab>
    <Tab id="usage">Usage</Tab>
  </TabList>
  <TabPanel id="overview">Overview content</TabPanel>
  <TabPanel id="usage">Usage content</TabPanel>
</Tabs>
<Tabs>
  <TabList>
    <Tab id="overview">Overview</Tab>
    <Tab id="settings" isDisabled>
      Settings
    </Tab>
  </TabList>
  <TabPanel id="overview">Overview content</TabPanel>
  <TabPanel id="settings">Settings content</TabPanel>
</Tabs>
```

## Tabs manual keyboard activation

```tsx
import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/tabs"
```

```tsx
<Tabs keyboardActivation="manual">
  <TabList>
    <Tab id="overview">Overview</Tab>
    <Tab id="usage">Usage</Tab>
  </TabList>
  <TabPanel id="overview">Overview content</TabPanel>
  <TabPanel id="usage">Usage content</TabPanel>
</Tabs>
```

## Tabs controlled

```tsx
import React from "react"
import type { Key } from "react-aria-components"

import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/tabs"
```

```tsx
const [selectedTab, setSelectedTab] = React.useState<Key>("overview")

<Tabs selectedKey={selectedTab} onSelectionChange={setSelectedTab}>
  <TabList>
    <Tab id="overview">Overview</Tab>
    <Tab id="usage">Usage</Tab>
    <Tab id="settings">Settings</Tab>
  </TabList>
  <TabPanel id="overview">Overview content</TabPanel>
  <TabPanel id="usage">Usage content</TabPanel>
  <TabPanel id="settings">Settings content</TabPanel>
</Tabs>
```

## Tabs as links (router navigation)

```tsx
import { Tab, TabList, Tabs } from "@/components/ui/tabs"
```

```tsx
<Tabs>
  <TabList>
    <Tab id="overview" href="/overview">Overview</Tab>
    <Tab id="usage" href="/usage">Usage</Tab>
  </TabList>
</Tabs>
```

## Tabs settings panel (form controls inside panels)

```tsx
import { Checkbox, CheckboxControl } from "@/components/ui/checkbox"
import { Description, FieldContent, Label } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { Switch, SwitchControl, SwitchIndicator } from "@/components/ui/switch"
import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/tabs"
```

```tsx
<Tabs className="w-full max-w-sm">
  <TabList>
    <Tab id="general">General</Tab>
    <Tab id="personalization">Personalization</Tab>
  </TabList>
  <TabPanel id="general">
    <div className="flex flex-col gap-4">
      <Select defaultSelectedKey="utc" placeholder="Select a timezone">
        <Label>Timezone</Label>
        <SelectTrigger />
        <SelectContent>
          <SelectItem id="utc">UTC</SelectItem>
          <SelectItem id="cet">Central European Time</SelectItem>
        </SelectContent>
      </Select>
      <Switch className="w-full" defaultSelected>
        <SwitchControl>
          <FieldContent>
            <Label>Auto-save</Label>
            <Description>Save changes as you type.</Description>
          </FieldContent>
          <SwitchIndicator />
        </SwitchControl>
      </Switch>
    </div>
  </TabPanel>
  <TabPanel id="personalization">
    <Checkbox defaultSelected>
      <CheckboxControl />
      <Label>Reduce motion</Label>
    </Checkbox>
  </TabPanel>
</Tabs>
```

## Tabs in a card (product details)

```tsx
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/tabs"
```

```tsx
<div className="w-full max-w-sm rounded-lg border bg-bg p-4">
  <div className="mb-3 flex items-start justify-between gap-2">
    <div>
      <h3 className="text-sm font-semibold text-fg">Aero Runner</h3>
      <p className="text-sm text-fg-muted">$129.00</p>
    </div>
    <Badge variant="success" appearance="subtle">In stock</Badge>
  </div>
  <Tabs>
    <TabList variant="line">
      <Tab id="description">Description</Tab>
      <Tab id="specs">Specs</Tab>
      <Tab id="reviews">Reviews</Tab>
    </TabList>
    <TabPanel id="description">
      <p className="text-sm text-fg-muted">Lightweight trainers built for daily mileage.</p>
    </TabPanel>
    <TabPanel id="specs">
      <dl className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-fg-muted">Weight</dt>
          <dd className="text-fg">238 g</dd>
        </div>
      </dl>
    </TabPanel>
    <TabPanel id="reviews">
      <span className="text-sm text-fg-muted">4.0 (128 reviews)</span>
    </TabPanel>
  </Tabs>
  <Button variant="primary" className="mt-4 w-full">Add to cart</Button>
</div>
```

# Pickers

## Select

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
```

```tsx
<Select className="w-52" aria-label="Provider">
  <SelectTrigger />
  <SelectContent>
    <SelectItem id="perplexity">Perplexity</SelectItem>
    <SelectItem id="replicate">Replicate</SelectItem>
    <SelectItem id="together-ai">Together AI</SelectItem>
    <SelectItem id="eleven-labs">ElevenLabs</SelectItem>
  </SelectContent>
</Select>
```

## Select with label and description

```tsx
import { Description, Label } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
```

```tsx
<Select className="w-52">
  <Label>Provider</Label>
  <SelectTrigger />
  <SelectContent>
    <SelectItem>Perplexity</SelectItem>
    <SelectItem>Replicate</SelectItem>
    <SelectItem>Together AI</SelectItem>
  </SelectContent>
  <Description>Please select a provider.</Description>
</Select>
```

## Select with placeholder

`SelectTrigger` renders `SelectValue` by default; pass it explicitly to customize the trigger content.

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
```

```tsx
<Select className="w-52" aria-label="Provider" placeholder="Select a provider">
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem>Perplexity</SelectItem>
    <SelectItem>Replicate</SelectItem>
  </SelectContent>
</Select>
```

## Select with sections

```tsx
import { Label } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSection,
  SelectSectionHeader,
  SelectTrigger,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
```

```tsx
<Select className="w-52">
  <Label>Model</Label>
  <SelectTrigger />
  <SelectContent>
    <SelectSection>
      <SelectSectionHeader>OpenAI</SelectSectionHeader>
      <SelectItem>GPT-4o</SelectItem>
      <SelectItem>GPT-4 Turbo</SelectItem>
    </SelectSection>
    <Separator />
    <SelectSection>
      <SelectSectionHeader>Google</SelectSectionHeader>
      <SelectItem>Gemini 1.5 Flash</SelectItem>
      <SelectItem>Gemini 1.5 Pro</SelectItem>
    </SelectSection>
  </SelectContent>
</Select>
```

## Select multiple

Pass the `"multiple"` type param on `Select` and `selectionMode="multiple"` on `SelectContent`.

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
```

```tsx
<Select<object, "multiple"> className="w-52" aria-label="Provider">
  <SelectTrigger />
  <SelectContent selectionMode="multiple">
    <SelectItem id="perplexity">Perplexity</SelectItem>
    <SelectItem id="replicate">Replicate</SelectItem>
    <SelectItem id="together-ai">Together AI</SelectItem>
  </SelectContent>
</Select>
```

## Select uncontrolled

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
```

```tsx
<Select className="w-52" aria-label="Provider" defaultSelectedKey="eleven-labs">
  <SelectTrigger />
  <SelectContent>
    <SelectItem id="perplexity">Perplexity</SelectItem>
    <SelectItem id="replicate">Replicate</SelectItem>
    <SelectItem id="eleven-labs">ElevenLabs</SelectItem>
  </SelectContent>
</Select>
```

## Select controlled

```tsx
import React from "react"
import type { Key } from "react-aria-components/Menu"

import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
```

```tsx
const [provider, setProvider] = React.useState<Key | null>("eleven-labs")

<Select aria-label="Provider" value={provider} onChange={setProvider}>
  <SelectTrigger />
  <SelectContent>
    <SelectItem id="perplexity">Perplexity</SelectItem>
    <SelectItem id="replicate">Replicate</SelectItem>
    <SelectItem id="eleven-labs">ElevenLabs</SelectItem>
  </SelectContent>
</Select>
```

## Select with dynamic items

```tsx
import { Label } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
```

```tsx
const placements = ["bottom", "top", "left", "right"].map((pos) => ({ id: pos, label: pos }))

<Select defaultValue="top" onChange={(key) => setPlacement(key)}>
  <Label>Placement</Label>
  <SelectTrigger />
  <SelectContent items={placements}>
    {(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}
  </SelectContent>
</Select>
```

## Select with links

```tsx
import { Label } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
```

```tsx
<Select className="w-52">
  <Label>Project</Label>
  <SelectTrigger />
  <SelectContent>
    <SelectItem href="#">create new registry...</SelectItem>
    <SelectItem href="https://dotui.org">dotUI</SelectItem>
    <SelectItem href="https://coss.com/ui">coss/ui</SelectItem>
  </SelectContent>
</Select>
```

## Select loading

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
```

```tsx
<Select className="w-52" aria-label="Provider">
  <SelectTrigger />
  <SelectContent isLoading>
    <SelectItem>Perplexity</SelectItem>
    <SelectItem>Replicate</SelectItem>
  </SelectContent>
</Select>
```

## Select async loading

```tsx
import { useAsyncList } from "react-stately"

import { Loader } from "@/components/ui/loader"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
```

```tsx
const list = useAsyncList<{ name: string }>({
  async load({ signal, cursor }) {
    const res = await fetch(cursor || "https://pokeapi.co/api/v2/pokemon", { signal })
    const json = await res.json()
    return { items: json.results, cursor: json.next }
  },
})

<Select className="w-52" aria-label="Pokemon">
  <SelectTrigger />
  <SelectContent
    className="max-h-64 overflow-auto overscroll-none"
    items={list.items}
    isLoading={list.loadingState === "loadingMore"}
    onLoadMore={list.loadMore}
    renderEmptyState={() => (
      <div className="flex items-center justify-center py-4">
        <Loader />
      </div>
    )}
  >
    {(item) => (
      <SelectItem id={item.name} className="capitalize">
        {item.name}
      </SelectItem>
    )}
  </SelectContent>
</Select>
```

## Select virtualized

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
```

```tsx
const items = Array.from({ length: 1000 }, (_, i) => ({ id: `item-${i + 1}`, name: `Item ${i + 1}` }))

<Select className="w-52" aria-label="Item">
  <SelectTrigger />
  <SelectContent virtulized items={items} className="h-80">
    {(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
  </SelectContent>
</Select>
```

## Select validation

```tsx
import { FieldError, Label } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
```

```tsx
<Select className="w-52" isRequired isInvalid>
  <Label>Provider</Label>
  <SelectTrigger />
  <SelectContent>
    <SelectItem>Perplexity</SelectItem>
    <SelectItem>Replicate</SelectItem>
  </SelectContent>
  <FieldError>Please select an item in the list.</FieldError>
</Select>
```

## Select disabled

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
```

```tsx
<Select className="w-52" aria-label="Provider" isDisabled>
  <SelectTrigger />
  <SelectContent>
    <SelectItem>Perplexity</SelectItem>
    <SelectItem>Replicate</SelectItem>
  </SelectContent>
</Select>
```

## Select composed from primitives

Drop the `SelectTrigger`/`SelectContent` wrappers and compose `Button`, `Popover` and `ListBox` directly.

```tsx
import { ChevronDownIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from "@/components/ui/list-box"
import { Popover } from "@/components/ui/popover"
import { Select, SelectValue } from "@/components/ui/select"
```

```tsx
<Select placeholder="Select provider">
  <Button variant="secondary">
    <SelectValue />
    <ChevronDownIcon className="ml-auto" />
  </Button>
  <Popover placement="bottom start">
    <ListBox>
      <ListBoxSection>
        <ListBoxSectionHeader>AI Providers</ListBoxSectionHeader>
        <ListBoxItem id="openai">OpenAI</ListBoxItem>
        <ListBoxItem id="anthropic">Anthropic</ListBoxItem>
      </ListBoxSection>
    </ListBox>
  </Popover>
</Select>
```

## Combobox

```tsx
import { ChevronDownIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { ListBox, ListBoxItem } from "@/components/ui/list-box"
import { Popover } from "@/components/ui/popover"
```

```tsx
<Combobox className="w-52" aria-label="country">
  <InputGroup>
    <Input placeholder="Select a country..." />
    <InputGroupAddon>
      <Button variant="quiet" isIconOnly>
        <ChevronDownIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Popover>
    <ListBox>
      <ListBoxItem>Canada</ListBoxItem>
      <ListBoxItem>France</ListBoxItem>
      <ListBoxItem>Germany</ListBoxItem>
      <ListBoxItem>Tunisia</ListBoxItem>
    </ListBox>
  </Popover>
</Combobox>
```

## Combobox with label and description

```tsx
import { ChevronDownIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
import { Description, Label } from "@/components/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { ListBox, ListBoxItem } from "@/components/ui/list-box"
import { Popover } from "@/components/ui/popover"
```

```tsx
<Combobox className="w-52">
  <Label>Country</Label>
  <InputGroup>
    <Input />
    <InputGroupAddon>
      <Button variant="quiet" isIconOnly>
        <ChevronDownIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Popover>
    <ListBox>
      <ListBoxItem>Canada</ListBoxItem>
      <ListBoxItem>France</ListBoxItem>
    </ListBox>
  </Popover>
  <Description>Please select a country.</Description>
</Combobox>
```

## Combobox uncontrolled

```tsx
import { ChevronDownIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { ListBox, ListBoxItem } from "@/components/ui/list-box"
import { Popover } from "@/components/ui/popover"
```

```tsx
<Combobox className="w-52" aria-label="country" defaultSelectedKey="tn">
  <InputGroup>
    <Input />
    <InputGroupAddon>
      <Button variant="quiet" isIconOnly>
        <ChevronDownIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Popover>
    <ListBox>
      <ListBoxItem id="ca">Canada</ListBoxItem>
      <ListBoxItem id="fr">France</ListBoxItem>
      <ListBoxItem id="tn">Tunisia</ListBoxItem>
    </ListBox>
  </Popover>
</Combobox>
```

## Combobox controlled

```tsx
import React from "react"
import type { Key } from "react-aria-components/Menu"

import { ChevronDownIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { ListBox, ListBoxItem } from "@/components/ui/list-box"
import { Popover } from "@/components/ui/popover"
```

```tsx
const [country, setCountry] = React.useState<Key | null>("tn")

<Combobox aria-label="country" selectedKey={country} onSelectionChange={setCountry}>
  <InputGroup>
    <Input />
    <InputGroupAddon>
      <Button variant="quiet" isIconOnly>
        <ChevronDownIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Popover>
    <ListBox>
      <ListBoxItem id="ca">Canada</ListBoxItem>
      <ListBoxItem id="fr">France</ListBoxItem>
      <ListBoxItem id="tn">Tunisia</ListBoxItem>
    </ListBox>
  </Popover>
</Combobox>
```

## Combobox with dynamic and disabled items

```tsx
import { ChevronDownIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { ListBox, ListBoxItem } from "@/components/ui/list-box"
import { Popover } from "@/components/ui/popover"
```

```tsx
const frameworks = [
  { id: "next", name: "Next.js" },
  { id: "sveltekit", name: "SvelteKit" },
  { id: "nuxt", name: "Nuxt.js" },
  { id: "remix", name: "Remix" },
]

<Combobox className="w-52" aria-label="framework" disabledKeys={["nuxt", "remix"]}>
  <InputGroup>
    <Input placeholder="Select a framework" />
    <InputGroupAddon>
      <Button variant="quiet" isIconOnly>
        <ChevronDownIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Popover>
    <ListBox items={frameworks}>
      {(item) => <ListBoxItem id={item.id}>{item.name}</ListBoxItem>}
    </ListBox>
  </Popover>
</Combobox>
```

## Combobox with sections

```tsx
import { ChevronDownIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from "@/components/ui/list-box"
import { Popover } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
```

```tsx
<Combobox className="w-52" aria-label="Country">
  <InputGroup>
    <Input placeholder="Select a country..." />
    <InputGroupAddon>
      <Button variant="quiet" isIconOnly>
        <ChevronDownIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Popover>
    <ListBox>
      <ListBoxSection>
        <ListBoxSectionHeader>Africa</ListBoxSectionHeader>
        <ListBoxItem>Tunisia</ListBoxItem>
        <ListBoxItem>Morocco</ListBoxItem>
      </ListBoxSection>
      <Separator className="my-1" />
      <ListBoxSection>
        <ListBoxSectionHeader>Europe</ListBoxSectionHeader>
        <ListBoxItem>France</ListBoxItem>
        <ListBoxItem>Germany</ListBoxItem>
      </ListBoxSection>
    </ListBox>
  </Popover>
</Combobox>
```

## Combobox with custom items

Items with rich content need a `textValue` for filtering.

```tsx
import { ChevronDownIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import {
  ListBox,
  ListBoxItem,
  ListBoxItemDescription,
  ListBoxItemLabel,
} from "@/components/ui/list-box"
import { Popover } from "@/components/ui/popover"
```

```tsx
const countries = [
  { code: "fr", id: "france", label: "France", continent: "Europe" },
  { code: "jp", id: "japan", label: "Japan", continent: "Asia" },
  { code: "tn", id: "tunisia", label: "Tunisia", continent: "Africa" },
]

<Combobox className="w-52" aria-label="country">
  <InputGroup>
    <Input placeholder="Search countries..." />
    <InputGroupAddon>
      <Button variant="quiet" isIconOnly>
        <ChevronDownIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Popover>
    <ListBox items={countries}>
      {(item) => (
        <ListBoxItem id={item.id} textValue={item.label}>
          <ListBoxItemLabel>{item.label}</ListBoxItemLabel>
          <ListBoxItemDescription>
            {item.continent} ({item.code})
          </ListBoxItemDescription>
        </ListBoxItem>
      )}
    </ListBox>
  </Popover>
</Combobox>
```

## Combobox with leading icon

```tsx
import { GlobeIcon } from "@/components/icons"
import { Combobox } from "@/components/ui/combobox"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { ListBox, ListBoxItem } from "@/components/ui/list-box"
import { Popover } from "@/components/ui/popover"
```

```tsx
<Combobox className="w-52" aria-label="Timezone">
  <InputGroup>
    <InputGroupAddon>
      <GlobeIcon />
    </InputGroupAddon>
    <Input placeholder="Select a timezone" />
  </InputGroup>
  <Popover>
    <ListBox>
      <ListBoxItem>(GMT-5) New York</ListBoxItem>
      <ListBoxItem>(GMT+0) London</ListBoxItem>
      <ListBoxItem>(GMT+9) Tokyo</ListBoxItem>
    </ListBox>
  </Popover>
</Combobox>
```

## Combobox custom value

```tsx
import { ChevronDownIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { ListBox, ListBoxItem } from "@/components/ui/list-box"
import { Popover } from "@/components/ui/popover"
```

```tsx
<Combobox className="w-52" aria-label="country" allowsCustomValue>
  <InputGroup>
    <Input />
    <InputGroupAddon>
      <Button variant="quiet" isIconOnly>
        <ChevronDownIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Popover>
    <ListBox>
      <ListBoxItem>Canada</ListBoxItem>
      <ListBoxItem>France</ListBoxItem>
    </ListBox>
  </Popover>
</Combobox>
```

## Combobox loading

```tsx
import { ChevronDownIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { ListBox, ListBoxItem } from "@/components/ui/list-box"
import { Popover } from "@/components/ui/popover"
```

```tsx
<Combobox className="w-52" aria-label="Animal">
  <InputGroup>
    <Input />
    <InputGroupAddon>
      <Button variant="quiet" isIconOnly>
        <ChevronDownIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Popover>
    <ListBox isLoading>
      <ListBoxItem>Red Panda</ListBoxItem>
      <ListBoxItem>Cat</ListBoxItem>
    </ListBox>
  </Popover>
</Combobox>
```

## Combobox async loading

```tsx
import { useAsyncList } from "react-stately"

import { ChevronDownIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
import { Label } from "@/components/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { ListBox, ListBoxItem } from "@/components/ui/list-box"
import { Popover } from "@/components/ui/popover"
```

```tsx
const list = useAsyncList<{ name: string }>({
  async load({ signal }) {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon", { signal })
    const json = await res.json()
    return { items: json.results }
  },
})

<Combobox className="w-52">
  <Label>Pokemon</Label>
  <InputGroup>
    <Input />
    <InputGroupAddon>
      <Button variant="quiet" isIconOnly>
        <ChevronDownIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Popover>
    <ListBox items={list.items} isLoading={list.isLoading}>
      {(item) => <ListBoxItem id={item.name}>{item.name}</ListBoxItem>}
    </ListBox>
  </Popover>
</Combobox>
```

## Combobox large list (virtualized)

```tsx
import { ChevronDownIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { ListBox, ListBoxItem, ListBoxVirtualizer } from "@/components/ui/list-box"
import { Popover } from "@/components/ui/popover"
```

```tsx
const items = Array.from({ length: 1000 }, (_, i) => ({ id: `item-${i + 1}`, name: `Item ${i + 1}` }))

<Combobox className="w-52" aria-label="item">
  <InputGroup>
    <Input placeholder="Search from 1000 items" />
    <InputGroupAddon>
      <Button variant="quiet" isIconOnly>
        <ChevronDownIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Popover className="w-auto p-0">
    <ListBoxVirtualizer>
      <ListBox items={items} className="h-80 w-48 p-0">
        {(item) => <ListBoxItem id={item.id}>{item.name}</ListBoxItem>}
      </ListBox>
    </ListBoxVirtualizer>
  </Popover>
</Combobox>
```

## Combobox multiple selection

Selected items render as a `TagGroup` inside `ComboboxValue`; the value is an array of keys.

```tsx
import { Combobox, ComboboxValue } from "@/components/ui/combobox"
import { Label } from "@/components/ui/field"
import { Input, InputGroup } from "@/components/ui/input"
import { ListBox, ListBoxItem } from "@/components/ui/list-box"
import { Popover } from "@/components/ui/popover"
import { Tag, TagGroup, TagList } from "@/components/ui/tag-group"
```

```tsx
const frameworks = [
  { id: "next", name: "Next.js" },
  { id: "sveltekit", name: "SvelteKit" },
  { id: "astro", name: "Astro" },
]
type Framework = (typeof frameworks)[number]

<Combobox<Framework, "multiple"> className="w-52" selectionMode="multiple" defaultValue={["next"]}>
  <Label>Frameworks</Label>
  <InputGroup>
    <ComboboxValue<Framework>>
      {({ selectedItems, state }) => (
        <TagGroup
          aria-label="Selected frameworks"
          onRemove={(keys) => {
            if (Array.isArray(state.value)) {
              state.setValue(state.value.filter((k) => !keys.has(k)))
            }
          }}
        >
          <TagList items={selectedItems.filter((item) => item != null)}>
            {(item) => <Tag>{item.name}</Tag>}
          </TagList>
        </TagGroup>
      )}
    </ComboboxValue>
    <Input placeholder="Select frameworks" />
  </InputGroup>
  <Popover>
    <ListBox items={frameworks}>
      {(item) => <ListBoxItem id={item.id}>{item.name}</ListBoxItem>}
    </ListBox>
  </Popover>
</Combobox>
```

## Combobox validation

```tsx
import { ChevronDownIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
import { FieldError, Label } from "@/components/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { ListBox, ListBoxItem } from "@/components/ui/list-box"
import { Popover } from "@/components/ui/popover"
```

```tsx
<Combobox className="w-52" isRequired isInvalid>
  <Label>Country</Label>
  <InputGroup>
    <Input placeholder="Select a country..." />
    <InputGroupAddon>
      <Button variant="quiet" isIconOnly>
        <ChevronDownIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <FieldError>Please select a country in the list.</FieldError>
  <Popover>
    <ListBox>
      <ListBoxItem>Canada</ListBoxItem>
      <ListBoxItem>France</ListBoxItem>
    </ListBox>
  </Popover>
</Combobox>
```

## Combobox disabled

```tsx
import { ChevronDownIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { ListBox, ListBoxItem } from "@/components/ui/list-box"
import { Popover } from "@/components/ui/popover"
```

```tsx
<Combobox className="w-52" aria-label="Animal" isDisabled>
  <InputGroup>
    <Input placeholder="Select an animal..." />
    <InputGroupAddon>
      <Button variant="quiet" isIconOnly>
        <ChevronDownIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Popover>
    <ListBox>
      <ListBoxItem id="cat">Cat</ListBoxItem>
      <ListBoxItem id="dog">Dog</ListBoxItem>
    </ListBox>
  </Popover>
</Combobox>
```

## Combobox in a form

```tsx
import * as FormPrimitives from "react-aria-components/Form"

import { ChevronDownIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Combobox } from "@/components/ui/combobox"
import { Label } from "@/components/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { ListBox, ListBoxItem } from "@/components/ui/list-box"
import { Popover } from "@/components/ui/popover"
```

```tsx
<Card className="w-52">
  <CardContent>
    <FormPrimitives.Form
      id="form-with-combobox"
      onSubmit={(e) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        alert(`You selected ${data.get("framework")}.`)
      }}
    >
      <Combobox name="framework" isRequired>
        <Label>Framework</Label>
        <InputGroup>
          <Input placeholder="Select a framework" />
          <InputGroupAddon>
            <Button variant="quiet" isIconOnly>
              <ChevronDownIcon />
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <Popover>
          <ListBox items={["Next.js", "Remix", "Astro"].map((id) => ({ id }))}>
            {(item) => <ListBoxItem id={item.id}>{item.id}</ListBoxItem>}
          </ListBox>
        </Popover>
      </Combobox>
    </FormPrimitives.Form>
  </CardContent>
  <CardFooter>
    <Button type="submit" form="form-with-combobox">
      Submit
    </Button>
  </CardFooter>
</Card>
```

## Combobox in dialog (responsive modal/drawer)

```tsx
import { ChevronDownIcon } from "@/components/icons"
import { Responsive } from "@/lib/responsive"
import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Drawer } from "@/components/ui/drawer"
import { Label } from "@/components/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { ListBox, ListBoxItem } from "@/components/ui/list-box"
import { Modal } from "@/components/ui/modal"
import { Popover } from "@/components/ui/popover"
```

```tsx
<Dialog>
  <Button variant="secondary">Open Dialog</Button>
  <Responsive
    render={(isMobile) => {
      const content = (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Framework</DialogTitle>
            <DialogDescription>Choose your preferred framework.</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <Combobox>
              <Label>Framework</Label>
              <InputGroup>
                <Input placeholder="Select a framework" />
                <InputGroupAddon>
                  <Button variant="quiet" isIconOnly>
                    <ChevronDownIcon />
                  </Button>
                </InputGroupAddon>
              </InputGroup>
              <Popover>
                <ListBox>
                  <ListBoxItem>Next.js</ListBoxItem>
                  <ListBoxItem>SvelteKit</ListBoxItem>
                  <ListBoxItem>Astro</ListBoxItem>
                </ListBox>
              </Popover>
            </Combobox>
          </DialogBody>
          <DialogFooter>
            <Button slot="close">Cancel</Button>
            <Button slot="close" variant="primary">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      )
      return isMobile ? <Drawer>{content}</Drawer> : <Modal>{content}</Modal>
    }}
  />
</Dialog>
```

## Combobox popover placement

```tsx
import { ChevronUpIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { ListBox, ListBoxItem } from "@/components/ui/list-box"
import { Popover } from "@/components/ui/popover"
```

```tsx
<Combobox aria-label="framework top">
  <InputGroup className="w-32">
    <Input placeholder="top" />
    <InputGroupAddon>
      <Button variant="quiet" isIconOnly>
        <ChevronUpIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Popover placement="top">
    <ListBox>
      <ListBoxItem>Next.js</ListBoxItem>
      <ListBoxItem>Remix</ListBoxItem>
    </ListBox>
  </Popover>
</Combobox>
```

## ListBox

```tsx
import { ListBox, ListBoxItem } from "@/components/ui/list-box"
```

```tsx
<ListBox aria-label="Framework" onAction={(key) => console.log(key)}>
  <ListBoxItem>Next.js</ListBoxItem>
  <ListBoxItem>Remix</ListBoxItem>
  <ListBoxItem>Astro</ListBoxItem>
  <ListBoxItem>Gatsby</ListBoxItem>
</ListBox>
```

## ListBox selection

```tsx
import { ListBox, ListBoxItem } from "@/components/ui/list-box"
```

```tsx
<ListBox aria-label="Toppings" selectionMode="multiple" defaultSelectedKeys={["mushroom", "olives"]}>
  <ListBoxItem id="mushroom">Mushroom</ListBoxItem>
  <ListBoxItem id="olives">Olives</ListBoxItem>
  <ListBoxItem id="onion">Onion</ListBoxItem>
  <ListBoxItem id="pepperoni">Pepperoni</ListBoxItem>
</ListBox>
```

## ListBox controlled selection

```tsx
import React from "react"
import type { Selection } from "react-aria-components/ListBox"

import { ListBox, ListBoxItem } from "@/components/ui/list-box"
```

```tsx
const [selected, setSelected] = React.useState<Selection>(new Set(["a"]))

<ListBox
  aria-label="Options"
  selectionMode="multiple"
  selectedKeys={selected}
  onSelectionChange={setSelected}
>
  <ListBoxItem id="a">Option A</ListBoxItem>
  <ListBoxItem id="b">Option B</ListBoxItem>
</ListBox>
```

## ListBox with dynamic items

```tsx
import { ListBox, ListBoxItem } from "@/components/ui/list-box"
```

```tsx
const animals = [
  { id: "cat", name: "Cat" },
  { id: "dog", name: "Dog" },
]

<ListBox aria-label="Animals" items={animals}>
  {(item) => <ListBoxItem id={item.id}>{item.name}</ListBoxItem>}
</ListBox>
```

## ListBox with icons

Items with non-string content need a `textValue`.

```tsx
import { CopyIcon, PencilIcon, ShareIcon, StarIcon } from "@/components/icons"
import { ListBox, ListBoxItem } from "@/components/ui/list-box"
```

```tsx
<ListBox aria-label="Actions" selectionMode="single">
  <ListBoxItem id="edit" textValue="Edit">
    <PencilIcon />
    Edit
  </ListBoxItem>
  <ListBoxItem id="copy" textValue="Copy link">
    <CopyIcon />
    Copy link
  </ListBoxItem>
  <ListBoxItem id="share" textValue="Share">
    <ShareIcon />
    Share
  </ListBoxItem>
  <ListBoxItem id="favorite" textValue="Add to favorites">
    <StarIcon />
    Add to favorites
  </ListBoxItem>
</ListBox>
```

## ListBox with label and description

```tsx
import { GitBranchIcon, ShieldCheckIcon, UserIcon } from "@/components/icons"
import {
  ListBox,
  ListBoxItem,
  ListBoxItemDescription,
  ListBoxItemLabel,
} from "@/components/ui/list-box"
```

```tsx
<ListBox aria-label="Permissions" selectionMode="single" defaultSelectedKeys={["read"]}>
  <ListBoxItem id="read" textValue="Read">
    <UserIcon />
    <ListBoxItemLabel>Read</ListBoxItemLabel>
    <ListBoxItemDescription>View files and discussions.</ListBoxItemDescription>
  </ListBoxItem>
  <ListBoxItem id="write" textValue="Write" isDisabled>
    <GitBranchIcon />
    <ListBoxItemLabel>Write</ListBoxItemLabel>
    <ListBoxItemDescription>Push branches and open pull requests.</ListBoxItemDescription>
  </ListBoxItem>
  <ListBoxItem id="maintain" textValue="Maintain">
    <ShieldCheckIcon />
    <ListBoxItemLabel>Maintain</ListBoxItemLabel>
    <ListBoxItemDescription>Manage the repository without admin access.</ListBoxItemDescription>
  </ListBoxItem>
</ListBox>
```

## ListBox with sections

```tsx
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from "@/components/ui/list-box"
import { Separator } from "@/components/ui/separator"
```

```tsx
<ListBox aria-label="Burger contents" selectionMode="multiple">
  <ListBoxSection>
    <ListBoxSectionHeader>Sauces</ListBoxSectionHeader>
    <ListBoxItem id="signature">Signature sauce</ListBoxItem>
    <ListBoxItem id="bbq">BBQ sauce</ListBoxItem>
  </ListBoxSection>
  <Separator />
  <ListBoxSection>
    <ListBoxSectionHeader>Cheese</ListBoxSectionHeader>
    <ListBoxItem id="pepperjack">Pepperjack</ListBoxItem>
    <ListBoxItem id="mozzarella">Mozzarella</ListBoxItem>
  </ListBoxSection>
</ListBox>
```

## ListBox with separators and shortcuts

```tsx
import { ClipboardPasteIcon, CopyIcon, ScissorsIcon, TrashIcon } from "@/components/icons"
import { Kbd } from "@/components/ui/kbd"
import { ListBox, ListBoxItem } from "@/components/ui/list-box"
import { Separator } from "@/components/ui/separator"
```

```tsx
<ListBox aria-label="File" onAction={(key) => console.log(key)}>
  <ListBoxItem id="cut" textValue="Cut">
    <ScissorsIcon />
    Cut
    <Kbd>⌘X</Kbd>
  </ListBoxItem>
  <ListBoxItem id="copy" textValue="Copy">
    <CopyIcon />
    Copy
    <Kbd>⌘C</Kbd>
  </ListBoxItem>
  <ListBoxItem id="paste" textValue="Paste">
    <ClipboardPasteIcon />
    Paste
    <Kbd>⌘V</Kbd>
  </ListBoxItem>
  <Separator />
  <ListBoxItem id="delete" variant="danger" textValue="Delete">
    <TrashIcon />
    Delete
    <Kbd>⌫</Kbd>
  </ListBoxItem>
</ListBox>
```

## ListBox danger item

```tsx
import { ExternalLinkIcon, PencilIcon, TrashIcon } from "@/components/icons"
import { ListBox, ListBoxItem } from "@/components/ui/list-box"
```

```tsx
<ListBox aria-label="Project actions" onAction={(key) => console.log(key)}>
  <ListBoxItem id="rename" textValue="Rename project">
    <PencilIcon />
    Rename project
  </ListBoxItem>
  <ListBoxItem id="open" textValue="Open in new tab">
    <ExternalLinkIcon />
    Open in new tab
  </ListBoxItem>
  <ListBoxItem id="delete" variant="danger" textValue="Delete project">
    <TrashIcon />
    Delete project
  </ListBoxItem>
</ListBox>
```

## ListBox disabled items

```tsx
import { ListBox, ListBoxItem } from "@/components/ui/list-box"
```

```tsx
<ListBox aria-label="Plan" selectionMode="single" disabledKeys={["enterprise", "support"]}>
  <ListBoxItem id="hobby">Hobby</ListBoxItem>
  <ListBoxItem id="pro">Pro</ListBoxItem>
  <ListBoxItem id="enterprise">Enterprise (sold out)</ListBoxItem>
  <ListBoxItem id="support">Premium support (coming soon)</ListBoxItem>
</ListBox>
```

## ListBox horizontal

```tsx
import { LayoutGridIcon, ListIcon } from "@/components/icons"
import { ListBox, ListBoxItem } from "@/components/ui/list-box"
```

```tsx
<ListBox aria-label="View" orientation="horizontal" selectionMode="single" defaultSelectedKeys={["grid"]}>
  <ListBoxItem id="list" textValue="List">
    <ListIcon />
    List
  </ListBoxItem>
  <ListBoxItem id="grid" textValue="Grid">
    <LayoutGridIcon />
    Grid
  </ListBoxItem>
</ListBox>
```

## ListBox grid layout

```tsx
import { ListBox, ListBoxItem } from "@/components/ui/list-box"
```

```tsx
<ListBox aria-label="Frameworks" layout="grid" selectionMode="multiple">
  <ListBoxItem id="next">Next.js</ListBoxItem>
  <ListBoxItem id="remix">Remix</ListBoxItem>
  <ListBoxItem id="astro">Astro</ListBoxItem>
  <ListBoxItem id="gatsby">Gatsby</ListBoxItem>
  <ListBoxItem id="solid">SolidStart</ListBoxItem>
  <ListBoxItem id="qwik">Qwik City</ListBoxItem>
</ListBox>
```

## ListBox empty state

```tsx
import { ListBox } from "@/components/ui/list-box"
```

```tsx
<ListBox
  aria-label="Search results"
  renderEmptyState={() => (
    <div className="flex flex-col items-center justify-center gap-2 py-8 text-fg-muted">
      <span className="text-sm">No results found.</span>
    </div>
  )}
>
  {[]}
</ListBox>
```

## ListBox async loading

```tsx
import { useAsyncList } from "react-stately"

import { ListBox, ListBoxItem } from "@/components/ui/list-box"
import { Loader } from "@/components/ui/loader"
```

```tsx
const list = useAsyncList<{ name: string }>({
  async load({ signal, cursor }) {
    const res = await fetch(cursor || "https://pokeapi.co/api/v2/pokemon", { signal })
    const json = await res.json()
    return { items: json.results, cursor: json.next }
  },
})

<ListBox
  aria-label="Pick a Pokemon"
  className="max-h-64 overflow-auto overscroll-none"
  items={list.items}
  isLoading={list.loadingState === "loadingMore"}
  onLoadMore={list.loadMore}
  renderEmptyState={() => (
    <div className="flex items-center justify-center py-4">
      <Loader />
    </div>
  )}
  selectionMode="single"
>
  {(item) => (
    <ListBoxItem id={item.name} className="capitalize">
      {item.name}
    </ListBoxItem>
  )}
</ListBox>
```

## ListBox with links

```tsx
import { ListBox, ListBoxItem } from "@/components/ui/list-box"
```

```tsx
<ListBox aria-label="Links">
  <ListBoxItem href="/home">Home</ListBoxItem>
  <ListBoxItem href="/settings">Settings</ListBoxItem>
</ListBox>
```

## ListBox user menu card

A standalone ListBox composed with an Avatar header inside a card surface.

```tsx
import { LogOutIcon, SettingsIcon, UserIcon } from "@/components/icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ListBox, ListBoxItem } from "@/components/ui/list-box"
import { Separator } from "@/components/ui/separator"
```

```tsx
<div className="rounded-md border bg-card shadow-sm">
  <div className="flex items-start gap-2 p-2">
    <Avatar size="sm" className="mt-1">
      <AvatarImage src="https://i.pravatar.cc/150?u=jrgarciadev" />
      <AvatarFallback>JG</AvatarFallback>
    </Avatar>
    <div className="flex flex-col text-sm">
      <p>Junior Garcia</p>
      <p className="text-xs text-fg-muted">jrgarcia@example.com</p>
    </div>
  </div>
  <Separator />
  <ListBox aria-label="Account" onAction={(key) => console.log(key)}>
    <ListBoxItem id="profile" textValue="Profile">
      <UserIcon />
      Profile
    </ListBoxItem>
    <ListBoxItem id="settings" textValue="Settings">
      <SettingsIcon />
      Settings
    </ListBoxItem>
    <Separator />
    <ListBoxItem id="logout" variant="danger" textValue="Log out">
      <LogOutIcon />
      Log out
    </ListBoxItem>
  </ListBox>
</div>
```

## Menu

```tsx
import { MenuIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Menu, MenuContent, MenuItem } from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
```

```tsx
<Menu>
  <Button isIconOnly>
    <MenuIcon />
  </Button>
  <Popover>
    <MenuContent>
      <MenuItem>Account settings</MenuItem>
      <MenuItem>Create team</MenuItem>
      <MenuItem>Command menu</MenuItem>
      <MenuItem>Log out</MenuItem>
    </MenuContent>
  </Popover>
</Menu>
```

## Menu with icons and danger item

```tsx
import { CreditCardIcon, LogOutIcon, SettingsIcon, UserIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Menu, MenuContent, MenuItem } from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
```

```tsx
<Menu>
  <Button variant="secondary">Open</Button>
  <Popover>
    <MenuContent>
      <MenuItem>
        <UserIcon />
        Profile
      </MenuItem>
      <MenuItem>
        <CreditCardIcon />
        Billing
      </MenuItem>
      <MenuItem>
        <SettingsIcon />
        Settings
      </MenuItem>
      <Separator />
      <MenuItem variant="danger">
        <LogOutIcon />
        Log out
      </MenuItem>
    </MenuContent>
  </Popover>
</Menu>
```

## Menu with sections

```tsx
import { Button } from "@/components/ui/button"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSection,
  MenuSectionHeader,
} from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
```

```tsx
<Menu>
  <Button variant="secondary">Open</Button>
  <Popover>
    <MenuContent>
      <MenuSection>
        <MenuSectionHeader>My Account</MenuSectionHeader>
        <MenuItem>Profile</MenuItem>
        <MenuItem>Billing</MenuItem>
        <MenuItem>Settings</MenuItem>
      </MenuSection>
      <Separator />
      <MenuItem>GitHub</MenuItem>
      <MenuItem>Support</MenuItem>
      <MenuItem isDisabled>API</MenuItem>
    </MenuContent>
  </Popover>
</Menu>
```

## Menu with separators

```tsx
import { Button } from "@/components/ui/button"
import { Menu, MenuContent, MenuItem } from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
```

```tsx
<Menu>
  <Button variant="secondary">File</Button>
  <Popover>
    <MenuContent>
      <MenuItem>New...</MenuItem>
      <Separator />
      <MenuItem>Save</MenuItem>
      <MenuItem>Save as...</MenuItem>
      <Separator />
      <MenuItem>Print…</MenuItem>
    </MenuContent>
  </Popover>
</Menu>
```

## Menu with shortcuts

```tsx
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { Menu, MenuContent, MenuItem } from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
```

```tsx
<Menu>
  <Button variant="secondary">Open</Button>
  <Popover>
    <MenuContent>
      <MenuItem>
        Profile
        <Kbd className="ml-auto">⇧⌘P</Kbd>
      </MenuItem>
      <MenuItem>
        Billing
        <Kbd className="ml-auto">⌘B</Kbd>
      </MenuItem>
      <MenuItem>
        Settings
        <Kbd className="ml-auto">⌘S</Kbd>
      </MenuItem>
    </MenuContent>
  </Popover>
</Menu>
```

## Menu item with label and description

```tsx
import { MenuIcon, PlusSquareIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuItemDescription,
  MenuItemLabel,
} from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
```

```tsx
<Menu>
  <Button isIconOnly>
    <MenuIcon />
  </Button>
  <Popover>
    <MenuContent>
      <MenuItem>
        <PlusSquareIcon />
        <MenuItemLabel>New file</MenuItemLabel>
        <MenuItemDescription>Create a new file</MenuItemDescription>
      </MenuItem>
      <MenuItem>
        <MenuItemLabel>Copy link</MenuItemLabel>
        <MenuItemDescription>Copy the file link</MenuItemDescription>
      </MenuItem>
    </MenuContent>
  </Popover>
</Menu>
```

## Menu with submenus

Nest `MenuSub` around a `MenuItem` trigger and a `Popover` + `MenuContent`; submenus nest recursively.

```tsx
import { Button } from "@/components/ui/button"
import { Menu, MenuContent, MenuItem, MenuSub } from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
```

```tsx
<Menu>
  <Button variant="secondary">Open</Button>
  <Popover>
    <MenuContent>
      <MenuItem>Account settings</MenuItem>
      <MenuSub>
        <MenuItem>Invite users</MenuItem>
        <Popover>
          <MenuContent>
            <MenuItem>SMS</MenuItem>
            <MenuItem>Twitter</MenuItem>
            <MenuSub>
              <MenuItem>Email</MenuItem>
              <Popover>
                <MenuContent>
                  <MenuItem>Work</MenuItem>
                  <MenuItem>Personal</MenuItem>
                </MenuContent>
              </Popover>
            </MenuSub>
          </MenuContent>
        </Popover>
      </MenuSub>
    </MenuContent>
  </Popover>
</Menu>
```

## Menu single selection (radio items)

```tsx
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSection,
  MenuSectionHeader,
} from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
```

```tsx
<Menu>
  <Button variant="secondary">Radio Group</Button>
  <Popover>
    <MenuContent selectionMode="single" disabledKeys={["right"]}>
      <MenuSection>
        <MenuSectionHeader>Panel Position</MenuSectionHeader>
        <MenuItem id="top">
          <ArrowUpIcon />
          Top
        </MenuItem>
        <MenuItem id="bottom">
          <ArrowDownIcon />
          Bottom
        </MenuItem>
        <MenuItem id="right">
          <ArrowRightIcon />
          Right
        </MenuItem>
      </MenuSection>
    </MenuContent>
  </Popover>
</Menu>
```

## Menu multiple selection (checkbox items, controlled)

```tsx
import React from "react"
import type { Key } from "react-aria-components/Menu"

import { BellIcon, MailIcon, MessageSquareIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSection,
  MenuSectionHeader,
} from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
```

```tsx
const [selected, setSelected] = React.useState<Set<Key>>(new Set(["email", "push"]))

<Menu>
  <Button variant="secondary">Notifications</Button>
  <Popover>
    <MenuContent
      selectionMode="multiple"
      selectedKeys={selected}
      onSelectionChange={(keys) => {
        if (keys !== "all") setSelected(new Set(keys))
      }}
      className="min-w-56"
    >
      <MenuSection>
        <MenuSectionHeader>Notification Preferences</MenuSectionHeader>
        <MenuItem id="email">
          <MailIcon />
          Email notifications
        </MenuItem>
        <MenuItem id="sms">
          <MessageSquareIcon />
          SMS notifications
        </MenuItem>
        <MenuItem id="push">
          <BellIcon />
          Push notifications
        </MenuItem>
      </MenuSection>
    </MenuContent>
  </Popover>
</Menu>
```

## Menu disabled items

```tsx
import { MenuIcon, PlusSquareIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Menu, MenuContent, MenuItem } from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
```

```tsx
<Menu>
  <Button isIconOnly>
    <MenuIcon />
  </Button>
  <Popover>
    <MenuContent>
      <MenuItem>Account settings</MenuItem>
      <MenuItem isDisabled>
        <PlusSquareIcon />
        Create team
      </MenuItem>
      <MenuItem>Log out</MenuItem>
    </MenuContent>
  </Popover>
</Menu>
```

## Menu link items

```tsx
import { Button } from "@/components/ui/button"
import { Menu, MenuContent, MenuItem } from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
```

```tsx
<Menu>
  <Button variant="secondary" size="sm">Social</Button>
  <Popover>
    <MenuContent>
      <MenuItem href="https://twitter.com/mehdibha" target="_blank">
        X
      </MenuItem>
      <MenuItem href="https://discord.com/invite/DXpj5V2fU8" target="_blank">
        Discord
      </MenuItem>
    </MenuContent>
  </Popover>
</Menu>
```

## Menu controlled open state

```tsx
import React from "react"

import { MenuIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Menu, MenuContent, MenuItem } from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
```

```tsx
const [isOpen, setOpen] = React.useState(false)

<Menu isOpen={isOpen} onOpenChange={setOpen}>
  <Button isIconOnly>
    <MenuIcon />
  </Button>
  <Popover>
    <MenuContent>
      <MenuItem>Account settings</MenuItem>
      <MenuItem>Create team</MenuItem>
      <MenuItem>Log out</MenuItem>
    </MenuContent>
  </Popover>
</Menu>
```

## Menu long press trigger

```tsx
import { MenuIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Menu, MenuContent, MenuItem } from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
```

```tsx
<Menu trigger="longPress">
  <Button variant="secondary" isIconOnly>
    <MenuIcon />
  </Button>
  <Popover>
    <MenuContent>
      <MenuItem>Account settings</MenuItem>
      <MenuItem>Create team</MenuItem>
      <MenuItem>Log out</MenuItem>
    </MenuContent>
  </Popover>
</Menu>
```

## Menu context menu

Any focusable element wrapped in React Aria's `Pressable` can be the trigger.

```tsx
import { Pressable } from "react-aria-components/Pressable"

import { Menu, MenuContent, MenuItem } from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
```

```tsx
<Menu trigger="contextMenu">
  <Pressable>
    <div role="button" tabIndex={0} className="flex h-32 w-64 items-center justify-center rounded-md border border-dashed">
      Right click me
    </div>
  </Pressable>
  <Popover>
    <MenuContent>
      <MenuItem>Account settings</MenuItem>
      <MenuItem>Create team</MenuItem>
      <MenuItem>Log out</MenuItem>
    </MenuContent>
  </Popover>
</Menu>
```

## Menu placement

```tsx
import { Button } from "@/components/ui/button"
import { Menu, MenuContent, MenuItem } from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
```

```tsx
<Menu>
  <Button variant="secondary">Top</Button>
  <Popover placement="top">
    <MenuContent>
      <MenuItem>Profile</MenuItem>
      <MenuItem>Billing</MenuItem>
      <MenuItem>Settings</MenuItem>
    </MenuContent>
  </Popover>
</Menu>
```

## Menu in Drawer

```tsx
import { BellIcon, LogOutIcon, SettingsIcon, UserIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerHandle } from "@/components/ui/drawer"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSection,
  MenuSectionHeader,
} from "@/components/ui/menu"
import { Separator } from "@/components/ui/separator"
```

```tsx
<Menu>
  <Button variant="secondary">Open drawer menu</Button>
  <Drawer placement="bottom">
    <DrawerHandle />
    <MenuContent>
      <MenuSection>
        <MenuSectionHeader>Account</MenuSectionHeader>
        <MenuItem>
          <UserIcon />
          Profile
        </MenuItem>
        <MenuItem>
          <BellIcon />
          Notifications
        </MenuItem>
        <MenuItem>
          <SettingsIcon />
          Settings
        </MenuItem>
      </MenuSection>
      <Separator />
      <MenuItem variant="danger">
        <LogOutIcon />
        Log out
      </MenuItem>
    </MenuContent>
  </Drawer>
</Menu>
```

## Menu in Modal

```tsx
import { CopyIcon, PencilIcon, TrashIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Menu, MenuContent, MenuItem } from "@/components/ui/menu"
import { Modal } from "@/components/ui/modal"
import { Separator } from "@/components/ui/separator"
```

```tsx
<Menu>
  <Button variant="secondary">Open modal menu</Button>
  <Modal>
    <MenuContent>
      <MenuItem>
        <PencilIcon />
        Rename
      </MenuItem>
      <MenuItem>
        <CopyIcon />
        Duplicate
      </MenuItem>
      <Separator />
      <MenuItem variant="danger">
        <TrashIcon />
        Delete
      </MenuItem>
    </MenuContent>
  </Modal>
</Menu>
```

## Menu responsive overlay (popover on desktop, drawer on mobile)

```tsx
import { MenuIcon } from "@/components/icons"
import { Responsive } from "@/lib/responsive"
import { Button } from "@/components/ui/button"
import { Drawer } from "@/components/ui/drawer"
import { Menu, MenuContent, MenuItem } from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
```

```tsx
<Menu>
  <Button variant="secondary" isIconOnly>
    <MenuIcon />
  </Button>
  <Responsive
    render={(isMobile) => {
      const Overlay = isMobile ? Drawer : Popover
      return (
        <Overlay>
          <MenuContent>
            <MenuItem>Account settings</MenuItem>
            <MenuItem>Create team</MenuItem>
            <MenuItem>Log out</MenuItem>
          </MenuContent>
        </Overlay>
      )
    }}
  />
</Menu>
```

## Menu in Dialog

```tsx
import { CopyIcon, ScissorsIcon, TrashIcon } from "@/components/icons"
import { Responsive } from "@/lib/responsive"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Drawer } from "@/components/ui/drawer"
import { Menu, MenuContent, MenuItem, MenuSub } from "@/components/ui/menu"
import { Modal } from "@/components/ui/modal"
import { Popover } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
```

```tsx
<Dialog>
  <Button variant="secondary">Open Dialog</Button>
  <Responsive
    render={(isMobile) => {
      const content = (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dropdown Menu Example</DialogTitle>
            <DialogDescription>Click the button below to see the menu.</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <Menu>
              <Button variant="secondary">Open Menu</Button>
              <Popover>
                <MenuContent>
                  <MenuItem>
                    <CopyIcon />
                    Copy
                  </MenuItem>
                  <MenuItem>
                    <ScissorsIcon />
                    Cut
                  </MenuItem>
                  <Separator />
                  <MenuSub>
                    <MenuItem>More Options</MenuItem>
                    <Popover>
                      <MenuContent>
                        <MenuItem>Save Page...</MenuItem>
                        <MenuItem>Developer Tools</MenuItem>
                      </MenuContent>
                    </Popover>
                  </MenuSub>
                  <Separator />
                  <MenuItem variant="danger">
                    <TrashIcon />
                    Delete
                  </MenuItem>
                </MenuContent>
              </Popover>
            </Menu>
          </DialogBody>
        </DialogContent>
      )
      return isMobile ? <Drawer>{content}</Drawer> : <Modal>{content}</Modal>
    }}
  />
</Dialog>
```

## Menu account dropdown with avatar

```tsx
import { BellIcon, ChevronsUpDownIcon, CreditCardIcon, LogOutIcon, UserIcon } from "@/components/icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Menu, MenuContent, MenuItem, MenuSection } from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
```

```tsx
<Menu>
  <Button variant="secondary" className="h-12 justify-start gap-2 px-2 md:max-w-[200px]">
    <Avatar size="sm">
      <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
    <div className="grid flex-1 text-left text-sm leading-tight">
      <span className="truncate font-semibold">shadcn</span>
      <span className="truncate text-xs text-fg-muted">shadcn@example.com</span>
    </div>
    <ChevronsUpDownIcon className="ml-auto text-fg-muted" />
  </Button>
  <Popover className="min-w-56">
    <MenuContent>
      <MenuSection>
        <MenuItem>
          <UserIcon />
          Account
        </MenuItem>
        <MenuItem>
          <CreditCardIcon />
          Billing
        </MenuItem>
        <MenuItem>
          <BellIcon />
          Notifications
        </MenuItem>
      </MenuSection>
      <Separator />
      <MenuItem>
        <LogOutIcon />
        Sign Out
      </MenuItem>
    </MenuContent>
  </Popover>
</Menu>
```

## Menu avatar icon trigger

```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Menu, MenuContent, MenuItem } from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
```

```tsx
<Menu>
  <Button variant="quiet" isIconOnly className="rounded-full">
    <Avatar size="sm">
      <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  </Button>
  <Popover placement="top end">
    <MenuContent>
      <MenuItem>Account</MenuItem>
      <MenuItem>Sign Out</MenuItem>
    </MenuContent>
  </Popover>
</Menu>
```

## Command

`Command` wraps React Aria's Autocomplete: compose a `SearchField` for the query and a `ListBox` for the results.

```tsx
import { SearchIcon } from "@/components/icons"
import { Command } from "@/components/ui/command"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { ListBox, ListBoxItem } from "@/components/ui/list-box"
import { SearchField } from "@/components/ui/search-field"
```

```tsx
<Command aria-label="Command menu">
  <SearchField aria-label="Search">
    <InputGroup>
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <Input placeholder="Type a command or search..." />
    </InputGroup>
  </SearchField>
  <ListBox aria-label="Commands" onAction={(key) => console.log(key)}>
    <ListBoxItem textValue="Calendar">Calendar</ListBoxItem>
    <ListBoxItem textValue="Search Emoji">Search Emoji</ListBoxItem>
    <ListBoxItem textValue="Calculator">Calculator</ListBoxItem>
  </ListBox>
</Command>
```

## Command with sections, icons and shortcuts

```tsx
import {
  CalculatorIcon,
  CalendarIcon,
  CreditCardIcon,
  SearchIcon,
  SettingsIcon,
  SmileIcon,
  UserIcon,
  XIcon,
} from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Command } from "@/components/ui/command"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { Kbd } from "@/components/ui/kbd"
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from "@/components/ui/list-box"
import { SearchField } from "@/components/ui/search-field"
import { Separator } from "@/components/ui/separator"
```

```tsx
<Card className="w-full p-0">
  <Command aria-label="Command menu">
    <SearchField aria-label="Search">
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <Input placeholder="Type a command or search..." />
        <InputGroupAddon className="[--addon-button-inset:--spacing(2)]">
          <Button isIconOnly variant="quiet">
            <XIcon aria-hidden="true" />
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </SearchField>
    <ListBox aria-label="Commands" onAction={(key) => console.log(key)}>
      <ListBoxSection>
        <ListBoxSectionHeader>Suggestions</ListBoxSectionHeader>
        <ListBoxItem textValue="Calendar">
          <CalendarIcon />
          <span>Calendar</span>
        </ListBoxItem>
        <ListBoxItem textValue="Search Emoji">
          <SmileIcon />
          <span>Search Emoji</span>
        </ListBoxItem>
        <ListBoxItem textValue="Calculator">
          <CalculatorIcon />
          <span>Calculator</span>
        </ListBoxItem>
      </ListBoxSection>
      <Separator />
      <ListBoxSection>
        <ListBoxSectionHeader>Settings</ListBoxSectionHeader>
        <ListBoxItem textValue="Profile">
          <UserIcon />
          <span>Profile</span>
          <Kbd>⌘P</Kbd>
        </ListBoxItem>
        <ListBoxItem textValue="Billing">
          <CreditCardIcon />
          <span>Billing</span>
          <Kbd>⌘B</Kbd>
        </ListBoxItem>
        <ListBoxItem textValue="Settings">
          <SettingsIcon />
          <span>Settings</span>
          <Kbd>⌘S</Kbd>
        </ListBoxItem>
      </ListBoxSection>
    </ListBox>
  </Command>
</Card>
```

## Command with aliased primitives

`CommandInput` is a `SearchField`, `CommandContent` a `ListBox`, and `CommandItem`/`CommandSection`/`CommandSectionHeader` map to their `ListBox*` counterparts.

```tsx
import {
  Command,
  CommandContent,
  CommandInput,
  CommandItem,
  CommandSection,
  CommandSectionHeader,
} from "@/components/ui/command"
```

```tsx
<Command>
  <CommandInput aria-label="Search commands" placeholder="Search a command…" />
  <CommandContent className="min-h-48">
    <CommandSection>
      <CommandSectionHeader>Files</CommandSectionHeader>
      <CommandItem id="new-file" textValue="Create new file">
        Create new file…
      </CommandItem>
      <CommandItem id="new-folder" textValue="Create new folder">
        Create new folder…
      </CommandItem>
    </CommandSection>
    <CommandItem id="assign-to" textValue="Assign to">
      Assign to…
    </CommandItem>
    <CommandItem id="status" textValue="Change status">
      Change status…
    </CommandItem>
  </CommandContent>
</Command>
```

## Command filter options

`filter` accepts `Intl.CollatorOptions`; defaults are case- and punctuation-insensitive.

```tsx
import { Command, CommandContent, CommandInput, CommandItem } from "@/components/ui/command"
```

```tsx
<Command filter={{ sensitivity: "accent" }}>
  <CommandInput aria-label="Search" placeholder="Search…" />
  <CommandContent>
    <CommandItem id="cafe">Café</CommandItem>
    <CommandItem id="resume">Résumé</CommandItem>
  </CommandContent>
</Command>
```

## Command in modal (⌘K palette)

```tsx
import { CalendarIcon, SearchIcon, SmileIcon, XIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Command } from "@/components/ui/command"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { Kbd } from "@/components/ui/kbd"
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from "@/components/ui/list-box"
import { Modal } from "@/components/ui/modal"
import { SearchField } from "@/components/ui/search-field"
```

```tsx
<Dialog>
  <Button>Open Command</Button>
  <Modal>
    <DialogContent>
      {({ close }) => (
        <Command aria-label="Command menu">
          <SearchField aria-label="Search" autoFocus>
            <InputGroup size="lg">
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <Input placeholder="Type a command or search..." />
              <InputGroupAddon>
                <Button slot="close" onPress={close} className="px-1">
                  <Kbd className="bg-transparent">Esc</Kbd>
                </Button>
                <Button variant="quiet" isIconOnly>
                  <XIcon aria-hidden="true" />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </SearchField>
          <ListBox aria-label="Commands" onAction={(key) => console.log(key)}>
            <ListBoxSection>
              <ListBoxSectionHeader>Suggestions</ListBoxSectionHeader>
              <ListBoxItem textValue="Calendar">
                <CalendarIcon />
                <span>Calendar</span>
              </ListBoxItem>
              <ListBoxItem textValue="Search Emoji">
                <SmileIcon />
                <span>Search Emoji</span>
              </ListBoxItem>
            </ListBoxSection>
          </ListBox>
        </Command>
      )}
    </DialogContent>
  </Modal>
</Dialog>
```

## Command in Select (searchable select)

```tsx
import { ChevronDownIcon, SearchIcon, XIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Command } from "@/components/ui/command"
import { Label } from "@/components/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from "@/components/ui/list-box"
import { Popover } from "@/components/ui/popover"
import { SearchField } from "@/components/ui/search-field"
import { Select, SelectValue } from "@/components/ui/select"
```

```tsx
<Select placeholder="Select a country...">
  <Label>Country</Label>
  <Button>
    <SelectValue />
    <ChevronDownIcon className="ml-auto" />
  </Button>
  <Popover className="outline-hidden">
    <Command>
      <SearchField autoFocus aria-label="Search countries">
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <Input placeholder="Search..." />
          <InputGroupAddon>
            <Button variant="quiet" isIconOnly className="[--addon-button-inset:--spacing(1.5)]">
              <XIcon aria-hidden="true" />
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </SearchField>
      <ListBox>
        <ListBoxSection>
          <ListBoxSectionHeader>Africa</ListBoxSectionHeader>
          <ListBoxItem>Tunisia</ListBoxItem>
          <ListBoxItem>Morocco</ListBoxItem>
        </ListBoxSection>
        <ListBoxSection>
          <ListBoxSectionHeader>Europe</ListBoxSectionHeader>
          <ListBoxItem>France</ListBoxItem>
          <ListBoxItem>Germany</ListBoxItem>
        </ListBoxSection>
      </ListBox>
    </Command>
  </Popover>
</Select>
```

## Command with TagGroup

```tsx
import { SearchIcon } from "@/components/icons"
import { Command } from "@/components/ui/command"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { SearchField } from "@/components/ui/search-field"
import { Tag, TagGroup, TagList } from "@/components/ui/tag-group"
```

```tsx
<Command aria-label="Command menu" className="gap-2">
  <SearchField aria-label="Search" autoFocus>
    <InputGroup>
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <Input placeholder="Type a command or search..." />
    </InputGroup>
  </SearchField>
  <TagGroup aria-label="Interest tags" selectionMode="multiple">
    <TagList renderEmptyState={() => <p className="text-xs text-fg-muted">No results.</p>}>
      <Tag>News</Tag>
      <Tag>Travel</Tag>
      <Tag>Shopping</Tag>
      <Tag>Technology</Tag>
    </TagList>
  </TagGroup>
</Command>
```

## Mention

Typing `@` opens a caret-anchored suggestions menu; selecting an item inserts it as an inline token.

```tsx
import { Mention } from "@/components/ui/mention"
import { MenuContent, MenuItem } from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
import { TokenInput } from "@/components/ui/token-field"
```

```tsx
const usernames = ["alexmiller", "sarahjones", "davidkim"].map((id) => ({ id }))

<Mention allowsNewlines className="w-[320px]">
  <TokenInput aria-label="Comment" placeholder="Type @ to mention someone..." />
  <Popover>
    <MenuContent items={usernames} renderEmptyState={() => "No results found."}>
      {(item) => (
        <MenuItem id={item.id} textValue={item.id}>
          {item.id}
        </MenuItem>
      )}
    </MenuContent>
  </Popover>
</Mention>
```

## Mention with label

```tsx
import { Label } from "@/components/ui/field"
import { Mention } from "@/components/ui/mention"
import { MenuContent, MenuItem } from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
import { TokenInput } from "@/components/ui/token-field"
```

```tsx
<Mention allowsNewlines className="w-[320px]">
  <Label>Comment</Label>
  <TokenInput placeholder="Type @ to mention someone..." />
  <Popover>
    <MenuContent items={people} renderEmptyState={() => "No people found."}>
      {(person) => (
        <MenuItem id={person.id} textValue={person.id}>
          @{person.id}
        </MenuItem>
      )}
    </MenuContent>
  </Popover>
</Mention>
```

## Mention controlled

```tsx
import * as React from "react"
import { TokenFieldValue } from "react-aria-components/TokenField"

import { Label } from "@/components/ui/field"
import { Mention } from "@/components/ui/mention"
import { MenuContent, MenuItem } from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
import { TokenInput } from "@/components/ui/token-field"
```

```tsx
const [value, setValue] = React.useState(
  () => new TokenFieldValue([{ type: "text", text: "Hey " }]),
)

<Mention allowsNewlines value={value} onChange={setValue}>
  <Label>Comment</Label>
  <TokenInput placeholder="Type @ to mention someone..." />
  <Popover>
    <MenuContent items={people}>
      {(person) => (
        <MenuItem id={person.id} textValue={person.id}>
          @{person.id}
        </MenuItem>
      )}
    </MenuContent>
  </Popover>
</Mention>
<p className="text-sm text-fg-muted">Value: {value.toString()}</p>
```

## Mention custom trigger

```tsx
import { Label } from "@/components/ui/field"
import { Mention } from "@/components/ui/mention"
import { MenuContent, MenuItem } from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
import { TokenInput } from "@/components/ui/token-field"
```

```tsx
const channels = ["general", "random", "design", "engineering"].map((id) => ({ id }))

<Mention allowsNewlines trigger="#" getItemText={(key) => String(key)} className="w-[320px]">
  <Label>Message</Label>
  <TokenInput placeholder="Type # to link a channel..." />
  <Popover>
    <MenuContent items={channels} renderEmptyState={() => "No channels found."}>
      {(channel) => (
        <MenuItem id={channel.id} textValue={channel.id}>
          #{channel.id}
        </MenuItem>
      )}
    </MenuContent>
  </Popover>
</Mention>
```

## Mention multiple triggers

A regex `trigger` matches several characters; render-function children receive the active trigger.

```tsx
import { TokenFieldValue } from "react-aria-components/TokenField"

import { FileIcon, TerminalIcon } from "@/components/icons"
import { Mention } from "@/components/ui/mention"
import { MenuContent, MenuItem } from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
import { TokenInput } from "@/components/ui/token-field"
```

```tsx
const files = [{ id: "README.md" }, { id: "src/app.tsx" }]
const commands = [
  { id: "review", description: "Review the current diff" },
  { id: "test", description: "Run the test suite" },
]

<Mention
  allowsNewlines
  trigger={/[@/]/}
  defaultValue={
    new TokenFieldValue([
      { type: "token", text: "/review" },
      { type: "text", text: " the changes in " },
      { type: "token", text: "@src/app.tsx" },
    ])
  }
  className="w-[360px]"
>
  {({ trigger }) => (
    <>
      <TokenInput aria-label="Prompt" placeholder="Type @ for files or / for commands..." />
      <Popover>
        <MenuContent items={trigger === "/" ? commands : files} renderEmptyState={() => "No results found."}>
          {(item) => (
            <MenuItem id={item.id} textValue={item.id}>
              {trigger === "/" ? <TerminalIcon /> : <FileIcon />}
              {item.id}
            </MenuItem>
          )}
        </MenuContent>
      </Popover>
    </>
  )}
</Mention>
```

## Mention with avatars

```tsx
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/field"
import { Mention } from "@/components/ui/mention"
import { MenuContent, MenuItem } from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
import { TokenInput } from "@/components/ui/token-field"
```

```tsx
const people = [
  { id: "alexmiller", name: "Alex Miller" },
  { id: "sarahjones", name: "Sarah Jones" },
]

<Mention allowsNewlines className="w-[320px]">
  <Label>Comment</Label>
  <TokenInput placeholder="Type @ to mention someone..." />
  <Popover>
    <MenuContent items={people} renderEmptyState={() => "No people found."}>
      {(person) => (
        <MenuItem id={person.id} textValue={person.id}>
          <Avatar size="sm">
            <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm">{person.name}</span>
            <span className="text-xs text-fg-muted">@{person.id}</span>
          </div>
        </MenuItem>
      )}
    </MenuContent>
  </Popover>
</Mention>
```

## Mention single-line

Without `allowsNewlines` the field stays single-line.

```tsx
import { Mention } from "@/components/ui/mention"
import { MenuContent, MenuItem } from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
import { TokenInput } from "@/components/ui/token-field"
```

```tsx
<Mention className="w-[320px]">
  <TokenInput aria-label="To" placeholder="Type @ to add someone..." className="min-h-0" />
  <Popover>
    <MenuContent items={people} renderEmptyState={() => "No people found."}>
      {(person) => (
        <MenuItem id={person.id} textValue={person.id}>
          @{person.id}
        </MenuItem>
      )}
    </MenuContent>
  </Popover>
</Mention>
```

## Mention placement

```tsx
import { Mention } from "@/components/ui/mention"
import { MenuContent, MenuItem } from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
import { TokenInput } from "@/components/ui/token-field"
```

```tsx
<Mention placement="top start">
  <TokenInput aria-label="Comment" />
  <Popover>
    <MenuContent items={people}>
      {(person) => <MenuItem id={person.id}>{person.id}</MenuItem>}
    </MenuContent>
  </Popover>
</Mention>
```

## TokenField

```tsx
import { TokenFieldValue } from "react-aria-components/TokenField"

import { Label } from "@/components/ui/field"
import { TokenField, TokenInput } from "@/components/ui/token-field"
```

```tsx
<TokenField
  allowsNewlines
  defaultValue={
    new TokenFieldValue([
      { type: "text", text: "Ping " },
      { type: "token", text: "@alexmiller" },
      { type: "text", text: " about the " },
      { type: "token", text: "#launch" },
      { type: "text", text: " checklist" },
    ])
  }
  className="w-[320px]"
>
  <Label>Message</Label>
  <TokenInput placeholder="Write something..." />
</TokenField>
```

## TokenField controlled

```tsx
import * as React from "react"
import { TokenFieldValue } from "react-aria-components/TokenField"

import { Label } from "@/components/ui/field"
import { TokenField, TokenInput } from "@/components/ui/token-field"
```

```tsx
const [value, setValue] = React.useState(
  () =>
    new TokenFieldValue([
      { type: "text", text: "Hello " },
      { type: "token", text: "@sarahjones" },
      { type: "text", text: "!" },
    ]),
)

<TokenField allowsNewlines value={value} onChange={setValue}>
  <Label>Message</Label>
  <TokenInput />
</TokenField>
<p className="text-sm text-fg-muted">Value: {value.toString()}</p>
```

## TokenField custom token render

```tsx
import { Token, TokenField, TokenInput } from "@/components/ui/token-field"
```

```tsx
<TokenField allowsNewlines>
  <TokenInput aria-label="Message">
    {(segment) => <Token className="font-medium">{segment.text}</Token>}
  </TokenInput>
</TokenField>
```

## TokenField automatic tokenization

Subclass `TokenFieldValue` and override `tokenize` to turn typed text into tokens.

```tsx
import { TokenFieldValue } from "react-aria-components/TokenField"
import type { TokenFieldSegment } from "react-aria-components/TokenField"

import { Label } from "@/components/ui/field"
import { TokenField, TokenInput } from "@/components/ui/token-field"
```

```tsx
class HashtagFieldValue extends TokenFieldValue {
  protected tokenize(text: string): TokenFieldSegment[] {
    const regex = /(?<=\s|^)[#@]\S+(?=\s)/g
    const segments: TokenFieldSegment[] = []
    let start = 0
    let match: RegExpExecArray | null = null
    while ((match = regex.exec(text))) {
      if (match.index > start) segments.push({ type: "text", text: text.slice(start, match.index) })
      segments.push({ type: "token", text: match[0] })
      start = match.index + match[0].length
    }
    if (start < text.length) segments.push({ type: "text", text: text.slice(start) })
    return segments
  }
}

<TokenField
  allowsNewlines
  defaultValue={new HashtagFieldValue([{ type: "text", text: "Tokenizes #hashtags and @usernames " }])}
  className="w-[320px]"
>
  <Label>Post</Label>
  <TokenInput />
</TokenField>
```

## TokenField tag input

Comma, space, or newline turns the preceding text into a tag.

```tsx
import { TokenFieldValue } from "react-aria-components/TokenField"
import type { TokenFieldSegment } from "react-aria-components/TokenField"

import { Label } from "@/components/ui/field"
import { TokenField, TokenInput } from "@/components/ui/token-field"
```

```tsx
class TagFieldValue extends TokenFieldValue {
  protected tokenize(text: string): TokenFieldSegment[] {
    const parts = text.split(/[, \n]/)
    const segments: TokenFieldSegment[] = parts.map((part, i) =>
      i === parts.length - 1 || part.length === 0
        ? { type: "text", text: part }
        : { type: "token", text: part },
    )
    if (parts.at(-1)?.length === 0) segments.pop()
    return segments
  }

  toString(): string {
    return this.segments.map((segment) => segment.text).join(", ")
  }
}

<TokenField
  defaultValue={
    new TagFieldValue([
      { type: "token", text: "Design" },
      { type: "token", text: "Engineering" },
      { type: "token", text: "Marketing" },
    ])
  }
  className="w-[320px]"
>
  <Label>Categories</Label>
  <TokenInput className="min-h-0" />
</TokenField>
```

# Overlays

## Dialog

A dialog is the trigger + content; the overlay (Modal, Drawer, Popover) is a sibling of the trigger inside `Dialog`.

```tsx
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Modal } from "@/components/ui/modal"
```

```tsx
<Dialog>
  <Button>Open dialog</Button>
  <Modal>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create a new issue</DialogTitle>
        <DialogDescription>
          Report an issue or create a feature request.
        </DialogDescription>
      </DialogHeader>
      <DialogBody>Content</DialogBody>
      <DialogFooter>
        <Button slot="close">Cancel</Button>
        <Button slot="close" variant="primary">
          Save changes
        </Button>
      </DialogFooter>
    </DialogContent>
  </Modal>
</Dialog>
```

## Dialog with form fields

```tsx
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/field"
import { Input, TextArea } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import { TextField } from "@/components/ui/text-field"
```

```tsx
<Dialog>
  <Button>Create issue</Button>
  <Modal>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create a new issue</DialogTitle>
        <DialogDescription>
          Report an issue or create a feature request.
        </DialogDescription>
      </DialogHeader>
      <DialogBody>
        <TextField autoFocus>
          <Label>Title</Label>
          <Input placeholder="Title" className="w-full" />
        </TextField>
        <TextArea
          aria-label="Description"
          placeholder="Description"
          className="w-full"
        />
      </DialogBody>
      <DialogFooter>
        <Button slot="close">Cancel</Button>
        <Button slot="close" variant="primary">
          Save changes
        </Button>
      </DialogFooter>
    </DialogContent>
  </Modal>
</Dialog>
```

## Dialog responsive (Modal on desktop, Drawer on mobile)

The same `DialogContent` is rendered in a Drawer below the mobile breakpoint and in a Modal above it.

```tsx
import { Responsive } from "@/lib/responsive"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Drawer } from "@/components/ui/drawer"
import { Modal } from "@/components/ui/modal"
```

```tsx
<Dialog>
  <Button variant="secondary">Edit username</Button>
  <Responsive
    render={(isMobile) => {
      const content = (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit username</DialogTitle>
            <DialogDescription>Make changes to your username.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      )
      return isMobile ? <Drawer>{content}</Drawer> : <Modal>{content}</Modal>
    }}
  />
</Dialog>
```

## Alert dialog

Destructive confirmations use `role="alertdialog"` on `DialogContent`.

```tsx
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Modal } from "@/components/ui/modal"
```

```tsx
<Dialog>
  <Button variant="danger">Delete project</Button>
  <Modal>
    <DialogContent role="alertdialog">
      <DialogHeader>
        <DialogTitle>Delete project</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this project? This action is
          permanent and cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button slot="close" variant="secondary">
          Cancel
        </Button>
        <Button slot="close" variant="danger">
          Delete project
        </Button>
      </DialogFooter>
    </DialogContent>
  </Modal>
</Dialog>
```

## Dialog controlled

```tsx
import React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Modal } from "@/components/ui/modal"
```

```tsx
const [isOpen, setOpen] = React.useState(false)

<Dialog isOpen={isOpen} onOpenChange={setOpen}>
  <Button>Open dialog</Button>
  <Modal>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>This is a heading</DialogTitle>
      </DialogHeader>
      content here
    </DialogContent>
  </Modal>
</Dialog>
```

## Dialog non-dismissable

`isDismissable` lives on the overlay (Modal or Drawer), not on `Dialog`.

```tsx
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Modal } from "@/components/ui/modal"
```

```tsx
<Dialog>
  <Button>Open dialog</Button>
  <Modal isDismissable={false}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm action</DialogTitle>
      </DialogHeader>
      <DialogFooter>
        <Button slot="close">Acknowledge</Button>
      </DialogFooter>
    </DialogContent>
  </Modal>
</Dialog>
```

## Dialog with close button

```tsx
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Modal } from "@/components/ui/modal"
```

```tsx
<Dialog>
  <Button>Project settings</Button>
  <Modal>
    <DialogContent showCloseButton>
      <DialogHeader>
        <DialogTitle>Project settings</DialogTitle>
      </DialogHeader>
      <DialogBody>Review the project summary before saving.</DialogBody>
    </DialogContent>
  </Modal>
</Dialog>
```

## Dialog with inset content

`DialogInset` is a full-bleed section inside `DialogBody`.

```tsx
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogInset,
  DialogTitle,
} from "@/components/ui/dialog"
import { Modal } from "@/components/ui/modal"
```

```tsx
<Dialog>
  <Button>Create issue</Button>
  <Modal>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create a new issue</DialogTitle>
      </DialogHeader>
      <DialogBody>
        <DialogInset className="my-4! bg-muted">Content within the inset.</DialogInset>
        <p className="mt-4">Content outside the inset.</p>
      </DialogBody>
      <DialogFooter>
        <Button slot="close">Cancel</Button>
        <Button slot="close" variant="primary">
          Save changes
        </Button>
      </DialogFooter>
    </DialogContent>
  </Modal>
</Dialog>
```

## Dialog async form submission

`DialogContent` accepts a render function exposing `close`, so the form can close the dialog after submitting.

```tsx
import React from "react"
import * as FormPrimitives from "react-aria-components/Form"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import { TextField } from "@/components/ui/text-field"
```

```tsx
const [isPending, setIsPending] = React.useState(false)

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  setIsPending(true)
  await new Promise((resolve) => setTimeout(resolve, 1000))
  setIsPending(false)
}

<Dialog>
  <Button>Edit username</Button>
  <Modal>
    <DialogContent>
      {({ close }) => (
        <>
          <DialogHeader>
            <DialogTitle>Edit username</DialogTitle>
            <DialogDescription>Make changes to your profile.</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <FormPrimitives.Form
              onSubmit={(e) => {
                handleSubmit(e)
                close()
              }}
            >
              <TextField autoFocus defaultValue="@mehdibha" isRequired>
                <Label>Username</Label>
                <Input className="w-full" />
              </TextField>
            </FormPrimitives.Form>
          </DialogBody>
          <DialogFooter>
            <Button variant="secondary" slot="close">
              Cancel
            </Button>
            <Button type="submit" isPending={isPending} variant="primary">
              Save changes
            </Button>
          </DialogFooter>
        </>
      )}
    </DialogContent>
  </Modal>
</Dialog>
```

## Dialog nested

A `Dialog` trigger can live inside another dialog's content; each layer has its own overlay.

```tsx
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Modal } from "@/components/ui/modal"
```

```tsx
<Dialog>
  <Button variant="secondary">Dialog</Button>
  <Modal>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Dialog</DialogTitle>
      </DialogHeader>
      <Dialog>
        <Button variant="secondary">Nested dialog</Button>
        <Modal>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nested dialog</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Modal>
      </Dialog>
    </DialogContent>
  </Modal>
</Dialog>
```

## Modal

```tsx
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Modal } from "@/components/ui/modal"
```

```tsx
<Dialog>
  <Button>Open modal</Button>
  <Modal>
    <DialogContent>Modal content</DialogContent>
  </Modal>
</Dialog>
```

## Modal composed from parts

`Modal` composes this stack for you; assemble the parts yourself for full control.

```tsx
import { DialogContent } from "@/components/ui/dialog"
import {
  ModalBackdrop,
  ModalOverlay,
  ModalPanel,
  ModalViewport,
} from "@/components/ui/modal"
```

```tsx
<ModalOverlay>
  <ModalBackdrop />
  <ModalViewport>
    <ModalPanel>
      <DialogContent>Modal content</DialogContent>
    </ModalPanel>
  </ModalViewport>
</ModalOverlay>
```

## Modal controlled without a trigger

The open state can live on the modal itself when there is no `Dialog` wrapper.

```tsx
import React from "react"

import { DialogContent } from "@/components/ui/dialog"
import { Modal } from "@/components/ui/modal"
```

```tsx
const [isOpen, setIsOpen] = React.useState(false)

<Modal isOpen={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>Modal content</DialogContent>
</Modal>
```

## Modal with form

```tsx
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import { TextField } from "@/components/ui/text-field"
```

```tsx
<Dialog>
  <Button>Edit Profile</Button>
  <Modal>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <DialogBody>
        <TextField defaultValue="Pedro Duarte">
          <Label>Name</Label>
          <Input name="name" />
        </TextField>
        <TextField defaultValue="@peduarte">
          <Label>Username</Label>
          <Input name="username" />
        </TextField>
      </DialogBody>
      <DialogFooter>
        <Button slot="close" type="button">
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Save changes
        </Button>
      </DialogFooter>
    </DialogContent>
  </Modal>
</Dialog>
```

## Modal scrollable content

`DialogBody` scrolls when the content exceeds the viewport; header and footer stay fixed.

```tsx
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Modal } from "@/components/ui/modal"
```

```tsx
<Dialog>
  <Button>Scrollable Content</Button>
  <Modal>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Scrollable Content</DialogTitle>
        <DialogDescription>This is a dialog with scrollable content.</DialogDescription>
      </DialogHeader>
      <DialogBody>
        {paragraphs.map((paragraph) => (
          <p key={paragraph.id} className="text-sm leading-relaxed">
            {paragraph.text}
          </p>
        ))}
      </DialogBody>
      <DialogFooter>
        <Button slot="close" type="button">
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Save changes
        </Button>
      </DialogFooter>
    </DialogContent>
  </Modal>
</Dialog>
```

## Modal settings with tabs

A settings modal with a `Select` section switcher on mobile and `Tabs` on desktop, sharing one selected key.

```tsx
import * as React from "react"
import type * as MenuPrimitives from "react-aria-components/Menu"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FieldGroup, Fieldset, Label } from "@/components/ui/field"
import { Modal } from "@/components/ui/modal"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/tabs"
```

```tsx
const [tab, setTab] = React.useState<MenuPrimitives.Key>("general")

<Dialog>
  <Button>Chat Settings</Button>
  <Modal>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Chat Settings</DialogTitle>
        <DialogDescription>Customize your chat settings.</DialogDescription>
      </DialogHeader>
      <DialogBody>
        <Select
          aria-label="Settings section"
          value={tab}
          onChange={(value) => {
            if (value != null) setTab(value)
          }}
          className="md:hidden"
        >
          <SelectTrigger />
          <SelectContent>
            <SelectItem id="general">General</SelectItem>
            <SelectItem id="notifications">Notifications</SelectItem>
          </SelectContent>
        </Select>
        <Tabs selectedKey={tab} onSelectionChange={setTab} className="gap-4">
          <TabList className="hidden w-full gap-4 md:flex">
            <Tab id="general">General</Tab>
            <Tab id="notifications">Notifications</Tab>
          </TabList>
          <TabPanel id="general">
            <Fieldset>
              <FieldGroup>
                <Select className="flex-row" defaultValue="system">
                  <Label className="flex-1">Theme</Label>
                  <SelectTrigger className="min-w-32" />
                  <SelectContent>
                    <SelectItem id="light">Light</SelectItem>
                    <SelectItem id="dark">Dark</SelectItem>
                    <SelectItem id="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </FieldGroup>
            </Fieldset>
          </TabPanel>
          <TabPanel id="notifications">...</TabPanel>
        </Tabs>
      </DialogBody>
    </DialogContent>
  </Modal>
</Dialog>
```

## Drawer

```tsx
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Drawer, DrawerHandle } from "@/components/ui/drawer"
```

```tsx
<Dialog>
  <Button>Open drawer</Button>
  <Drawer>
    <DialogContent>
      <DrawerHandle />
      <DialogHeader>
        <DialogTitle>Drag me down</DialogTitle>
      </DialogHeader>
      <DialogBody>Or click outside to dismiss.</DialogBody>
    </DialogContent>
  </Drawer>
</Dialog>
```

## Drawer placement

```tsx
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Drawer } from "@/components/ui/drawer"
```

```tsx
<Dialog>
  <Button>Open drawer</Button>
  <Drawer placement="right">
    <DialogContent>Drawer content</DialogContent>
  </Drawer>
</Dialog>
```

## Drawer with dialog parts

```tsx
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Drawer, DrawerHandle } from "@/components/ui/drawer"
```

```tsx
<Dialog>
  <Button>Open dialog drawer</Button>
  <Drawer>
    <DialogContent showCloseButton>
      <DrawerHandle />
      <DialogHeader>
        <DialogTitle>Project settings</DialogTitle>
        <DialogDescription>
          Review the project summary before saving your changes.
        </DialogDescription>
      </DialogHeader>
      <DialogBody>Content</DialogBody>
      <DialogFooter>
        <Button slot="close" variant="quiet">
          Cancel
        </Button>
        <Button slot="close" variant="primary">
          Save changes
        </Button>
      </DialogFooter>
    </DialogContent>
  </Drawer>
</Dialog>
```

## Drawer controlled

Without a `Dialog` wrapper the drawer is driven by `isOpen` / `onOpenChange`.

```tsx
import React from "react"

import { Button } from "@/components/ui/button"
import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Drawer, DrawerHandle } from "@/components/ui/drawer"
```

```tsx
const [open, setOpen] = React.useState(false)

<Button onPress={() => setOpen(true)}>Open</Button>
<Drawer isOpen={open} onOpenChange={setOpen}>
  <DialogContent>
    <DrawerHandle />
    <DialogHeader>
      <DialogTitle>Controlled</DialogTitle>
    </DialogHeader>
    <DialogBody>Drag to dismiss, click outside, or press Escape.</DialogBody>
  </DialogContent>
</Drawer>
```

## Drawer non-dismissable

```tsx
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Drawer, DrawerHandle } from "@/components/ui/drawer"
```

```tsx
<Dialog>
  <Button>Open non-dismissable</Button>
  <Drawer swipeToDismiss={false} isDismissable={false} isKeyboardDismissDisabled>
    <DialogContent>
      <DrawerHandle />
      <DialogHeader>
        <DialogTitle>Confirm action</DialogTitle>
      </DialogHeader>
      <DialogBody>Use the button below.</DialogBody>
      <DialogFooter>
        <Button slot="close">Acknowledge</Button>
      </DialogFooter>
    </DialogContent>
  </Drawer>
</Dialog>
```

## Drawer nested

```tsx
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Drawer, DrawerHandle } from "@/components/ui/drawer"
```

```tsx
<Dialog>
  <Button>Open parent drawer</Button>
  <Drawer>
    <DialogContent>
      <DrawerHandle />
      <DialogHeader>
        <DialogTitle>Parent drawer</DialogTitle>
      </DialogHeader>
      <DialogBody>Open the child drawer below.</DialogBody>
      <DialogFooter>
        <Dialog>
          <Button>Open child drawer</Button>
          <Drawer>
            <DialogContent>
              <DrawerHandle />
              <DialogHeader>
                <DialogTitle>Child drawer</DialogTitle>
              </DialogHeader>
              <DialogBody>The parent stays open underneath.</DialogBody>
            </DialogContent>
          </Drawer>
        </Dialog>
      </DialogFooter>
    </DialogContent>
  </Drawer>
</Dialog>
```

## Drawer scrollable

```tsx
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Drawer, DrawerHandle } from "@/components/ui/drawer"
```

```tsx
<Dialog>
  <Button>Open scrollable drawer</Button>
  <Drawer>
    <DialogContent>
      <DrawerHandle />
      <DialogHeader>
        <DialogTitle>Scrollable content</DialogTitle>
      </DialogHeader>
      <DialogBody className="max-h-80 overflow-y-auto">
        {items.map((item) => (
          <p key={item.id} className="border-b py-3">
            {item.label}
          </p>
        ))}
      </DialogBody>
    </DialogContent>
  </Drawer>
</Dialog>
```

## Drawer with form

```tsx
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Drawer, DrawerHandle } from "@/components/ui/drawer"
import { Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"
```

```tsx
<Dialog>
  <Button>Open form drawer</Button>
  <Drawer>
    <DialogContent>
      <DrawerHandle />
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>Inputs don't trigger drag.</DialogDescription>
      </DialogHeader>
      <DialogBody className="flex flex-col gap-3">
        <TextField>
          <Label>Name</Label>
          <Input defaultValue="Jane Doe" />
        </TextField>
        <TextField>
          <Label>Email</Label>
          <Input type="email" defaultValue="jane@example.com" />
        </TextField>
      </DialogBody>
      <DialogFooter>
        <Button slot="close" variant="quiet">
          Cancel
        </Button>
        <Button slot="close">Save</Button>
      </DialogFooter>
    </DialogContent>
  </Drawer>
</Dialog>
```

## Drawer page indent

Wrap the app root so the page scales back behind an open drawer; `DrawerProvider` scopes the visual state explicitly and is optional.

```tsx
import {
  DrawerIndent,
  DrawerIndentBackground,
  DrawerProvider,
} from "@/components/ui/drawer"
```

```tsx
<DrawerProvider>
  <DrawerIndentBackground />
  <DrawerIndent>{children}</DrawerIndent>
</DrawerProvider>
```

## Drawer with swipe area

`DrawerSwipeArea` is an edge region that opens the drawer by swiping.

```tsx
import { DialogContent } from "@/components/ui/dialog"
import { Drawer, DrawerHandle, DrawerSwipeArea } from "@/components/ui/drawer"
```

```tsx
<Drawer placement="left">
  <DrawerSwipeArea />
  <DialogContent>
    <DrawerHandle />
    Drawer content
  </DialogContent>
</Drawer>
```

## Popover

```tsx
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Popover } from "@/components/ui/popover"
```

```tsx
<Dialog>
  <Button>Open popover</Button>
  <Popover>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Dimensions</DialogTitle>
        <DialogDescription>Set the dimensions of the popover.</DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Popover>
</Dialog>
```

## Popover placement

```tsx
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Popover } from "@/components/ui/popover"
```

```tsx
<Dialog>
  <Button variant="secondary" size="sm">
    Start
  </Button>
  <Popover placement="bottom start" className="w-48">
    <DialogContent aria-label="Placed at start">Placed at bottom start</DialogContent>
  </Popover>
</Dialog>
```

## Popover with arrow

```tsx
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Popover } from "@/components/ui/popover"
```

```tsx
<Dialog>
  <Button>Open Popover</Button>
  <Popover showArrow placement="top">
    <DialogContent className="w-56">
      <DialogTitle>Popover Title</DialogTitle>
      <p className="text-sm text-fg-muted">This is a popover with some content.</p>
    </DialogContent>
  </Popover>
</Dialog>
```

## Popover with form

```tsx
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FieldGroup, Label } from "@/components/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { Popover } from "@/components/ui/popover"
import { TextField } from "@/components/ui/text-field"
```

```tsx
<Dialog>
  <Button variant="secondary">Open Popover</Button>
  <Popover placement="bottom start" className="w-64">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Dimensions</DialogTitle>
        <DialogDescription>Set the dimensions for the layer.</DialogDescription>
      </DialogHeader>
      <FieldGroup className="gap-4 **:data-label:w-18 **:data-textfield:flex-row">
        <TextField defaultValue="100" autoFocus>
          <Label>Width</Label>
          <InputGroup>
            <Input />
            <InputGroupAddon>%</InputGroupAddon>
          </InputGroup>
        </TextField>
        <TextField defaultValue="25">
          <Label>Height</Label>
          <InputGroup>
            <Input />
            <InputGroupAddon>px</InputGroupAddon>
          </InputGroup>
        </TextField>
      </FieldGroup>
    </DialogContent>
  </Popover>
</Dialog>
```

## Popover in dialog

```tsx
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Modal } from "@/components/ui/modal"
import { Popover } from "@/components/ui/popover"
```

```tsx
<Dialog>
  <Button variant="secondary">Open Dialog</Button>
  <Modal>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Popover Example</DialogTitle>
        <DialogDescription>Click the button below to see the popover.</DialogDescription>
      </DialogHeader>
      <Dialog>
        <Button variant="secondary" className="w-fit">
          Open Popover
        </Button>
        <Popover placement="bottom start">
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Popover in Dialog</DialogTitle>
              <DialogDescription>This popover appears inside a dialog.</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Popover>
      </Dialog>
    </DialogContent>
  </Modal>
</Dialog>
```

## Popover responsive (Drawer on mobile)

```tsx
import { Responsive } from "@/lib/responsive"
import { InfoIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Drawer } from "@/components/ui/drawer"
import { Popover } from "@/components/ui/popover"
```

```tsx
<Dialog>
  <Button variant="secondary" isIconOnly aria-label="Help">
    <InfoIcon />
  </Button>
  <Responsive
    render={(isMobile) => {
      const content = (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Help</DialogTitle>
            <DialogDescription>
              For help accessing your account, please contact support.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      )
      return isMobile ? <Drawer>{content}</Drawer> : <Popover>{content}</Popover>
    }}
  />
</Dialog>
```

## Tooltip

```tsx
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent } from "@/components/ui/tooltip"
```

```tsx
<Tooltip>
  <Button variant="secondary">Hover me</Button>
  <TooltipContent>Add to library</TooltipContent>
</Tooltip>
```

## Tooltip on icon button

```tsx
import { InfoIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent } from "@/components/ui/tooltip"
```

```tsx
<Tooltip>
  <Button variant="quiet" isIconOnly aria-label="Info">
    <InfoIcon />
  </Button>
  <TooltipContent>Additional information</TooltipContent>
</Tooltip>
```

## Tooltip with keyboard shortcut

```tsx
import { SaveIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { Tooltip, TooltipContent } from "@/components/ui/tooltip"
```

```tsx
<Tooltip>
  <Button variant="secondary" isIconOnly aria-label="Save">
    <SaveIcon />
  </Button>
  <TooltipContent>
    Save changes <Kbd>S</Kbd>
  </TooltipContent>
</Tooltip>
```

## Tooltip formatted content

```tsx
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent } from "@/components/ui/tooltip"
```

```tsx
<Tooltip>
  <Button variant="secondary">Status</Button>
  <TooltipContent className="text-left">
    <div className="flex flex-col gap-1">
      <p className="font-semibold">Active</p>
      <p className="text-xs opacity-80">Last updated 2 hours ago</p>
    </div>
  </TooltipContent>
</Tooltip>
```

## Tooltip on link

Any focusable trigger works, not just a Button.

```tsx
import { Link } from "@/components/ui/link"
import { Tooltip, TooltipContent } from "@/components/ui/tooltip"
```

```tsx
<Tooltip>
  <Link href="#">Learn more</Link>
  <TooltipContent>Click to read the documentation</TooltipContent>
</Tooltip>
```

## Tooltip placement

```tsx
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent } from "@/components/ui/tooltip"
```

```tsx
<Tooltip>
  <Button>right top</Button>
  <TooltipContent placement="right top">Edit name</TooltipContent>
</Tooltip>
```

## Tooltip without arrow

```tsx
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent } from "@/components/ui/tooltip"
```

```tsx
<Tooltip>
  <Button>Hover me</Button>
  <TooltipContent hideArrow>Tooltip content</TooltipContent>
</Tooltip>
```

## Tooltip delay

`delay` defaults to 700ms and `closeDelay` to 0.

```tsx
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent } from "@/components/ui/tooltip"
```

```tsx
<Tooltip delay={0} closeDelay={200}>
  <Button>Hover me</Button>
  <TooltipContent>Opens instantly</TooltipContent>
</Tooltip>
```

## Tooltip controlled

```tsx
import React from "react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent } from "@/components/ui/tooltip"
```

```tsx
const [isOpen, setIsOpen] = React.useState(false)

<Tooltip isOpen={isOpen} onOpenChange={setIsOpen}>
  <Button>Hover me</Button>
  <TooltipContent>Controlled</TooltipContent>
</Tooltip>
```

## Tooltip inside an input addon

```tsx
import { InfoIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { Kbd } from "@/components/ui/kbd"
import { TextField } from "@/components/ui/text-field"
import { Tooltip, TooltipContent } from "@/components/ui/tooltip"
```

```tsx
<TextField>
  <Label>Nickname</Label>
  <InputGroup>
    <Input placeholder="Broski" />
    <InputGroupAddon>
      <Tooltip>
        <Button aria-label="Nickname info" isIconOnly size="xs" variant="quiet">
          <InfoIcon />
        </Button>
        <TooltipContent>
          Used to identify you in the chat. <Kbd>N</Kbd>
        </TooltipContent>
      </Tooltip>
    </InputGroupAddon>
  </InputGroup>
</TextField>
```

## Toast provider

Mount `ToastProvider` once at the app root; toasts are then pushed imperatively.

```tsx
import { ToastProvider } from "@/components/ui/toast"
```

```tsx
<ToastProvider>
  <App />
</ToastProvider>
```

## Toast

```tsx
import { Button } from "@/components/ui/button"
import { toastManager } from "@/components/ui/toast"
```

```tsx
<Button onPress={() => toastManager.add({ title: "Your message has been sent." })}>
  Show toast
</Button>
```

## Toast variants

`type` is one of `neutral`, `success`, `error`, `danger`, `warning`, `info`, `loading`.

```tsx
import { Button } from "@/components/ui/button"
import { toastManager } from "@/components/ui/toast"
```

```tsx
<Button
  onPress={() =>
    toastManager.add({
      title: "Changes saved",
      description: "Your update is live.",
      type: "success",
    })
  }
>
  Success
</Button>
<Button
  onPress={() =>
    toastManager.add({
      title: "Upload failed",
      description: "Check your connection and try again.",
      type: "error",
    })
  }
>
  Error
</Button>
```

## Toast with action

`add` returns an id you can pass to `close`.

```tsx
import { Button } from "@/components/ui/button"
import { toastManager } from "@/components/ui/toast"
```

```tsx
function showActionToast() {
  const id = toastManager.add({
    title: "Message archived",
    description: "The conversation was moved out of your inbox.",
    type: "info",
    actionProps: {
      children: "Undo",
      onClick: () => {
        toastManager.close(id)
        toastManager.add({ title: "Message restored", type: "success" })
      },
    },
  })
}

<Button onPress={showActionToast}>Archive message</Button>
```

## Toast promise

```tsx
import { Button } from "@/components/ui/button"
import { toastManager } from "@/components/ui/toast"
```

```tsx
<Button
  onPress={() => {
    void toastManager.promise(publish(), {
      loading: { title: "Publishing changes", type: "loading" },
      success: {
        title: "Published",
        description: "The latest version is now live.",
        type: "success",
      },
      error: {
        title: "Publish failed",
        description: "Something went wrong while publishing.",
        type: "error",
      },
    })
  }}
>
  Publish
</Button>
```

## Toast position & provider options

`position` sets the viewport corner and the swipe direction; `limit` caps visible toasts (default 3) and `timeout` is the auto-dismiss duration (default 5000).

```tsx
import { ToastProvider } from "@/components/ui/toast"
```

```tsx
<ToastProvider position="top-center" limit={5} timeout={8000}>
  <App />
</ToastProvider>
```

# Dates & Times

## Calendar

Single-date selection with the default header and grid rendered for you.

```tsx
import { getLocalTimeZone, today } from "@internationalized/date"

import { Calendar } from "@/components/ui/calendar"
```

```tsx
<Calendar aria-label="Date" defaultValue={today(getLocalTimeZone())} />
```

## Range Calendar

Contiguous date-range selection; the value is a `{ start, end }` object.

```tsx
import { getLocalTimeZone, today } from "@internationalized/date"

import { RangeCalendar } from "@/components/ui/calendar"
```

```tsx
<RangeCalendar
  aria-label="Trip dates"
  defaultValue={{
    start: today(getLocalTimeZone()).subtract({ days: 6 }),
    end: today(getLocalTimeZone()),
  }}
/>
```

## Calendar composed from parts

Full control over header, heading and grid; `Button slot="previous"|"next"` wire navigation.

```tsx
import { getLocalTimeZone, today } from "@internationalized/date"

import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeader,
  CalendarHeaderCell,
  CalendarHeading,
} from "@/components/ui/calendar"
```

```tsx
<Calendar aria-label="Date" defaultValue={today(getLocalTimeZone())}>
  <CalendarHeader>
    <Button slot="previous" variant="quiet" isIconOnly>
      <ChevronLeftIcon />
    </Button>
    <CalendarHeading />
    <Button slot="next" variant="quiet" isIconOnly>
      <ChevronRightIcon />
    </Button>
  </CalendarHeader>
  <CalendarGrid>
    <CalendarGridHeader>
      {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
    </CalendarGridHeader>
    <CalendarGridBody>
      {(date) => <CalendarCell date={date} />}
    </CalendarGridBody>
  </CalendarGrid>
</Calendar>
```

## Calendar controlled

```tsx
import React from "react"
import { getLocalTimeZone, today } from "@internationalized/date"
import type { DateValue } from "react-aria-components"

import { Calendar } from "@/components/ui/calendar"
```

```tsx
const [date, setDate] = React.useState<DateValue | null>(
  today(getLocalTimeZone()),
)

<Calendar aria-label="Booking date" value={date} onChange={setDate} />
```

## Calendar min & max

```tsx
import { getLocalTimeZone, today } from "@internationalized/date"

import { Calendar } from "@/components/ui/calendar"
```

```tsx
const now = today(getLocalTimeZone())

<Calendar
  aria-label="Date"
  defaultValue={now}
  minValue={now.subtract({ days: 3 })}
  maxValue={now.add({ days: 14 })}
/>
```

## Calendar unavailable dates

Disable individual dates (weekends, booked ranges) with `isDateUnavailable`.

```tsx
import { getLocalTimeZone, today } from "@internationalized/date"
import type { DateValue } from "react-aria-components"

import { Calendar } from "@/components/ui/calendar"
```

```tsx
const now = today(getLocalTimeZone())
const bookedStart = now.add({ days: 5 })
const bookedEnd = now.add({ days: 19 })
const isBooked = (d: DateValue) =>
  d.compare(bookedStart) >= 0 && d.compare(bookedEnd) <= 0

<Calendar
  aria-label="Booking date"
  defaultValue={now}
  isDateUnavailable={isBooked}
/>
```

## Range Calendar with non-contiguous ranges

Lets a range span unavailable dates.

```tsx
import { getLocalTimeZone, today } from "@internationalized/date"
import type { DateValue } from "@internationalized/date"

import { RangeCalendar } from "@/components/ui/calendar"
```

```tsx
const now = today(getLocalTimeZone())
const disabledRanges: [DateValue, DateValue][] = [
  [now, now.add({ days: 5 })],
  [now.add({ days: 14 }), now.add({ days: 16 })],
]
const isDateUnavailable = (date: DateValue) =>
  disabledRanges.some(
    ([start, end]) => date.compare(start) >= 0 && date.compare(end) <= 0,
  )

<RangeCalendar
  aria-label="Trip dates"
  minValue={now}
  isDateUnavailable={isDateUnavailable}
  allowsNonContiguousRanges
/>
```

## Range Calendar with multiple months

`visibleDuration` plus one `CalendarGrid` per month `offset`.

```tsx
import {
  CalendarGrid,
  CalendarHeader,
  RangeCalendar,
} from "@/components/ui/calendar"
```

```tsx
<RangeCalendar aria-label="Trip dates" visibleDuration={{ months: 2 }}>
  <CalendarHeader />
  <div className="flex items-start gap-4">
    <CalendarGrid offset={{ months: 0 }} />
    <CalendarGrid offset={{ months: 1 }} />
  </div>
</RangeCalendar>
```

## Calendar short weekdays

```tsx
import { getLocalTimeZone, today } from "@internationalized/date"

import { Calendar, CalendarGrid, CalendarHeader } from "@/components/ui/calendar"
```

```tsx
<Calendar aria-label="Date" defaultValue={today(getLocalTimeZone())}>
  <CalendarHeader />
  <CalendarGrid weekdayStyle="short" />
</Calendar>
```

## Calendar with custom cell content

`CalendarCell` takes a render function with `formattedDate`, `isToday`, `isOutsideMonth`, `date`.

```tsx
import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeader,
  CalendarHeaderCell,
} from "@/components/ui/calendar"
```

```tsx
<Calendar aria-label="Date">
  <CalendarHeader />
  <CalendarGrid>
    <CalendarGridHeader>
      {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
    </CalendarGridHeader>
    <CalendarGridBody>
      {(date) => (
        <CalendarCell date={date}>
          {({ formattedDate, isToday }) => (
            <>
              <span>{formattedDate}</span>
              {isToday && (
                <span className="absolute bottom-1 left-1/2 size-0.75 -translate-x-1/2 rounded-full bg-accent" />
              )}
            </>
          )}
        </CalendarCell>
      )}
    </CalendarGridBody>
  </CalendarGrid>
</Calendar>
```

## Range Calendar with per-day pricing

Custom cell content on a range calendar, with a larger cell via the `--cell-size` variable.

```tsx
import { isWeekend } from "@internationalized/date"
import { useLocale } from "react-aria-components"
import type { DateValue } from "react-aria-components"

import {
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeader,
  CalendarHeaderCell,
  RangeCalendar,
} from "@/components/ui/calendar"
```

```tsx
const { locale } = useLocale()
const getPrice = (d: DateValue) => (isWeekend(d, locale) ? "$120" : "$100")

<RangeCalendar aria-label="Stay" className="[--cell-size:--spacing(12)]">
  <CalendarHeader />
  <CalendarGrid>
    <CalendarGridHeader>
      {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
    </CalendarGridHeader>
    <CalendarGridBody>
      {(date) => (
        <CalendarCell date={date}>
          {({ formattedDate, date, isOutsideMonth }) => (
            <span className="flex flex-col">
              <span>{formattedDate}</span>
              {!isOutsideMonth && (
                <span className="text-xs text-fg-muted">{getPrice(date)}</span>
              )}
            </span>
          )}
        </CalendarCell>
      )}
    </CalendarGridBody>
  </CalendarGrid>
</RangeCalendar>
```

## Calendar with presets

Preset buttons set both `value` and `focusedValue` so the visible month follows the selection.

```tsx
import React from "react"
import { getLocalTimeZone, today } from "@internationalized/date"
import type { DateValue } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
```

```tsx
const [date, setDate] = React.useState<DateValue | null>(today(getLocalTimeZone()))
const [focused, setFocused] = React.useState<DateValue>(today(getLocalTimeZone()))
const presets = [
  { label: "Today", days: 0 },
  { label: "Tomorrow", days: 1 },
  { label: "In a week", days: 7 },
]

<Card className="w-fit">
  <CardContent>
    <Calendar
      aria-label="Date"
      value={date}
      onChange={setDate}
      focusedValue={focused}
      onFocusChange={setFocused}
    />
  </CardContent>
  <CardFooter className="flex-wrap gap-2 border-t">
    {presets.map((preset) => (
      <Button
        key={preset.label}
        variant="secondary"
        className="flex-1"
        onPress={() => {
          const next = today(getLocalTimeZone()).add({ days: preset.days })
          setDate(next)
          setFocused(next)
        }}
      >
        {preset.label}
      </Button>
    ))}
  </CardFooter>
</Card>
```

## Calendar with time fields

Date and time picked together: a calendar above two time fields in a card.

```tsx
import React from "react"
import { getLocalTimeZone, Time, today } from "@internationalized/date"
import type { DateValue } from "react-aria-components"

import { TimerIcon } from "@/components/icons"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/field"
import { DateInput, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { TimeField } from "@/components/ui/time-field"
```

```tsx
const [date, setDate] = React.useState<DateValue | null>(today(getLocalTimeZone()))

<Card className="w-fit">
  <CardContent>
    <Calendar aria-label="Date" value={date} onChange={setDate} />
  </CardContent>
  <CardFooter className="flex flex-col gap-4 border-t">
    <TimeField className="w-full" defaultValue={new Time(11, 45)}>
      <Label>Start time</Label>
      <InputGroup>
        <InputGroupAddon>
          <TimerIcon />
        </InputGroupAddon>
        <DateInput />
      </InputGroup>
    </TimeField>
    <TimeField className="w-full" defaultValue={new Time(13, 30)}>
      <Label>End time</Label>
      <InputGroup>
        <InputGroupAddon>
          <TimerIcon />
        </InputGroupAddon>
        <DateInput />
      </InputGroup>
    </TimeField>
  </CardFooter>
</Card>
```

## Calendar scheduler

Event-per-day cells: `CalendarCell` restyled as a tall block rendering badges from external state.

```tsx
import React from "react"
import { getLocalTimeZone, today } from "@internationalized/date"
import type { DateValue } from "react-aria-components"

import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeader,
  CalendarHeaderCell,
} from "@/components/ui/calendar"
```

```tsx
const [selectedDate, setSelectedDate] = React.useState<DateValue>(today(getLocalTimeZone()))
const getEvents = (d: DateValue) => eventsByDay.get(d.toString()) ?? []

<Calendar
  aria-label="Schedule"
  value={selectedDate}
  onChange={(d) => d && setSelectedDate(d)}
>
  <CalendarHeader />
  <CalendarGrid>
    <CalendarGridHeader>
      {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
    </CalendarGridHeader>
    <CalendarGridBody>
      {(date) => (
        <CalendarCell
          date={date}
          className="flex aspect-auto h-20 w-full flex-col items-stretch justify-start gap-0.5 rounded-md p-2 text-left selected:bg-accent/15! selected:text-fg!"
        >
          {({ formattedDate, isOutsideMonth }) => (
            <>
              <span className="text-xs font-medium">{formattedDate}</span>
              {!isOutsideMonth &&
                getEvents(date).slice(0, 2).map((e) => (
                  <Badge key={e.id} variant={e.variant} appearance="subtle" size="sm">
                    <span className="min-w-0 flex-1 truncate">{e.title}</span>
                  </Badge>
                ))}
            </>
          )}
        </CalendarCell>
      )}
    </CalendarGridBody>
  </CalendarGrid>
</Calendar>
```

## Calendar states

`isDisabled`, `isReadOnly`, `isInvalid` on the root.

```tsx
import { getLocalTimeZone, today } from "@internationalized/date"

import { Calendar } from "@/components/ui/calendar"
```

```tsx
<Calendar aria-label="Date" defaultValue={today(getLocalTimeZone())} isDisabled />
<Calendar aria-label="Date" defaultValue={today(getLocalTimeZone())} isReadOnly />
<Calendar aria-label="Date" defaultValue={today(getLocalTimeZone())} isInvalid />
```

## Calendar international

Wrap in `I18nProvider` to change locale and calendar system.

```tsx
import { getLocalTimeZone, today } from "@internationalized/date"
import { I18nProvider } from "react-aria-components"

import { Calendar } from "@/components/ui/calendar"
```

```tsx
<I18nProvider locale="ar-EG">
  <Calendar aria-label="التاريخ" defaultValue={today(getLocalTimeZone())} />
</I18nProvider>
```

## Date Field

Keyboard-editable date segments; `DateInput` comes from the input item.

```tsx
import { DateField } from "@/components/ui/date-field"
import { DateInput } from "@/components/ui/input"
```

```tsx
<DateField aria-label="Meeting date">
  <DateInput />
</DateField>
```

## Date Field with label, description & error

```tsx
import { DateField } from "@/components/ui/date-field"
import { Description, FieldError, Label } from "@/components/ui/field"
import { DateInput } from "@/components/ui/input"
```

```tsx
<DateField isInvalid>
  <Label>Event date</Label>
  <DateInput />
  <Description>Please select a date.</Description>
  <FieldError>Please select a date.</FieldError>
</DateField>
```

## Date Field uncontrolled & placeholder

```tsx
import { CalendarDate, parseDate } from "@internationalized/date"

import { DateField } from "@/components/ui/date-field"
import { Label } from "@/components/ui/field"
import { DateInput } from "@/components/ui/input"
```

```tsx
<DateField aria-label="Event date" defaultValue={parseDate("2020-02-03")}>
  <DateInput />
</DateField>

<DateField placeholderValue={new CalendarDate(1980, 1, 1)}>
  <Label>Meeting date</Label>
  <DateInput />
</DateField>
```

## Date Field controlled

```tsx
import React from "react"
import { parseDate } from "@internationalized/date"
import type { DateValue } from "react-aria-components"

import { DateField } from "@/components/ui/date-field"
import { DateInput } from "@/components/ui/input"
```

```tsx
const [value, setValue] = React.useState<DateValue | null>(parseDate("2020-02-03"))

<DateField aria-label="Event date" value={value} onChange={setValue}>
  <DateInput />
</DateField>
```

## Date Field granularity

`granularity` (`day` | `hour` | `minute` | `second`) decides which segments render.

```tsx
import { parseAbsoluteToLocal } from "@internationalized/date"

import { DateField } from "@/components/ui/date-field"
import { Label } from "@/components/ui/field"
import { DateInput } from "@/components/ui/input"
```

```tsx
<DateField
  granularity="minute"
  defaultValue={parseAbsoluteToLocal("2021-04-07T18:45:22Z")}
>
  <Label>Minute</Label>
  <DateInput />
</DateField>
```

## Date Field time zones

A `ZonedDateTime` value shows its zone; `hideTimeZone` hides the segment.

```tsx
import { parseZonedDateTime } from "@internationalized/date"

import { DateField } from "@/components/ui/date-field"
import { Label } from "@/components/ui/field"
import { DateInput } from "@/components/ui/input"
```

```tsx
<DateField
  aria-label="Meeting time"
  defaultValue={parseZonedDateTime("2022-11-07T00:45[America/Los_Angeles]")}
>
  <DateInput />
</DateField>

<DateField
  granularity="minute"
  defaultValue={parseZonedDateTime("2022-11-07T10:45[America/Los_Angeles]")}
  hideTimeZone
>
  <Label>Appointment time</Label>
  <DateInput />
</DateField>
```

## Date Field hour cycle

```tsx
import { DateField } from "@/components/ui/date-field"
import { DateInput } from "@/components/ui/input"
```

```tsx
<DateField aria-label="Appointment date" granularity="minute" hourCycle={24}>
  <DateInput />
</DateField>
```

## Date Field with prefix/suffix icon

`InputGroup` + `InputGroupAddon` around `DateInput`.

```tsx
import { CalendarIcon } from "@/components/icons"
import { DateField } from "@/components/ui/date-field"
import { DateInput, InputGroup, InputGroupAddon } from "@/components/ui/input"
```

```tsx
<DateField aria-label="Meeting date">
  <InputGroup>
    <InputGroupAddon>
      <CalendarIcon />
    </InputGroupAddon>
    <DateInput />
  </InputGroup>
</DateField>

<DateField aria-label="Meeting date">
  <InputGroup>
    <DateInput />
    <InputGroupAddon>
      <CalendarIcon />
    </InputGroupAddon>
  </InputGroup>
</DateField>
```

## Date Field sizes

Size lives on `DateInput`.

```tsx
import { DateField } from "@/components/ui/date-field"
import { Label } from "@/components/ui/field"
import { DateInput } from "@/components/ui/input"
```

```tsx
<DateField>
  <Label>Small</Label>
  <DateInput size="sm" />
</DateField>
<DateField>
  <Label>Medium</Label>
  <DateInput size="md" />
</DateField>
<DateField>
  <Label>Large</Label>
  <DateInput size="lg" />
</DateField>
```

## Date Field states

```tsx
import { CalendarDate } from "@internationalized/date"

import { DateField } from "@/components/ui/date-field"
import { Label } from "@/components/ui/field"
import { DateInput } from "@/components/ui/input"
```

```tsx
<DateField isDisabled>
  <Label>Event date</Label>
  <DateInput />
</DateField>

<DateField aria-label="Event date" value={new CalendarDate(1980, 1, 1)} isReadOnly>
  <DateInput />
</DateField>

<DateField aria-label="Event date" isRequired>
  <DateInput />
</DateField>
```

## Date Field in a form

Native form fields via `name`; validation surfaced on submit through `FieldError`.

```tsx
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { DateField } from "@/components/ui/date-field"
import { Description, FieldError, Label } from "@/components/ui/field"
import { DateInput } from "@/components/ui/input"
```

```tsx
const [submitted, setSubmitted] = useState(false)

<form
  noValidate
  className="flex w-full max-w-xs flex-col gap-4"
  onSubmit={(event) => {
    event.preventDefault()
    setSubmitted(true)
  }}
>
  <DateField name="appointment" granularity="minute" isRequired isInvalid={submitted}>
    <Label>Appointment</Label>
    <DateInput />
    <Description>We will confirm your slot by email.</Description>
    <FieldError>Please choose a date and time.</FieldError>
  </DateField>
  <DateField name="event-time" granularity="minute">
    <Label>Start time (optional)</Label>
    <DateInput />
    <Description>Leave empty for an all-day event.</Description>
  </DateField>
  <Button type="submit" className="w-full">
    Schedule
  </Button>
</form>
```

## Date Picker

A date field plus a trigger button and a calendar popover.

```tsx
import { parseDate } from "@internationalized/date"

import { CalendarIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { DatePicker } from "@/components/ui/date-picker"
import { DialogContent } from "@/components/ui/dialog"
import { DateInput, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { Popover } from "@/components/ui/popover"
```

```tsx
<DatePicker className="w-52" aria-label="Meeting date" defaultValue={parseDate("2020-02-03")}>
  <InputGroup>
    <DateInput />
    <InputGroupAddon>
      <Button variant="secondary" size="sm" isIconOnly>
        <CalendarIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Popover>
    <DialogContent>
      <Calendar />
    </DialogContent>
  </Popover>
</DatePicker>
```

## Date Picker with label, description & error

```tsx
import { CalendarIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { DatePicker } from "@/components/ui/date-picker"
import { DialogContent } from "@/components/ui/dialog"
import { Description, FieldError, Label } from "@/components/ui/field"
import { DateInput, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { Popover } from "@/components/ui/popover"
```

```tsx
<DatePicker className="w-52" isRequired>
  <Label>Meeting date</Label>
  <InputGroup>
    <DateInput />
    <InputGroupAddon>
      <Button variant="secondary" size="sm" isIconOnly>
        <CalendarIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Description>Please select a date.</Description>
  <FieldError>Meetings can't be scheduled in the past.</FieldError>
  <Popover>
    <DialogContent>
      <Calendar />
    </DialogContent>
  </Popover>
</DatePicker>
```

## Date Picker controlled

```tsx
import React from "react"
import { parseDate } from "@internationalized/date"
import type { DateValue } from "react-aria-components"

import { CalendarIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { DatePicker } from "@/components/ui/date-picker"
import { DialogContent } from "@/components/ui/dialog"
import { Label } from "@/components/ui/field"
import { DateInput, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { Popover } from "@/components/ui/popover"
```

```tsx
const [value, setValue] = React.useState<DateValue | null>(parseDate("2020-02-03"))

<DatePicker value={value} onChange={setValue}>
  <Label>Meeting date</Label>
  <InputGroup>
    <DateInput />
    <InputGroupAddon>
      <Button variant="secondary" size="sm" isIconOnly>
        <CalendarIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Popover>
    <DialogContent>
      <Calendar />
    </DialogContent>
  </Popover>
</DatePicker>
```

## Date Picker granularity, time zones & hour cycle

Same field props as `DateField`: `granularity`, `hideTimeZone`, `hourCycle`, `placeholderValue`.

```tsx
import { parseZonedDateTime } from "@internationalized/date"

import { CalendarIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { DatePicker } from "@/components/ui/date-picker"
import { DialogContent } from "@/components/ui/dialog"
import { Label } from "@/components/ui/field"
import { DateInput, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { Popover } from "@/components/ui/popover"
```

```tsx
<DatePicker
  className="w-52"
  granularity="minute"
  hourCycle={24}
  defaultValue={parseZonedDateTime("2022-11-07T10:45[America/Los_Angeles]")}
  hideTimeZone
>
  <Label>Appointment time</Label>
  <InputGroup>
    <DateInput />
    <InputGroupAddon>
      <Button variant="secondary" size="sm" isIconOnly>
        <CalendarIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Popover>
    <DialogContent>
      <Calendar />
    </DialogContent>
  </Popover>
</DatePicker>
```

## Date Picker states

```tsx
import { CalendarDate } from "@internationalized/date"

import { CalendarIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { DatePicker } from "@/components/ui/date-picker"
import { DialogContent } from "@/components/ui/dialog"
import { Label } from "@/components/ui/field"
import { DateInput, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { Popover } from "@/components/ui/popover"
```

```tsx
<DatePicker className="w-52" value={new CalendarDate(1980, 1, 1)} isReadOnly>
  <Label>Event date</Label>
  <InputGroup>
    <DateInput />
    <InputGroupAddon>
      <Button variant="secondary" size="sm" isIconOnly>
        <CalendarIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Popover>
    <DialogContent>
      <Calendar />
    </DialogContent>
  </Popover>
</DatePicker>

<DatePicker className="w-52" aria-label="Event date" isDisabled>
  {/* same children */}
</DatePicker>
```

## Date Picker in a modal

Swap `Popover` for `Modal`; the rest of the composition is unchanged.

```tsx
import { CalendarIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { DatePicker } from "@/components/ui/date-picker"
import { DialogContent } from "@/components/ui/dialog"
import { DateInput, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
```

```tsx
<DatePicker className="w-52" aria-label="Meeting date">
  <InputGroup>
    <DateInput />
    <InputGroupAddon>
      <Button variant="secondary" size="sm" isIconOnly>
        <CalendarIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Modal>
    <DialogContent>
      <Calendar />
    </DialogContent>
  </Modal>
</DatePicker>
```

## Date Picker in a drawer

```tsx
import { CalendarIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { DatePicker } from "@/components/ui/date-picker"
import { DialogContent } from "@/components/ui/dialog"
import { Drawer } from "@/components/ui/drawer"
import { DateInput, InputGroup, InputGroupAddon } from "@/components/ui/input"
```

```tsx
<DatePicker className="w-52" aria-label="Meeting date">
  <InputGroup>
    <DateInput />
    <InputGroupAddon>
      <Button variant="secondary" size="sm" isIconOnly>
        <CalendarIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Drawer placement="bottom">
    <DialogContent>
      <Calendar />
    </DialogContent>
  </Drawer>
</DatePicker>
```

## Date Range Picker

Two `DateInput`s with `slot="start"` / `slot="end"` and a `RangeCalendar` in the popover.

```tsx
import { parseDate } from "@internationalized/date"

import { CalendarIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { RangeCalendar } from "@/components/ui/calendar"
import { DateRangePicker } from "@/components/ui/date-picker"
import { DialogContent } from "@/components/ui/dialog"
import { DateInput, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { Popover } from "@/components/ui/popover"
```

```tsx
<DateRangePicker
  className="w-52"
  aria-label="Meeting date"
  defaultValue={{ start: parseDate("2020-02-03"), end: parseDate("2020-02-12") }}
>
  <InputGroup>
    <DateInput slot="start" />
    <span>–</span>
    <DateInput slot="end" />
    <InputGroupAddon>
      <Button variant="secondary" size="sm" isIconOnly>
        <CalendarIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Popover>
    <DialogContent>
      <RangeCalendar />
    </DialogContent>
  </Popover>
</DateRangePicker>
```

## Date Range Picker with label, description & error

```tsx
import { CalendarIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { RangeCalendar } from "@/components/ui/calendar"
import { DateRangePicker } from "@/components/ui/date-picker"
import { DialogContent } from "@/components/ui/dialog"
import { Description, FieldError, Label } from "@/components/ui/field"
import { DateInput, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { Popover } from "@/components/ui/popover"
```

```tsx
<DateRangePicker className="w-52" isRequired>
  <Label>Meeting date</Label>
  <InputGroup>
    <DateInput slot="start" />
    <span>–</span>
    <DateInput slot="end" />
    <InputGroupAddon>
      <Button variant="secondary" size="sm" isIconOnly>
        <CalendarIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Description>Please select a date.</Description>
  <FieldError />
  <Popover>
    <DialogContent>
      <RangeCalendar />
    </DialogContent>
  </Popover>
</DateRangePicker>
```

## Date Range Picker controlled

The value is a `DateRange` (`{ start, end }`); format ends separately with `useDateFormatter`.

```tsx
import React from "react"
import { getLocalTimeZone, parseDate } from "@internationalized/date"
import { useDateFormatter } from "react-aria"
import type { DateRange } from "react-aria-components"

import { CalendarIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { RangeCalendar } from "@/components/ui/calendar"
import { DateRangePicker } from "@/components/ui/date-picker"
import { DialogContent } from "@/components/ui/dialog"
import { Label } from "@/components/ui/field"
import { DateInput, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { Popover } from "@/components/ui/popover"
```

```tsx
const [value, setValue] = React.useState<DateRange | null>({
  start: parseDate("2024-02-03"),
  end: parseDate("2024-02-08"),
})
const formatter = useDateFormatter({ dateStyle: "long" })

<DateRangePicker value={value} onChange={setValue}>
  <Label>Meeting date</Label>
  <InputGroup>
    <DateInput slot="start" />
    <span>–</span>
    <DateInput slot="end" />
    <InputGroupAddon>
      <Button variant="secondary" size="sm" isIconOnly>
        <CalendarIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Popover>
    <DialogContent>
      <RangeCalendar />
    </DialogContent>
  </Popover>
</DateRangePicker>
<p className="text-sm text-fg-muted">
  {value
    ? `${formatter.format(value.start.toDate(getLocalTimeZone()))} – ${formatter.format(value.end.toDate(getLocalTimeZone()))}`
    : "--"}
</p>
```

## Date Range Picker granularity & time zones

```tsx
import { parseAbsoluteToLocal } from "@internationalized/date"

import { CalendarIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { RangeCalendar } from "@/components/ui/calendar"
import { DateRangePicker } from "@/components/ui/date-picker"
import { DialogContent } from "@/components/ui/dialog"
import { Label } from "@/components/ui/field"
import { DateInput, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { Popover } from "@/components/ui/popover"
```

```tsx
<DateRangePicker
  className="w-52"
  granularity="minute"
  hourCycle={24}
  defaultValue={{
    start: parseAbsoluteToLocal("2021-04-07T18:45:22Z"),
    end: parseAbsoluteToLocal("2021-04-08T20:00:00Z"),
  }}
  hideTimeZone
>
  <Label>Appointment time</Label>
  <InputGroup>
    <DateInput slot="start" />
    <span>–</span>
    <DateInput slot="end" />
    <InputGroupAddon>
      <Button variant="secondary" size="sm" isIconOnly>
        <CalendarIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Popover>
    <DialogContent>
      <RangeCalendar />
    </DialogContent>
  </Popover>
</DateRangePicker>
```

## Date Range Picker in a modal or drawer

```tsx
import { CalendarIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { RangeCalendar } from "@/components/ui/calendar"
import { DateRangePicker } from "@/components/ui/date-picker"
import { DialogContent } from "@/components/ui/dialog"
import { Drawer } from "@/components/ui/drawer"
import { DateInput, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
```

```tsx
<DateRangePicker className="w-52" aria-label="Meeting date">
  <InputGroup>
    <DateInput slot="start" />
    <span>–</span>
    <DateInput slot="end" />
    <InputGroupAddon>
      <Button variant="secondary" size="sm" isIconOnly>
        <CalendarIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Drawer placement="bottom">
    <DialogContent>
      <RangeCalendar />
    </DialogContent>
  </Drawer>
</DateRangePicker>

<DateRangePicker className="w-52" aria-label="Meeting date">
  {/* same InputGroup */}
  <Modal>
    <DialogContent>
      <RangeCalendar />
    </DialogContent>
  </Modal>
</DateRangePicker>
```

## Time Field

```tsx
import { DateInput } from "@/components/ui/input"
import { TimeField } from "@/components/ui/time-field"
```

```tsx
<TimeField aria-label="Event time">
  <DateInput />
</TimeField>
```

## Time Field with label, description & error

```tsx
import { Description, FieldError, Label } from "@/components/ui/field"
import { DateInput } from "@/components/ui/input"
import { TimeField } from "@/components/ui/time-field"
```

```tsx
<TimeField isInvalid>
  <Label>Meeting time</Label>
  <DateInput />
  <Description>Please select a time between 9 AM and 5 PM.</Description>
  <FieldError>Meetings start every 15 minutes.</FieldError>
</TimeField>
```

## Time Field uncontrolled & placeholder

Values are `@internationalized/date` `Time` objects.

```tsx
import { Time } from "@internationalized/date"

import { Label } from "@/components/ui/field"
import { DateInput } from "@/components/ui/input"
import { TimeField } from "@/components/ui/time-field"
```

```tsx
<TimeField aria-label="Event time" defaultValue={new Time(11, 45)}>
  <DateInput />
</TimeField>

<TimeField placeholderValue={new Time(9)}>
  <Label>Event time</Label>
  <DateInput />
</TimeField>
```

## Time Field controlled

```tsx
import React from "react"
import { Time } from "@internationalized/date"
import type { TimeValue } from "react-aria-components"

import { DateInput } from "@/components/ui/input"
import { TimeField } from "@/components/ui/time-field"
```

```tsx
const [time, setTime] = React.useState<TimeValue | null>(new Time(11, 45))

<TimeField aria-label="Event time" value={time} onChange={setTime}>
  <DateInput />
</TimeField>
```

## Time Field granularity & hour cycle

```tsx
import { Time } from "@internationalized/date"

import { Label } from "@/components/ui/field"
import { DateInput } from "@/components/ui/input"
import { TimeField } from "@/components/ui/time-field"
```

```tsx
<TimeField granularity="second" defaultValue={new Time(11, 45, 22)}>
  <Label>Second</Label>
  <DateInput />
</TimeField>

<TimeField aria-label="Appointment time" defaultValue={new Time(18, 45)} hourCycle={24}>
  <DateInput />
</TimeField>
```

## Time Field time zones

```tsx
import { parseZonedDateTime } from "@internationalized/date"

import { Label } from "@/components/ui/field"
import { DateInput } from "@/components/ui/input"
import { TimeField } from "@/components/ui/time-field"
```

```tsx
<TimeField
  aria-label="Meeting time"
  defaultValue={parseZonedDateTime("2022-11-07T00:45[America/Los_Angeles]")}
>
  <DateInput />
</TimeField>

<TimeField
  defaultValue={parseZonedDateTime("2022-11-07T10:45[America/Los_Angeles]")}
  hideTimeZone
>
  <Label>Appointment time</Label>
  <DateInput />
</TimeField>
```

## Time Field with prefix/suffix icon

```tsx
import { TimerIcon } from "@/components/icons"
import { DateInput, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { TimeField } from "@/components/ui/time-field"
```

```tsx
<TimeField aria-label="Event time">
  <InputGroup>
    <InputGroupAddon>
      <TimerIcon />
    </InputGroupAddon>
    <DateInput />
  </InputGroup>
</TimeField>

<TimeField aria-label="Event time">
  <InputGroup>
    <DateInput />
    <InputGroupAddon>
      <TimerIcon />
    </InputGroupAddon>
  </InputGroup>
</TimeField>
```

## Time Field validation with min & max

```tsx
import { Time } from "@internationalized/date"

import { FieldError, Label } from "@/components/ui/field"
import { DateInput } from "@/components/ui/input"
import { TimeField } from "@/components/ui/time-field"
```

```tsx
<TimeField isRequired minValue={new Time(9)} maxValue={new Time(17)}>
  <Label>Meeting time</Label>
  <DateInput />
  <FieldError />
</TimeField>
```

## Time Field states

```tsx
import { Time } from "@internationalized/date"

import { Label } from "@/components/ui/field"
import { DateInput } from "@/components/ui/input"
import { TimeField } from "@/components/ui/time-field"
```

```tsx
<TimeField isDisabled>
  <Label>Event time</Label>
  <DateInput />
</TimeField>

<TimeField aria-label="Event time" value={new Time(11)} isReadOnly>
  <DateInput />
</TimeField>
```

## Time Picker

A time field plus a trigger button and scrollable `TimePickerColumns` in a popover.

```tsx
import { Time } from "@internationalized/date"

import { ClockIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { DialogContent } from "@/components/ui/dialog"
import { DateInput, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { Popover } from "@/components/ui/popover"
import { TimePicker, TimePickerColumns } from "@/components/ui/time-picker"
```

```tsx
<TimePicker className="w-40" aria-label="Event time" defaultValue={new Time(9, 30)}>
  <InputGroup>
    <DateInput />
    <InputGroupAddon>
      <Button variant="secondary" size="sm" isIconOnly aria-label="Choose time">
        <ClockIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Popover>
    <DialogContent>
      <TimePickerColumns />
    </DialogContent>
  </Popover>
</TimePicker>
```

## Time Picker with label, description & error

```tsx
import { ClockIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { DialogContent } from "@/components/ui/dialog"
import { Description, FieldError, Label } from "@/components/ui/field"
import { DateInput, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { Popover } from "@/components/ui/popover"
import { TimePicker, TimePickerColumns } from "@/components/ui/time-picker"
```

```tsx
<TimePicker className="w-40" isRequired>
  <Label>Event time</Label>
  <InputGroup>
    <DateInput />
    <InputGroupAddon>
      <Button variant="secondary" size="sm" isIconOnly aria-label="Choose time">
        <ClockIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Description>We'll notify you at this time.</Description>
  <FieldError>Please choose a time during business hours.</FieldError>
  <Popover>
    <DialogContent>
      <TimePickerColumns />
    </DialogContent>
  </Popover>
</TimePicker>
```

## Time Picker controlled

```tsx
import React from "react"
import { Time } from "@internationalized/date"

import { ClockIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { DialogContent } from "@/components/ui/dialog"
import { Label } from "@/components/ui/field"
import { DateInput, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { Popover } from "@/components/ui/popover"
import { TimePicker, TimePickerColumns } from "@/components/ui/time-picker"
```

```tsx
const [value, setValue] = React.useState<Time | null>(new Time(9, 30))

<TimePicker value={value} onChange={setValue}>
  <Label>Event time</Label>
  <InputGroup>
    <DateInput />
    <InputGroupAddon>
      <Button variant="secondary" size="sm" isIconOnly aria-label="Choose time">
        <ClockIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Popover>
    <DialogContent>
      <TimePickerColumns />
    </DialogContent>
  </Popover>
</TimePicker>
```

## Time Picker granularity & hour cycle

`granularity` drives both the segments and which columns render; `hourCycle` toggles the AM/PM column.

```tsx
import { Time } from "@internationalized/date"

import { ClockIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { DialogContent } from "@/components/ui/dialog"
import { Label } from "@/components/ui/field"
import { DateInput, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { Popover } from "@/components/ui/popover"
import { TimePicker, TimePickerColumns } from "@/components/ui/time-picker"
```

```tsx
<TimePicker granularity="second" hourCycle={24} defaultValue={new Time(14, 30, 15)}>
  <Label>24-hour with seconds</Label>
  <InputGroup>
    <DateInput />
    <InputGroupAddon>
      <Button variant="secondary" size="sm" isIconOnly aria-label="Choose time">
        <ClockIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Popover>
    <DialogContent>
      <TimePickerColumns />
    </DialogContent>
  </Popover>
</TimePicker>
```

## Time Picker open state

Control the popover with `isOpen` / `onOpenChange`, or seed it with `defaultOpen`.

```tsx
import React from "react"

import { ClockIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { DialogContent } from "@/components/ui/dialog"
import { Label } from "@/components/ui/field"
import { DateInput, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { Popover } from "@/components/ui/popover"
import { TimePicker, TimePickerColumns } from "@/components/ui/time-picker"
```

```tsx
const [isOpen, setIsOpen] = React.useState(false)

<TimePicker isOpen={isOpen} onOpenChange={setIsOpen}>
  <Label>Event time</Label>
  <InputGroup>
    <DateInput />
    <InputGroupAddon>
      <Button variant="secondary" size="sm" isIconOnly aria-label="Choose time">
        <ClockIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Popover>
    <DialogContent>
      <TimePickerColumns />
    </DialogContent>
  </Popover>
</TimePicker>
```

## Time Picker states

```tsx
import { Time } from "@internationalized/date"

import { ClockIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { DialogContent } from "@/components/ui/dialog"
import { Label } from "@/components/ui/field"
import { DateInput, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { Popover } from "@/components/ui/popover"
import { TimePicker, TimePickerColumns } from "@/components/ui/time-picker"
```

```tsx
<TimePicker className="w-40" defaultValue={new Time(9, 30)} isReadOnly>
  <Label>Event time</Label>
  <InputGroup>
    <DateInput />
    <InputGroupAddon>
      <Button variant="secondary" size="sm" isIconOnly aria-label="Choose time">
        <ClockIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Popover>
    <DialogContent>
      <TimePickerColumns />
    </DialogContent>
  </Popover>
</TimePicker>

<TimePicker className="w-40" defaultValue={new Time(9, 30)} isDisabled>
  {/* same children */}
</TimePicker>
```

# Colors

## Color area

Two-dimensional picker; renders a ColorThumb by default when given no children.

```tsx
import { ColorArea } from "@/components/ui/color-area"
```

```tsx
<ColorArea aria-label="Color" defaultValue="hsl(30, 100%, 50%)" />
```

## Color area channels

Pick which color channels map to the x and y axes.

```tsx
import { ColorArea } from "@/components/ui/color-area"
```

```tsx
<ColorArea aria-label="Color" xChannel="red" yChannel="blue" />
<ColorArea
  aria-label="Color"
  colorSpace="hsb"
  xChannel="saturation"
  yChannel="brightness"
/>
```

## Color area controlled

```tsx
import React from "react"
import { parseColor } from "react-aria-components"

import { ColorArea } from "@/components/ui/color-area"
```

```tsx
const [value, setValue] = React.useState(parseColor("hsl(0, 100%, 50%)"))

<ColorArea
  aria-label="Color"
  value={value}
  onChange={setValue}
  xChannel="saturation"
  yChannel="lightness"
/>
<p>Selected color: {value.toString("hex")}</p>
```

## Color area disabled

```tsx
import { ColorArea } from "@/components/ui/color-area"
```

```tsx
<ColorArea aria-label="Color" isDisabled />
```

## Color area with custom thumb

Pass an explicit ColorThumb child to customize it.

```tsx
import { ColorArea } from "@/components/ui/color-area"
import { ColorThumb } from "@/components/ui/color-thumb"
```

```tsx
<ColorArea aria-label="Color" defaultValue="#ff0000">
  <ColorThumb />
</ColorArea>
```

## Color area with label

Labelled pair of areas driving a live preview (theme customizer).

```tsx
import React from "react"
import { parseColor } from "react-aria-components"

import { ColorArea } from "@/components/ui/color-area"
import { Label } from "@/components/ui/field"
```

```tsx
const [primary, setPrimary] = React.useState(parseColor("hsl(217, 91%, 60%)"))

<div className="flex flex-col gap-2">
  <Label>Primary</Label>
  <ColorArea
    aria-label="Primary color"
    value={primary}
    onChange={setPrimary}
    xChannel="saturation"
    yChannel="lightness"
  />
  <span className="text-xs text-fg-muted uppercase">
    {primary.toString("hex")}
  </span>
</div>
```

## Color thumb

Draggable handle used inside ColorArea and ColorSliderControl.

```tsx
import { ColorArea } from "@/components/ui/color-area"
import { ColorSlider, ColorSliderControl } from "@/components/ui/color-slider"
import { ColorThumb } from "@/components/ui/color-thumb"
```

```tsx
<ColorArea aria-label="Color">
  <ColorThumb />
</ColorArea>

<ColorSlider aria-label="Hue" channel="hue">
  <ColorSliderControl>
    <ColorThumb />
  </ColorSliderControl>
</ColorSlider>
```

## Color editor

Standalone area + hue slider + format select + fields; owns its own state when used outside a ColorPicker.

```tsx
import { ColorEditor } from "@/components/ui/color-editor"
```

```tsx
<ColorEditor defaultValue="#5100FF" />
```

## Color editor with alpha channel

```tsx
import { ColorEditor } from "@/components/ui/color-editor"
```

```tsx
<ColorEditor defaultValue="#5100FF80" showAlphaChannel />
```

## Color editor without format selector

```tsx
import { ColorEditor } from "@/components/ui/color-editor"
```

```tsx
<ColorEditor defaultValue="#5100FF" defaultFormat="rgb" showFormatSelector={false} />
```

## Color editor controlled

```tsx
import React from "react"
import { parseColor } from "react-aria-components"

import { ColorEditor } from "@/components/ui/color-editor"
```

```tsx
const [value, setValue] = React.useState(parseColor("#6366F1"))

<ColorEditor value={value} onChange={setValue} />
```

## Color editor composition

Compose the editor parts and insert a swatch picker between them.

```tsx
import {
  ColorEditor,
  ColorEditorArea,
  ColorEditorFields,
} from "@/components/ui/color-editor"
import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from "@/components/ui/color-swatch-picker"
```

```tsx
<ColorEditor defaultValue="#f80">
  <ColorEditorArea showAlphaChannel />
  <ColorSwatchPicker aria-label="Color swatches" className="justify-between">
    <ColorSwatchPickerItem color="#A00" />
    <ColorSwatchPickerItem color="#f80" />
    <ColorSwatchPickerItem color="#080" />
    <ColorSwatchPickerItem color="#08f" />
    <ColorSwatchPickerItem color="#008" />
  </ColorSwatchPicker>
  <ColorEditorFields defaultFormat="rgb" showFormatSelector={false} />
</ColorEditor>
```

## Color editor in color picker

Inside a ColorPicker the editor adopts the picker's state; the button gets a ColorSwatch child automatically.

```tsx
import { Button } from "@/components/ui/button"
import { ColorEditor } from "@/components/ui/color-editor"
import { ColorPicker } from "@/components/ui/color-picker"
import { DialogContent } from "@/components/ui/dialog"
import { Popover } from "@/components/ui/popover"
```

```tsx
<ColorPicker defaultValue="#5100FF">
  <Button aria-label="Pick a color" isIconOnly />
  <Popover>
    <DialogContent>
      <ColorEditor />
    </DialogContent>
  </Popover>
</ColorPicker>
```

## Color field

```tsx
import { ColorField } from "@/components/ui/color-field"
import { Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
```

```tsx
<ColorField defaultValue="#7f007f" className="max-w-xs">
  <Label>Color</Label>
  <Input />
</ColorField>
```

## Color field with description

```tsx
import { ColorField } from "@/components/ui/color-field"
import { Description, Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
```

```tsx
<ColorField className="max-w-xs">
  <Label>Color</Label>
  <Input />
  <Description>Enter a background color.</Description>
</ColorField>
```

## Color field validation

```tsx
import { ColorField } from "@/components/ui/color-field"
import { FieldError, Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
```

```tsx
<ColorField className="max-w-xs" isRequired isInvalid>
  <Label>Color</Label>
  <Input />
  <FieldError>Please fill out this field.</FieldError>
</ColorField>
```

## Color field controlled

```tsx
import React from "react"
import { type Color, parseColor } from "react-aria-components"

import { ColorField } from "@/components/ui/color-field"
import { Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
```

```tsx
const [color, setColor] = React.useState<Color | null>(parseColor("#7f007f"))

<ColorField value={color} onChange={setColor}>
  <Label>Color</Label>
  <Input />
</ColorField>
<p>Current color value: {color?.toString("hex")}</p>
```

## Color field channels

Several fields editing individual channels of one shared color.

```tsx
import React from "react"
import { type Color, parseColor } from "react-aria-components"

import { ColorField } from "@/components/ui/color-field"
import { Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
```

```tsx
const [color, setColor] = React.useState<Color | null>(parseColor("#7f007f"))

<div className="grid grid-cols-3 gap-2">
  <ColorField colorSpace="hsl" channel="hue" value={color} onChange={setColor}>
    <Label>Hue</Label>
    <Input />
  </ColorField>
  <ColorField colorSpace="hsl" channel="saturation" value={color} onChange={setColor}>
    <Label>Saturation</Label>
    <Input />
  </ColorField>
  <ColorField colorSpace="hsl" channel="lightness" value={color} onChange={setColor}>
    <Label>Lightness</Label>
    <Input />
  </ColorField>
</div>
```

## Color field with addons

```tsx
import { PaletteIcon } from "lucide-react"

import { ColorField } from "@/components/ui/color-field"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
```

```tsx
<ColorField aria-label="Color field with prefix">
  <InputGroup>
    <InputGroupAddon>
      <PaletteIcon />
    </InputGroupAddon>
    <Input />
  </InputGroup>
</ColorField>
<ColorField aria-label="Color field with suffix">
  <InputGroup>
    <Input />
    <InputGroupAddon>
      <PaletteIcon />
    </InputGroupAddon>
  </InputGroup>
</ColorField>
```

## Color field disabled & read-only

```tsx
import { parseColor } from "react-aria-components"

import { ColorField } from "@/components/ui/color-field"
import { Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
```

```tsx
<ColorField aria-label="Disabled color" value={parseColor("rgb(222,70,58)")} isDisabled>
  <Input />
</ColorField>
<ColorField aria-label="Color" value="#121212" isReadOnly>
  <Label>Read only</Label>
  <Input />
</ColorField>
```

## Color field sizes

Size lives on the Input, not the field.

```tsx
import { ColorField } from "@/components/ui/color-field"
import { Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
```

```tsx
<ColorField>
  <Label>small</Label>
  <Input size="sm" />
</ColorField>
<ColorField>
  <Label>medium</Label>
  <Input size="md" />
</ColorField>
<ColorField>
  <Label>large</Label>
  <Input size="lg" />
</ColorField>
```

## Color picker

Trigger button + popover; ColorPicker wraps its children in a Dialog and injects a ColorSwatch into the default-slot Button.

```tsx
import { Button } from "@/components/ui/button"
import { ColorArea } from "@/components/ui/color-area"
import { ColorPicker } from "@/components/ui/color-picker"
import { ColorSlider } from "@/components/ui/color-slider"
import { ColorSwatch } from "@/components/ui/color-swatch"
import { DialogContent } from "@/components/ui/dialog"
import { Popover } from "@/components/ui/popover"
```

```tsx
<ColorPicker defaultValue="#5100FF">
  <Button aria-label="Pick a color" isIconOnly>
    <ColorSwatch />
  </Button>
  <Popover>
    <DialogContent>
      <ColorArea
        aria-label="Color"
        colorSpace="hsb"
        xChannel="saturation"
        yChannel="brightness"
        className="w-full"
      />
      <ColorSlider colorSpace="hsb" channel="hue" />
    </DialogContent>
  </Popover>
</ColorPicker>
```

## Color picker with labelled trigger

```tsx
import { Button } from "@/components/ui/button"
import { ColorEditor } from "@/components/ui/color-editor"
import { ColorPicker } from "@/components/ui/color-picker"
import { ColorSwatch } from "@/components/ui/color-swatch"
import { Popover } from "@/components/ui/popover"
```

```tsx
<ColorPicker defaultValue="#5100FF">
  <Button>
    <ColorSwatch />
    Accent
  </Button>
  <Popover className="p-2.5">
    <ColorEditor />
  </Popover>
</ColorPicker>
```

## Color picker with swatches

```tsx
import { Button } from "@/components/ui/button"
import { ColorArea } from "@/components/ui/color-area"
import { ColorPicker } from "@/components/ui/color-picker"
import { ColorSlider } from "@/components/ui/color-slider"
import { ColorSwatch } from "@/components/ui/color-swatch"
import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from "@/components/ui/color-swatch-picker"
import { DialogContent } from "@/components/ui/dialog"
import { Popover } from "@/components/ui/popover"
```

```tsx
<ColorPicker defaultValue="#5100FF">
  <Button aria-label="Pick a color" isIconOnly>
    <ColorSwatch />
  </Button>
  <Popover>
    <DialogContent>
      <ColorArea
        aria-label="Color"
        colorSpace="hsb"
        xChannel="saturation"
        yChannel="brightness"
        className="w-full"
      />
      <ColorSlider colorSpace="hsb" channel="hue" />
      <ColorSwatchPicker aria-label="Color swatches" className="mt-2 justify-between">
        <ColorSwatchPickerItem color="#A00" />
        <ColorSwatchPickerItem color="#f80" />
        <ColorSwatchPickerItem color="#080" />
        <ColorSwatchPickerItem color="#08f" />
        <ColorSwatchPickerItem color="#008" />
        <ColorSwatchPickerItem color="#fff" />
      </ColorSwatchPicker>
    </DialogContent>
  </Popover>
</ColorPicker>
```

## Color picker with channel sliders

A Select switches the color space; one slider per channel plus alpha.

```tsx
import React from "react"
import { type ColorSpace, getColorChannels } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { ColorPicker } from "@/components/ui/color-picker"
import { ColorSlider, ColorSliderControl } from "@/components/ui/color-slider"
import { ColorSwatch } from "@/components/ui/color-swatch"
import { DialogContent } from "@/components/ui/dialog"
import { Label } from "@/components/ui/field"
import { Popover } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
```

```tsx
const [space, setSpace] = React.useState<ColorSpace>("rgb")

<ColorPicker defaultValue="#5100FF">
  <Button aria-label="Pick a color" isIconOnly>
    <ColorSwatch />
  </Button>
  <Popover>
    <DialogContent>
      <Select
        aria-label="Color format"
        defaultValue={space}
        onChange={(key) => setSpace(key as ColorSpace)}
      >
        <SelectTrigger size="sm" />
        <SelectContent>
          <SelectItem id="rgb">RGB</SelectItem>
          <SelectItem id="hsl">HSL</SelectItem>
          <SelectItem id="hsb">HSB</SelectItem>
        </SelectContent>
      </Select>
      {getColorChannels(space).map((channel) => (
        <ColorSlider key={channel} colorSpace={space} channel={channel}>
          <Label>{channel}</Label>
          <ColorSliderControl />
        </ColorSlider>
      ))}
      <ColorSlider channel="alpha">
        <Label>Alpha</Label>
        <ColorSliderControl />
      </ColorSlider>
    </DialogContent>
  </Popover>
</ColorPicker>
```

## Color picker controlled

```tsx
import React from "react"
import { type Color, parseColor } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { ColorEditor } from "@/components/ui/color-editor"
import { ColorPicker } from "@/components/ui/color-picker"
import { DialogContent } from "@/components/ui/dialog"
import { Popover } from "@/components/ui/popover"
```

```tsx
const [value, setValue] = React.useState<Color>(parseColor("hsl(26, 33%, 78%)"))

<ColorPicker value={value} onChange={setValue}>
  <Button aria-label="Pick a color" isIconOnly />
  <Popover>
    <DialogContent>
      <ColorEditor />
    </DialogContent>
  </Popover>
</ColorPicker>
```

## Color picker open state

ColorPicker forwards isOpen / defaultOpen / onOpenChange to its inner Dialog.

```tsx
import React from "react"

import { Button } from "@/components/ui/button"
import { ColorEditor } from "@/components/ui/color-editor"
import { ColorPicker } from "@/components/ui/color-picker"
import { DialogContent } from "@/components/ui/dialog"
import { Popover } from "@/components/ui/popover"
```

```tsx
const [isOpen, setIsOpen] = React.useState(false)

<ColorPicker defaultValue="#ff0000" isOpen={isOpen} onOpenChange={setIsOpen}>
  <Button aria-label="Pick a color" isIconOnly />
  <Popover>
    <DialogContent>
      <ColorEditor />
    </DialogContent>
  </Popover>
</ColorPicker>
```

## Color slider

Renders a ColorSliderControl by default when given no children.

```tsx
import { ColorSlider, ColorSliderControl } from "@/components/ui/color-slider"
```

```tsx
<ColorSlider aria-label="Hue" channel="hue" defaultValue="hsl(200, 100%, 50%)">
  <ColorSliderControl />
</ColorSlider>
```

## Color slider with label

```tsx
import { ColorSlider, ColorSliderControl } from "@/components/ui/color-slider"
import { Label } from "@/components/ui/field"
```

```tsx
<ColorSlider channel="hue" defaultValue="hsl(200, 100%, 50%)">
  <Label>Hue</Label>
  <ColorSliderControl />
</ColorSlider>
```

## Color slider with output

```tsx
import {
  ColorSlider,
  ColorSliderControl,
  ColorSliderOutput,
} from "@/components/ui/color-slider"
import { Label } from "@/components/ui/field"
```

```tsx
<ColorSlider defaultValue="#f00" channel="alpha">
  <div className="flex items-center justify-between">
    <Label>Opacity</Label>
    <ColorSliderOutput />
  </div>
  <ColorSliderControl />
</ColorSlider>
```

## Color slider controlled

```tsx
import React from "react"
import { parseColor } from "react-aria-components"

import { ColorSlider, ColorSliderControl } from "@/components/ui/color-slider"
```

```tsx
const [value, setValue] = React.useState(parseColor("hsl(0, 100%, 50%)"))

<ColorSlider aria-label="Hue" channel="hue" value={value} onChange={setValue}>
  <ColorSliderControl />
</ColorSlider>
<p>Value: {value.toString("hex")}</p>
```

## Color slider vertical

```tsx
import { ColorSlider, ColorSliderControl } from "@/components/ui/color-slider"
```

```tsx
<ColorSlider orientation="vertical" channel="hue" defaultValue="hsl(0, 100%, 50%)">
  <ColorSliderControl />
</ColorSlider>
```

## Color slider disabled

```tsx
import { ColorSlider, ColorSliderControl } from "@/components/ui/color-slider"
```

```tsx
<ColorSlider aria-label="Opacity" channel="alpha" defaultValue="#f00" isDisabled>
  <ColorSliderControl />
</ColorSlider>
```

## Color swatch

```tsx
import { ColorSwatch } from "@/components/ui/color-swatch"
```

```tsx
<ColorSwatch color="#f00" />
```

## Color swatch palette

```tsx
import { ColorSwatch } from "@/components/ui/color-swatch"
```

```tsx
const palette = [
  { name: "Sky", color: "#0ea5e9" },
  { name: "Emerald", color: "#10b981" },
  { name: "Amber", color: "#f59e0b" },
]

<div className="grid grid-cols-3 gap-3">
  {palette.map((swatch) => (
    <div key={swatch.name} className="flex flex-col items-center gap-1.5">
      <ColorSwatch color={swatch.color} className="size-10" />
      <span className="text-xs text-fg-muted">{swatch.name}</span>
    </div>
  ))}
</div>
```

## Color swatch in button

```tsx
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ColorSwatch } from "@/components/ui/color-swatch"
```

```tsx
<Button variant="secondary" className="w-full max-w-xs justify-between">
  <span className="flex items-center gap-2">
    <ColorSwatch color="#8b5cf6" className="size-4" />
    Violet
  </span>
  <ChevronDown className="text-fg-muted" />
</Button>
```

## Color swatch picker

```tsx
import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from "@/components/ui/color-swatch-picker"
```

```tsx
<ColorSwatchPicker aria-label="Color swatches" defaultValue="#fff">
  <ColorSwatchPickerItem color="#fff" />
  <ColorSwatchPickerItem color="#A00" />
  <ColorSwatchPickerItem color="#f80" />
  <ColorSwatchPickerItem color="#080" />
  <ColorSwatchPickerItem color="#08f" />
  <ColorSwatchPickerItem color="#088" />
  <ColorSwatchPickerItem color="#008" />
</ColorSwatchPicker>
```

## Color swatch picker controlled

```tsx
import React from "react"
import { type Color, parseColor } from "react-aria-components"

import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from "@/components/ui/color-swatch-picker"
```

```tsx
const [value, setValue] = React.useState<Color>(parseColor("#f80"))

<ColorSwatchPicker aria-label="Color swatches" value={value} onChange={setValue}>
  <ColorSwatchPickerItem color="#A00" />
  <ColorSwatchPickerItem color="#f80" />
  <ColorSwatchPickerItem color="#080" />
  <ColorSwatchPickerItem color="#08f" />
</ColorSwatchPicker>
```

## Color swatch picker disabled items

```tsx
import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from "@/components/ui/color-swatch-picker"
```

```tsx
<ColorSwatchPicker aria-label="Color swatches">
  <ColorSwatchPickerItem color="#fff" isDisabled />
  <ColorSwatchPickerItem color="#A00" />
  <ColorSwatchPickerItem color="#f80" isDisabled />
  <ColorSwatchPickerItem color="#080" />
</ColorSwatchPicker>
```

## Color swatch picker with label & description

Label via aria-labelledby; items mapped from a list and laid out as a grid.

```tsx
import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from "@/components/ui/color-swatch-picker"
import { Description, Label } from "@/components/ui/field"
```

```tsx
const accents = ["#18181b", "#dc2626", "#ea580c", "#16a34a", "#2563eb", "#7c3aed"]

<div className="flex max-w-xs flex-col gap-3">
  <div className="flex flex-col gap-1">
    <Label id="accent-label">Accent</Label>
    <Description>Pick a preset color scheme.</Description>
  </div>
  <ColorSwatchPicker
    aria-labelledby="accent-label"
    defaultValue="#2563eb"
    className="grid grid-cols-5"
  >
    {accents.map((color) => (
      <ColorSwatchPickerItem key={color} color={color} />
    ))}
  </ColorSwatchPicker>
</div>
```

# Data & Navigation

## Table

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
```

```tsx
<TableContainer>
  <Table aria-label="Files">
    <TableHeader>
      <TableColumn isRowHeader>Name</TableColumn>
      <TableColumn>Type</TableColumn>
      <TableColumn>Date Modified</TableColumn>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>Games</TableCell>
        <TableCell>File folder</TableCell>
        <TableCell>6/7/2020</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Program Files</TableCell>
        <TableCell>File folder</TableCell>
        <TableCell>4/7/2021</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>
```

## Table dynamic collection

Render columns and rows from data with the `columns` / `items` props and render functions.

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
```

```tsx
const columns = [
  { name: "Name", id: "name", isRowHeader: true },
  { name: "Type", id: "type" },
  { name: "Date Modified", id: "date" },
]
const data = [
  { id: 1, name: "Games", date: "6/7/2020", type: "File folder" },
  { id: 2, name: "Program Files", date: "4/7/2021", type: "File folder" },
]

<TableContainer>
  <Table aria-label="Files">
    <TableHeader columns={columns}>
      {(column) => (
        <TableColumn isRowHeader={column.isRowHeader}>{column.name}</TableColumn>
      )}
    </TableHeader>
    <TableBody items={data}>
      {(item) => (
        <TableRow columns={columns}>
          {(column) => <TableCell>{item[column.id]}</TableCell>}
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>
```

## Table with footer

```tsx
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
```

```tsx
<TableContainer>
  <Table aria-label="Invoices">
    <TableHeader>
      <TableColumn isRowHeader>Invoice</TableColumn>
      <TableColumn>Status</TableColumn>
      <TableColumn>Method</TableColumn>
      <TableColumn className="text-right">Amount</TableColumn>
    </TableHeader>
    <TableBody>
      {invoices.map((invoice) => (
        <TableRow key={invoice.id}>
          <TableCell className="font-medium">{invoice.id}</TableCell>
          <TableCell>
            <Badge appearance="subtle" variant={statusVariant[invoice.status]}>
              {invoice.status}
            </Badge>
          </TableCell>
          <TableCell>{invoice.method}</TableCell>
          <TableCell className="text-right tabular-nums">{invoice.amount}</TableCell>
        </TableRow>
      ))}
    </TableBody>
    <TableFooter>
      <TableRow>
        <TableCell colSpan={3}>Total</TableCell>
        <TableCell className="text-right tabular-nums">{total}</TableCell>
      </TableRow>
    </TableFooter>
  </Table>
</TableContainer>
```

## Table multiple selection

`selectionMode="multiple"` adds a checkbox column automatically.

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
```

```tsx
<TableContainer>
  <Table aria-label="Files" selectionMode="multiple">
    <TableHeader columns={columns}>
      {(column) => (
        <TableColumn isRowHeader={column.isRowHeader}>{column.name}</TableColumn>
      )}
    </TableHeader>
    <TableBody items={data}>
      {(item) => (
        <TableRow columns={columns}>
          {(column) => <TableCell>{item[column.id]}</TableCell>}
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>
```

## Table single selection

Uncontrolled single selection with a default and no way to clear it.

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
```

```tsx
<TableContainer>
  <Table
    aria-label="Files"
    selectionMode="single"
    defaultSelectedKeys={[2]}
    disallowEmptySelection
  >
    <TableHeader columns={columns}>
      {(column) => (
        <TableColumn isRowHeader={column.isRowHeader}>{column.name}</TableColumn>
      )}
    </TableHeader>
    <TableBody items={data}>
      {(item) => (
        <TableRow columns={columns}>
          {(column) => <TableCell>{item[column.id]}</TableCell>}
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>
```

## Table controlled selection

```tsx
import React from "react"
import type { Selection } from "react-aria-components"

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
```

```tsx
const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([2, 3]))

<TableContainer>
  <Table
    aria-label="Files"
    selectionMode="multiple"
    selectedKeys={selectedKeys}
    onSelectionChange={setSelectedKeys}
  >
    <TableHeader columns={columns}>
      {(column) => (
        <TableColumn isRowHeader={column.isRowHeader}>{column.name}</TableColumn>
      )}
    </TableHeader>
    <TableBody items={data}>
      {(item) => (
        <TableRow columns={columns}>
          {(column) => <TableCell>{item[column.id]}</TableCell>}
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>
```

## Table disabled rows

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
```

```tsx
<TableContainer>
  <Table aria-label="Files" disabledKeys={[3, 4]}>
    <TableHeader columns={columns}>
      {(column) => (
        <TableColumn isRowHeader={column.isRowHeader}>{column.name}</TableColumn>
      )}
    </TableHeader>
    <TableBody items={data}>
      {(item) => (
        <TableRow columns={columns}>
          {(column) => <TableCell>{item[column.id]}</TableCell>}
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>
```

## Table sorting

```tsx
import React from "react"
import type { SortDescriptor } from "react-aria-components/Table"

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
```

```tsx
const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
  column: "name",
  direction: "ascending",
})
const sortedItems = React.useMemo(
  () =>
    items.sort((a, b) => {
      const cmp = a[sortDescriptor.column].localeCompare(b[sortDescriptor.column])
      return sortDescriptor.direction === "descending" ? -cmp : cmp
    }),
  [sortDescriptor],
)

<TableContainer>
  <Table
    aria-label="Files"
    sortDescriptor={sortDescriptor}
    onSortChange={setSortDescriptor}
  >
    <TableHeader>
      <TableColumn id="name" isRowHeader allowsSorting>
        Name
      </TableColumn>
      <TableColumn id="type" allowsSorting>
        Type
      </TableColumn>
      <TableColumn id="date">Date Modified</TableColumn>
    </TableHeader>
    <TableBody items={sortedItems}>
      {(item) => (
        <TableRow columns={columns}>
          {(column) => <TableCell>{item[column.id]}</TableCell>}
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>
```

## Table column resizing

`resizable` on the container switches to React Aria's resizable layout; `allowsResizing` opts columns in.

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
```

```tsx
<TableContainer resizable>
  <Table aria-label="Files">
    <TableHeader>
      <TableColumn id="name" isRowHeader allowsResizing defaultWidth={240}>
        Name
      </TableColumn>
      <TableColumn id="type" allowsResizing>
        Type
      </TableColumn>
      <TableColumn id="date">Date Modified</TableColumn>
    </TableHeader>
    <TableBody items={items}>
      {(item) => (
        <TableRow columns={columns}>
          {(column) => <TableCell>{item[column.id]}</TableCell>}
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>
```

## Table row links

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
```

```tsx
<TableContainer>
  <Table aria-label="Bookmarks">
    <TableHeader>
      <TableColumn isRowHeader>Name</TableColumn>
      <TableColumn>URL</TableColumn>
      <TableColumn>Date added</TableColumn>
    </TableHeader>
    <TableBody>
      <TableRow href="https://adobe.com/" target="_blank">
        <TableCell>Adobe</TableCell>
        <TableCell>https://adobe.com/</TableCell>
        <TableCell>January 28, 2023</TableCell>
      </TableRow>
      <TableRow href="https://google.com/" target="_blank">
        <TableCell>Google</TableCell>
        <TableCell>https://google.com/</TableCell>
        <TableCell>April 5, 2023</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>
```

## Table row actions

Use `onRowAction` on the table for dynamic rows, or `onAction` per static row.

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
```

```tsx
<TableContainer>
  <Table aria-label="Files" onRowAction={(key) => openItem(key)}>
    <TableHeader columns={columns}>
      {(column) => (
        <TableColumn isRowHeader={column.isRowHeader}>{column.name}</TableColumn>
      )}
    </TableHeader>
    <TableBody items={data}>
      {(item) => (
        <TableRow columns={columns}>
          {(column) => <TableCell>{item[column.id]}</TableCell>}
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>

<TableRow onAction={() => openItem("games")}>
  <TableCell>Games</TableCell>
  <TableCell>File folder</TableCell>
  <TableCell>6/7/2020</TableCell>
</TableRow>
```

## Table reorderable (drag and drop)

```tsx
import { useDragAndDrop } from "react-aria-components/useDragAndDrop"
import { useListData } from "react-stately"

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableDropIndicator,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
```

```tsx
const list = useListData({ initialItems: files })
const { dragAndDropHooks } = useDragAndDrop({
  getItems: (keys) =>
    [...keys].map((key) => ({ "text/plain": list.getItem(key)?.name ?? "" })),
  renderDropIndicator: (target) => <TableDropIndicator target={target} />,
  onReorder(e) {
    if (e.target.dropPosition === "before") list.moveBefore(e.target.key, e.keys)
    else if (e.target.dropPosition === "after") list.moveAfter(e.target.key, e.keys)
  },
})

<TableContainer>
  <Table aria-label="Files" dragAndDropHooks={dragAndDropHooks}>
    <TableHeader columns={columns}>
      {(column) => (
        <TableColumn isRowHeader={column.isRowHeader}>{column.name}</TableColumn>
      )}
    </TableHeader>
    <TableBody items={list.items}>
      {(item) => (
        <TableRow columns={columns}>
          {(column) => <TableCell>{item[column.id]}</TableCell>}
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>
```

## Table expandable rows

Nest `TableRow`s and name the tree column with `treeColumn` to get expand chevrons.

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
```

```tsx
<TableContainer>
  <Table
    aria-label="Project files"
    treeColumn="name"
    defaultExpandedKeys={["documents", "project"]}
  >
    <TableHeader>
      <TableColumn id="name" isRowHeader>
        Name
      </TableColumn>
      <TableColumn id="type">Type</TableColumn>
      <TableColumn id="date">Date Modified</TableColumn>
    </TableHeader>
    <TableBody>
      <TableRow id="documents">
        <TableCell>Documents</TableCell>
        <TableCell>Folder</TableCell>
        <TableCell>10/20/2025</TableCell>
        <TableRow id="project">
          <TableCell>Project</TableCell>
          <TableCell>Folder</TableCell>
          <TableCell>8/2/2025</TableCell>
          <TableRow id="weekly-report">
            <TableCell>Weekly Report</TableCell>
            <TableCell>PDF Document</TableCell>
            <TableCell>7/10/2025</TableCell>
          </TableRow>
        </TableRow>
      </TableRow>
      <TableRow id="proposal">
        <TableCell>2026 Proposal</TableCell>
        <TableCell>PDF Document</TableCell>
        <TableCell>4/14/2026</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>
```

## Table async loading (load more)

```tsx
import { Collection } from "react-aria-components/Collection"
import { useAsyncList } from "react-stately"

import { Loader } from "@/components/ui/loader"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableLoadMore,
  TableRow,
} from "@/components/ui/table"
```

```tsx
const list = useAsyncList<Character>({
  async load({ cursor, signal }) {
    const res = await fetch(cursor || "https://swapi.py4e.com/api/people/", { signal })
    const json = await res.json()
    return { items: json.results, cursor: json.next ?? undefined }
  },
})

<TableContainer className="max-h-80">
  <Table aria-label="Star Wars characters">
    <TableHeader>
      <TableColumn id="name" isRowHeader>
        Name
      </TableColumn>
      <TableColumn id="height">Height</TableColumn>
      <TableColumn id="mass">Mass</TableColumn>
    </TableHeader>
    <TableBody
      renderEmptyState={() => (
        <div className="flex h-24 items-center justify-center">
          <Loader aria-label="Loading characters..." />
        </div>
      )}
    >
      <Collection items={list.items}>
        {(item) => (
          <TableRow id={item.name}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.height}</TableCell>
            <TableCell>{item.mass}</TableCell>
          </TableRow>
        )}
      </Collection>
      <TableLoadMore
        onLoadMore={list.loadMore}
        isLoading={list.loadingState === "loadingMore"}
      />
    </TableBody>
  </Table>
</TableContainer>
```

## Table virtualized

Wrap the table in `TableVirtualizer` for large lists; give the container a fixed height and rows `height: inherit`.

```tsx
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
  TableVirtualizer,
} from "@/components/ui/table"
```

```tsx
<TableContainer className="h-80" resizable>
  <TableVirtualizer>
    <Table aria-label="Deployments" selectionMode="multiple">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn id={column.id} isRowHeader={column.isRowHeader}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={deployments}>
        {(item) => (
          <TableRow columns={columns} style={{ height: "inherit", width: "inherit" }}>
            {(column) => (
              <TableCell>
                {column.id === "status" ? (
                  <Badge appearance="subtle" variant={statusVariant[item.status]}>
                    {item.status}
                  </Badge>
                ) : (
                  item[column.id]
                )}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableVirtualizer>
</TableContainer>
```

## Table empty state

```tsx
import {
  Table,
  TableBody,
  TableColumn,
  TableContainer,
  TableHeader,
} from "@/components/ui/table"
```

```tsx
<TableContainer>
  <Table aria-label="Files">
    <TableHeader>
      <TableColumn id="name" isRowHeader>
        Name
      </TableColumn>
      <TableColumn id="type">Type</TableColumn>
      <TableColumn id="date">Date Modified</TableColumn>
    </TableHeader>
    <TableBody renderEmptyState={() => "No results."}>{[]}</TableBody>
  </Table>
</TableContainer>
```

## Table with inline controls (select, popover editor, menu)

Cells can host interactive controls; `shouldSelectOnPressUp` keeps row selection from swallowing presses.

```tsx
import { MoreHorizontalIcon, PencilIcon } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Menu, MenuContent, MenuItem } from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
```

```tsx
<TableContainer>
  <Table aria-label="Editable tasks" selectionMode="multiple" shouldSelectOnPressUp>
    <TableHeader>
      <TableColumn isRowHeader>Task</TableColumn>
      <TableColumn>Status</TableColumn>
      <TableColumn>Assignee</TableColumn>
      <TableColumn>Estimate</TableColumn>
      <TableColumn className="w-10">
        <span className="sr-only">Actions</span>
      </TableColumn>
    </TableHeader>
    <TableBody>
      {tasks.map((task) => (
        <TableRow key={task.id} textValue={task.task}>
          <TableCell className="font-medium">{task.task}</TableCell>
          <TableCell>
            <Badge appearance="subtle" variant={statusVariant[task.status]}>
              {task.status}
            </Badge>
          </TableCell>
          <TableCell>
            <Select aria-label={`Assignee for ${task.task}`} defaultSelectedKey={task.assignee}>
              <SelectTrigger size="sm" className="w-36" />
              <SelectContent placement="bottom">
                {assignees.map((a) => (
                  <SelectItem id={a.id} key={a.id}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TableCell>
          <TableCell>
            <div className="flex items-center justify-between gap-2">
              <span>{task.estimate}h</span>
              <Dialog>
                <Button aria-label="Edit estimate" variant="quiet" size="sm" isIconOnly>
                  <PencilIcon />
                </Button>
                <Popover placement="bottom end" className="w-48 p-2">
                  <Input aria-label="Estimate" type="number" size="sm" autoFocus defaultValue={String(task.estimate)} />
                </Popover>
              </Dialog>
            </div>
          </TableCell>
          <TableCell className="text-right">
            <Menu>
              <Button aria-label="Open actions" variant="quiet" size="sm" isIconOnly>
                <MoreHorizontalIcon />
              </Button>
              <Popover placement="bottom end">
                <MenuContent>
                  <MenuItem>Edit task</MenuItem>
                  <MenuItem>Duplicate</MenuItem>
                  <MenuItem variant="danger">Delete</MenuItem>
                </MenuContent>
              </Popover>
            </Menu>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
```

## Tree

```tsx
import { Tree, TreeItem, TreeItemContent } from "@/components/ui/tree"
```

```tsx
<Tree
  aria-label="Files"
  selectionMode="single"
  selectionBehavior="replace"
  defaultExpandedKeys={["documents"]}
  className="w-72"
>
  <TreeItem id="documents" textValue="Documents">
    <TreeItemContent>Documents</TreeItemContent>
    <TreeItem id="project" textValue="Project">
      <TreeItemContent>Project</TreeItemContent>
      <TreeItem id="report" textValue="Weekly report">
        <TreeItemContent>Weekly report</TreeItemContent>
      </TreeItem>
    </TreeItem>
    <TreeItem id="resume" textValue="Resume.pdf">
      <TreeItemContent>Resume.pdf</TreeItemContent>
    </TreeItem>
  </TreeItem>
  <TreeItem id="photos" textValue="Photos">
    <TreeItemContent>Photos</TreeItemContent>
    <TreeItem id="mountains" textValue="Mountains.jpg">
      <TreeItemContent>Mountains.jpg</TreeItemContent>
    </TreeItem>
  </TreeItem>
</Tree>
```

## Tree dynamic items

Pass `items` to the tree and a `Collection` for each item's children, recursing with the same render function.

```tsx
import { Collection } from "react-aria-components/Collection"

import { Tree, TreeItem, TreeItemContent } from "@/components/ui/tree"
```

```tsx
const items = [
  {
    id: "documents",
    name: "Documents",
    children: [
      { id: "project", name: "Project", children: [{ id: "report", name: "Weekly report" }] },
      { id: "resume", name: "Resume.pdf" },
    ],
  },
  { id: "photos", name: "Photos", children: [{ id: "beach", name: "Beach.jpg" }] },
]

<Tree aria-label="Files" items={items} defaultExpandedKeys={["documents"]} className="w-72">
  {function renderItem(item) {
    return (
      <TreeItem textValue={item.name}>
        <TreeItemContent>{item.name}</TreeItemContent>
        {item.children && (
          <Collection items={item.children}>{renderItem}</Collection>
        )}
      </TreeItem>
    )
  }}
</Tree>
```

## Tree with icons

`TreeItemContent` accepts a render function exposing `isExpanded`.

```tsx
import { FileTextIcon, FolderIcon, FolderOpenIcon, ImageIcon } from "@/components/icons"
import { Tree, TreeItem, TreeItemContent } from "@/components/ui/tree"
```

```tsx
<Tree
  aria-label="Files"
  selectionMode="single"
  selectionBehavior="replace"
  defaultExpandedKeys={["documents", "photos"]}
  className="w-72"
>
  <TreeItem id="documents" textValue="Documents">
    <TreeItemContent>
      {({ isExpanded }) => (
        <>
          {isExpanded ? <FolderOpenIcon /> : <FolderIcon />}
          Documents
        </>
      )}
    </TreeItemContent>
    <TreeItem id="report" textValue="Weekly report">
      <TreeItemContent>
        <FileTextIcon />
        Weekly report
      </TreeItemContent>
    </TreeItem>
  </TreeItem>
  <TreeItem id="photos" textValue="Photos">
    <TreeItemContent>
      {({ isExpanded }) => (
        <>
          {isExpanded ? <FolderOpenIcon /> : <FolderIcon />}
          Photos
        </>
      )}
    </TreeItemContent>
    <TreeItem id="mountains" textValue="Mountains.jpg">
      <TreeItemContent>
        <ImageIcon />
        Mountains.jpg
      </TreeItemContent>
    </TreeItem>
  </TreeItem>
</Tree>
```

## Tree controlled multiple selection

Multiple selection renders a checkbox per row.

```tsx
import { useState } from "react"
import type { Selection } from "react-aria-components"

import { Tree, TreeItem, TreeItemContent } from "@/components/ui/tree"
```

```tsx
const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(["report", "mountains"]))

<Tree
  aria-label="Files"
  selectionMode="multiple"
  selectedKeys={selectedKeys}
  onSelectionChange={setSelectedKeys}
  defaultExpandedKeys={["documents", "photos"]}
  className="w-72"
>
  <TreeItem id="documents" textValue="Documents">
    <TreeItemContent>Documents</TreeItemContent>
    <TreeItem id="report" textValue="Weekly report">
      <TreeItemContent>Weekly report</TreeItemContent>
    </TreeItem>
  </TreeItem>
  <TreeItem id="photos" textValue="Photos">
    <TreeItemContent>Photos</TreeItemContent>
    <TreeItem id="mountains" textValue="Mountains.jpg">
      <TreeItemContent>Mountains.jpg</TreeItemContent>
    </TreeItem>
  </TreeItem>
</Tree>
```

## Tree disabled items

```tsx
import { Tree, TreeItem, TreeItemContent } from "@/components/ui/tree"
```

```tsx
<Tree
  aria-label="Files"
  selectionMode="multiple"
  disabledKeys={["photos", "resume"]}
  defaultExpandedKeys={["documents"]}
  className="w-72"
>
  <TreeItem id="documents" textValue="Documents">
    <TreeItemContent>Documents</TreeItemContent>
    <TreeItem id="report" textValue="Weekly report">
      <TreeItemContent>Weekly report</TreeItemContent>
    </TreeItem>
    <TreeItem id="resume" textValue="Resume.pdf">
      <TreeItemContent>Resume.pdf</TreeItemContent>
    </TreeItem>
  </TreeItem>
  <TreeItem id="photos" textValue="Photos">
    <TreeItemContent>Photos</TreeItemContent>
  </TreeItem>
</Tree>
```

## Tree drag and drop

```tsx
import { Collection } from "react-aria-components/Collection"
import { DropIndicator, useDragAndDrop } from "react-aria-components/useDragAndDrop"
import { useTreeData } from "react-stately"

import { Tree, TreeItem, TreeItemContent } from "@/components/ui/tree"
```

```tsx
const tree = useTreeData({
  initialItems,
  getKey: (item) => item.id,
  getChildren: (item) => item.children ?? [],
})
const { dragAndDropHooks } = useDragAndDrop({
  getItems: (keys) =>
    [...keys].map((key) => ({ "text/plain": tree.getItem(key)?.value.name ?? "" })),
  renderDropIndicator: (target) => (
    <DropIndicator
      target={target}
      className="z-10 h-0.5 rounded-full bg-transparent outline-hidden data-drop-target:bg-accent"
    />
  ),
  onMove(e) {
    const keys = [...e.keys]
    if (e.target.dropPosition === "before") tree.moveBefore(e.target.key, keys)
    else if (e.target.dropPosition === "after") tree.moveAfter(e.target.key, keys)
    else if (e.target.dropPosition === "on")
      keys.forEach((key, index) => tree.move(key, e.target.key, index))
  },
})

<Tree
  aria-label="Files"
  items={tree.items}
  dragAndDropHooks={dragAndDropHooks}
  defaultExpandedKeys={["documents", "photos"]}
  className="w-72"
>
  {function renderItem(item) {
    return (
      <TreeItem textValue={item.value.name}>
        <TreeItemContent>{item.value.name}</TreeItemContent>
        <Collection items={item.children ?? []}>{renderItem}</Collection>
      </TreeItem>
    )
  }}
</Tree>
```

## Tree empty state

```tsx
import { Tree } from "@/components/ui/tree"
```

```tsx
<Tree
  aria-label="Files"
  className="h-40 w-72"
  renderEmptyState={() => (
    <span className="text-sm text-fg-muted">No files found.</span>
  )}
>
  {[]}
</Tree>
```

## Tree item links

```tsx
import { Tree, TreeItem, TreeItemContent } from "@/components/ui/tree"
```

```tsx
<Tree aria-label="Files" defaultExpandedKeys={["documents"]}>
  <TreeItem id="documents" textValue="Documents">
    <TreeItemContent>Documents</TreeItemContent>
    <TreeItem href="/documents/report" textValue="Weekly report">
      <TreeItemContent>Weekly report</TreeItemContent>
    </TreeItem>
  </TreeItem>
</Tree>
```

## Pagination with links

```tsx
import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
```

```tsx
<Pagination>
  <PaginationList>
    <PaginationItem>
      <PaginationPrevious href="/posts?page=1" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="/posts?page=1">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="/posts?page=2" isActive>
        2
      </PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="/posts?page=3">3</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="/posts?page=3" />
    </PaginationItem>
  </PaginationList>
</Pagination>
```

## Pagination controlled

Pagination holds no state; wire `onPress`, `isActive`, and `isDisabled` yourself.

```tsx
import * as React from "react"

import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
```

```tsx
const [page, setPage] = React.useState(1)
const TOTAL_PAGES = 10

<Pagination>
  <PaginationList>
    <PaginationItem>
      <PaginationPrevious
        isDisabled={page === 1}
        onPress={() => setPage((p) => Math.max(1, p - 1))}
      />
    </PaginationItem>
    {getPageRange(page, TOTAL_PAGES).map((p, i) =>
      p === "ellipsis" ? (
        <PaginationItem key={`ellipsis-${i}`}>
          <PaginationEllipsis />
        </PaginationItem>
      ) : (
        <PaginationItem key={p}>
          <PaginationLink isActive={p === page} aria-label={`Page ${p}`} onPress={() => setPage(p)}>
            {p}
          </PaginationLink>
        </PaginationItem>
      ),
    )}
    <PaginationItem>
      <PaginationNext
        isDisabled={page === TOTAL_PAGES}
        onPress={() => setPage((p) => Math.min(TOTAL_PAGES, p + 1))}
      />
    </PaginationItem>
  </PaginationList>
</Pagination>
```

## Pagination compact

Icon-only previous/next around a "Page x of y" label.

```tsx
import * as React from "react"

import {
  Pagination,
  PaginationItem,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
```

```tsx
const [page, setPage] = React.useState(1)

<Pagination>
  <PaginationList>
    <PaginationItem>
      <PaginationPrevious
        isIconOnly
        isDisabled={page === 1}
        onPress={() => setPage((p) => Math.max(1, p - 1))}
      />
    </PaginationItem>
    <PaginationItem>
      <span className="px-2 text-sm text-fg-muted tabular-nums">
        Page {page} of {TOTAL_PAGES}
      </span>
    </PaginationItem>
    <PaginationItem>
      <PaginationNext
        isIconOnly
        isDisabled={page === TOTAL_PAGES}
        onPress={() => setPage((p) => Math.min(TOTAL_PAGES, p + 1))}
      />
    </PaginationItem>
  </PaginationList>
</Pagination>
```

## Pagination sizes

```tsx
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
```

```tsx
<Pagination>
  <PaginationList>
    <PaginationItem>
      <PaginationPrevious href="#" size="sm" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" size="sm">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" size="sm" isActive>2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" size="sm" />
    </PaginationItem>
  </PaginationList>
</Pagination>
```

## Table with pagination

```tsx
import * as React from "react"

import {
  Pagination,
  PaginationItem,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
```

```tsx
const [page, setPage] = React.useState(1)
const rows = invoices.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

<div className="flex w-full flex-col gap-3">
  <TableContainer>
    <Table aria-label="Invoices">
      <TableHeader>
        <TableColumn isRowHeader>Invoice</TableColumn>
        <TableColumn>Customer</TableColumn>
        <TableColumn>Amount</TableColumn>
      </TableHeader>
      <TableBody items={rows}>
        {(invoice) => (
          <TableRow id={invoice.id}>
            <TableCell>{invoice.id}</TableCell>
            <TableCell>{invoice.customer}</TableCell>
            <TableCell className="tabular-nums">{invoice.amount}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
  <div className="flex items-center justify-between">
    <p className="text-sm text-fg-muted tabular-nums">Page {page} of {TOTAL_PAGES}</p>
    <Pagination>
      <PaginationList>
        <PaginationItem>
          <PaginationPrevious isIconOnly isDisabled={page === 1} onPress={() => setPage((p) => p - 1)} />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext isIconOnly isDisabled={page === TOTAL_PAGES} onPress={() => setPage((p) => p + 1)} />
        </PaginationItem>
      </PaginationList>
    </Pagination>
  </div>
</div>
```

## Accordion

An accordion is a group of `Disclosure`s; expanded state is keyed by each disclosure's `id`.

```tsx
import { Accordion } from "@/components/ui/accordion"
import { Disclosure, DisclosurePanel, DisclosureTrigger } from "@/components/ui/disclosure"
```

```tsx
<Accordion className="max-w-lg" defaultExpandedKeys={["getting-started"]}>
  <Disclosure id="getting-started">
    <DisclosureTrigger>How do I get started with DotUI?</DisclosureTrigger>
    <DisclosurePanel>
      Install the package, then import the components you need.
    </DisclosurePanel>
  </Disclosure>
  <Disclosure id="free-to-use">
    <DisclosureTrigger>Is DotUI free to use?</DisclosureTrigger>
    <DisclosurePanel>Yes, DotUI is completely free and open source.</DisclosurePanel>
  </Disclosure>
  <Disclosure id="customization">
    <DisclosureTrigger>Can I customize the components?</DisclosureTrigger>
    <DisclosurePanel>All components use Tailwind Variants for styling.</DisclosurePanel>
  </Disclosure>
</Accordion>
```

## Accordion allows multiple expanded

```tsx
import { Accordion } from "@/components/ui/accordion"
import { Disclosure, DisclosurePanel, DisclosureTrigger } from "@/components/ui/disclosure"
```

```tsx
<Accordion allowsMultipleExpanded className="max-w-xs" defaultExpandedKeys={["getting-started"]}>
  <Disclosure id="getting-started">
    <DisclosureTrigger>How do I get started with DotUI?</DisclosureTrigger>
    <DisclosurePanel>Install the package, then import the components you need.</DisclosurePanel>
  </Disclosure>
  <Disclosure id="free-to-use">
    <DisclosureTrigger>Is DotUI free to use?</DisclosureTrigger>
    <DisclosurePanel>Yes, DotUI is completely free and open source.</DisclosurePanel>
  </Disclosure>
</Accordion>
```

## Accordion controlled

```tsx
import { useState } from "react"

import { Accordion } from "@/components/ui/accordion"
import { Disclosure, DisclosurePanel, DisclosureTrigger } from "@/components/ui/disclosure"
```

```tsx
const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set(["getting-started"]))

<Accordion
  expandedKeys={expandedKeys}
  onExpandedChange={(keys) => setExpandedKeys(keys as Set<string>)}
>
  <Disclosure id="getting-started">
    <DisclosureTrigger>How do I get started with DotUI?</DisclosureTrigger>
    <DisclosurePanel>Install the package, then import the components you need.</DisclosurePanel>
  </Disclosure>
  <Disclosure id="free-to-use">
    <DisclosureTrigger>Is DotUI free to use?</DisclosureTrigger>
    <DisclosurePanel>Yes, DotUI is completely free and open source.</DisclosurePanel>
  </Disclosure>
</Accordion>
```

## Accordion disabled

```tsx
import { Accordion } from "@/components/ui/accordion"
import { Disclosure, DisclosurePanel, DisclosureTrigger } from "@/components/ui/disclosure"
```

```tsx
<Accordion className="max-w-xs" defaultExpandedKeys={["getting-started"]} isDisabled>
  <Disclosure id="getting-started">
    <DisclosureTrigger>How do I get started with DotUI?</DisclosureTrigger>
    <DisclosurePanel>Install the package, then import the components you need.</DisclosurePanel>
  </Disclosure>
  <Disclosure id="free-to-use">
    <DisclosureTrigger>Is DotUI free to use?</DisclosureTrigger>
    <DisclosurePanel>Yes, DotUI is completely free and open source.</DisclosurePanel>
  </Disclosure>
</Accordion>
```

## Accordion settings panel (with switches)

```tsx
import { Accordion } from "@/components/ui/accordion"
import { Disclosure, DisclosurePanel, DisclosureTrigger } from "@/components/ui/disclosure"
import { Description, FieldContent, Label } from "@/components/ui/field"
import { Switch, SwitchControl, SwitchIndicator } from "@/components/ui/switch"
```

```tsx
<Accordion className="w-full max-w-xs" defaultExpandedKeys={["Notifications"]}>
  <Disclosure id="Notifications">
    <DisclosureTrigger>Notifications</DisclosureTrigger>
    <DisclosurePanel>
      <div className="flex flex-col gap-4">
        <Switch className="w-full" defaultSelected>
          <SwitchControl>
            <FieldContent>
              <Label>Email digests</Label>
              <Description>A weekly summary of your activity.</Description>
            </FieldContent>
            <SwitchIndicator />
          </SwitchControl>
        </Switch>
        <Switch className="w-full">
          <SwitchControl>
            <FieldContent>
              <Label>Push notifications</Label>
              <Description>Alerts on your devices in real time.</Description>
            </FieldContent>
            <SwitchIndicator />
          </SwitchControl>
        </Switch>
      </div>
    </DisclosurePanel>
  </Disclosure>
  <Disclosure id="Privacy">
    <DisclosureTrigger>Privacy</DisclosureTrigger>
    <DisclosurePanel>{/* ... */}</DisclosurePanel>
  </Disclosure>
</Accordion>
```

## Disclosure

```tsx
import { Disclosure, DisclosurePanel, DisclosureTrigger } from "@/components/ui/disclosure"
```

```tsx
<Disclosure>
  <DisclosureTrigger>System requirements</DisclosureTrigger>
  <DisclosurePanel>
    Details about system requirements go here. Describes the minimum and
    recommended hardware and software needed.
  </DisclosurePanel>
</Disclosure>
```

## Disclosure default expanded

```tsx
import { Disclosure, DisclosurePanel, DisclosureTrigger } from "@/components/ui/disclosure"
```

```tsx
<Disclosure defaultExpanded>
  <DisclosureTrigger>System requirements</DisclosureTrigger>
  <DisclosurePanel>Details about system requirements go here.</DisclosurePanel>
</Disclosure>
```

## Disclosure disabled

```tsx
import { Disclosure, DisclosurePanel, DisclosureTrigger } from "@/components/ui/disclosure"
```

```tsx
<Disclosure isDisabled>
  <DisclosureTrigger>System requirements</DisclosureTrigger>
  <DisclosurePanel>Details about system requirements go here.</DisclosurePanel>
</Disclosure>
```

## Disclosure controlled

```tsx
import React from "react"

import { Button } from "@/components/ui/button"
import { Disclosure, DisclosurePanel, DisclosureTrigger } from "@/components/ui/disclosure"
```

```tsx
const [isExpanded, setExpanded] = React.useState(false)

<Disclosure isExpanded={isExpanded} onExpandedChange={setExpanded}>
  <DisclosureTrigger>System requirements</DisclosureTrigger>
  <DisclosurePanel>Details about system requirements go here.</DisclosurePanel>
</Disclosure>
<Button size="sm" onPress={() => setExpanded(!isExpanded)}>
  {isExpanded ? "Collapse" : "Expand"}
</Button>
```

## Disclosure custom trigger

Compose the header from `Heading` and a `slot="trigger"` `Button` instead of `DisclosureTrigger`.

```tsx
import { ChevronDownIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Disclosure, DisclosurePanel } from "@/components/ui/disclosure"
import { Heading } from "@/components/ui/heading"
```

```tsx
<Disclosure>
  <Heading>
    <Button variant="quiet" slot="trigger">
      System requirements
      <ChevronDownIcon />
    </Button>
  </Heading>
  <DisclosurePanel className="px-3 pt-2">
    Details about system requirements go here.
  </DisclosurePanel>
</Disclosure>
```

## Disclosure FAQ list

Independent disclosures stacked with a divider (no accordion grouping).

```tsx
import { Disclosure, DisclosurePanel, DisclosureTrigger } from "@/components/ui/disclosure"
```

```tsx
<div className="w-full max-w-sm">
  <h3 className="mb-2 text-sm font-medium text-fg-muted">Frequently asked questions</h3>
  <div className="divide-y divide-border">
    {faqs.map((faq) => (
      <Disclosure key={faq.question}>
        <DisclosureTrigger>{faq.question}</DisclosureTrigger>
        <DisclosurePanel>{faq.answer}</DisclosurePanel>
      </Disclosure>
    ))}
  </div>
</div>
```

## Breadcrumbs

The separator lives inside each item; omit it on the last one, and omit `href` on the current page.

```tsx
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@/components/ui/breadcrumbs"
```

```tsx
<Breadcrumbs>
  <BreadcrumbItem>
    <BreadcrumbLink href="/">Home</BreadcrumbLink>
    <BreadcrumbSeparator />
  </BreadcrumbItem>
  <BreadcrumbItem>
    <BreadcrumbLink href="/components">Components</BreadcrumbLink>
    <BreadcrumbSeparator />
  </BreadcrumbItem>
  <BreadcrumbItem>
    <BreadcrumbLink>Breadcrumbs</BreadcrumbLink>
  </BreadcrumbItem>
</Breadcrumbs>
```

## Breadcrumbs custom separator

```tsx
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@/components/ui/breadcrumbs"
```

```tsx
<Breadcrumbs>
  <BreadcrumbItem>
    <BreadcrumbLink href="/">Home</BreadcrumbLink>
    <BreadcrumbSeparator>/</BreadcrumbSeparator>
  </BreadcrumbItem>
  <BreadcrumbItem>
    <BreadcrumbLink href="/components">Components</BreadcrumbLink>
    <BreadcrumbSeparator>/</BreadcrumbSeparator>
  </BreadcrumbItem>
  <BreadcrumbItem>
    <BreadcrumbLink>Breadcrumbs</BreadcrumbLink>
  </BreadcrumbItem>
</Breadcrumbs>
```

## Breadcrumbs with icons

```tsx
import { FileTextIcon, FolderIcon, FolderOpenIcon, HomeIcon } from "@/components/icons"
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@/components/ui/breadcrumbs"
```

```tsx
<Breadcrumbs>
  <BreadcrumbItem>
    <BreadcrumbLink href="/drive">
      <HomeIcon />
      My Drive
    </BreadcrumbLink>
    <BreadcrumbSeparator />
  </BreadcrumbItem>
  <BreadcrumbItem>
    <BreadcrumbLink href="/drive/projects">
      <FolderIcon />
      Projects
    </BreadcrumbLink>
    <BreadcrumbSeparator />
  </BreadcrumbItem>
  <BreadcrumbItem>
    <BreadcrumbLink href="/drive/projects/q3">
      <FolderOpenIcon />
      Q3 Report
    </BreadcrumbLink>
    <BreadcrumbSeparator />
  </BreadcrumbItem>
  <BreadcrumbItem>
    <BreadcrumbLink>
      <FileTextIcon />
      Summary.pdf
    </BreadcrumbLink>
  </BreadcrumbItem>
</Breadcrumbs>
```

## Breadcrumbs with menu (collapsed items)

```tsx
import { MoreHorizontalIcon } from "@/components/icons"
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@/components/ui/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Menu, MenuContent, MenuItem } from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
```

```tsx
<Breadcrumbs>
  <BreadcrumbItem>
    <BreadcrumbLink href="/">Home</BreadcrumbLink>
    <BreadcrumbSeparator />
  </BreadcrumbItem>
  <BreadcrumbItem>
    <Menu>
      <Button variant="quiet" size="xs" isIconOnly aria-label="More pages">
        <MoreHorizontalIcon />
      </Button>
      <Popover placement="bottom">
        <MenuContent>
          <MenuItem href="/docs">Documentation</MenuItem>
          <MenuItem href="/docs/components">Components</MenuItem>
        </MenuContent>
      </Popover>
    </Menu>
    <BreadcrumbSeparator />
  </BreadcrumbItem>
  <BreadcrumbItem>
    <BreadcrumbLink>Breadcrumbs</BreadcrumbLink>
  </BreadcrumbItem>
</Breadcrumbs>
```

## Breadcrumbs disabled

```tsx
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@/components/ui/breadcrumbs"
```

```tsx
<Breadcrumbs isDisabled>
  <BreadcrumbItem>
    <BreadcrumbLink href="/">Home</BreadcrumbLink>
    <BreadcrumbSeparator />
  </BreadcrumbItem>
  <BreadcrumbItem>
    <BreadcrumbLink>Breadcrumbs</BreadcrumbLink>
  </BreadcrumbItem>
</Breadcrumbs>
```

## Sidebar

Full app shell: provider, sidebar (header / content / footer), and the inset holding the page with a trigger.

```tsx
import { ChevronsUpDownIcon, HomeIcon, InboxIcon, SettingsIcon, SparklesIcon } from "@/components/icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
```

```tsx
<SidebarProvider className="h-svh">
  <Sidebar>
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" tooltip="Acme Inc">
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-fg-on-primary">
              <SparklesIcon className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-medium text-fg">Acme Inc</span>
              <span className="text-xs">Enterprise</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive tooltip="Dashboard">
              <HomeIcon />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Inbox">
              <InboxIcon />
              <span>Inbox</span>
            </SidebarMenuButton>
            <SidebarMenuBadge>12</SidebarMenuBadge>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <SettingsIcon />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" tooltip="Mehdi">
            <Avatar className="size-8">
              <AvatarImage src="https://github.com/mehdibha.png" alt="Mehdi" />
              <AvatarFallback>M</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-medium text-fg">Mehdi</span>
              <span className="text-xs">m@example.com</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
  <SidebarInset className="overflow-auto">
    <header className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
      <SidebarTrigger />
      <span className="text-sm font-medium">Dashboard</span>
    </header>
    <div className="flex-1 p-3">{/* page */}</div>
  </SidebarInset>
</SidebarProvider>
```

## Sidebar links

Pass `href` to render the menu button as a link; `isActive` sets `aria-current="page"`.

```tsx
import { HomeIcon } from "@/components/icons"
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
```

```tsx
<SidebarMenuItem>
  <SidebarMenuButton href="/dashboard" isActive>
    <HomeIcon />
    <span>Dashboard</span>
  </SidebarMenuButton>
</SidebarMenuItem>
```

## Sidebar groups with group action

```tsx
import { CalendarIcon, FolderIcon, HomeIcon, PlusIcon } from "@/components/icons"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
```

```tsx
<SidebarProvider>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive>
                <HomeIcon />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <CalendarIcon />
                <span>Calendar</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
        <SidebarGroupAction aria-label="Add project">
          <PlusIcon />
        </SidebarGroupAction>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <FolderIcon />
                <span>Design system</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
  <SidebarInset>
    <header className="flex h-12 items-center gap-2 border-b px-3">
      <SidebarTrigger />
    </header>
  </SidebarInset>
</SidebarProvider>
```

## Sidebar submenu (nested items)

```tsx
import { FrameIcon, HomeIcon } from "@/components/icons"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
```

```tsx
<SidebarProvider>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive>
              <HomeIcon />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <FrameIcon />
              <span>Design Engineering</span>
            </SidebarMenuButton>
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton isActive>
                  <span>Components</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton href="/tokens">
                  <span>Tokens</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
  <SidebarInset>
    <header className="flex h-12 items-center gap-2 border-b px-3">
      <SidebarTrigger />
    </header>
  </SidebarInset>
</SidebarProvider>
```

## Sidebar collapsible to icons

With `collapsible="icon"`, collapsed buttons show their `tooltip` on hover.

```tsx
import { HomeIcon, InboxIcon, SettingsIcon } from "@/components/icons"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
```

```tsx
<SidebarProvider defaultOpen={false}>
  <Sidebar collapsible="icon">
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton isActive={item.isActive} tooltip={item.title}>
                <item.icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
  <SidebarInset>
    <header className="flex h-12 items-center gap-2 border-b px-3">
      <SidebarTrigger />
    </header>
  </SidebarInset>
</SidebarProvider>
```

## Sidebar controlled

```tsx
import * as React from "react"

import { HomeIcon, InboxIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
```

```tsx
const [isOpen, setOpen] = React.useState(true)

<SidebarProvider isOpen={isOpen} onOpenChange={setOpen}>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive>
              <HomeIcon />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <InboxIcon />
              <span>Inbox</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
  <SidebarInset>
    <header className="flex h-12 items-center gap-2 border-b px-3">
      <Button size="sm" onPress={() => setOpen((open) => !open)}>
        {isOpen ? "Close" : "Open"} sidebar
      </Button>
    </header>
  </SidebarInset>
</SidebarProvider>
```

## Sidebar useSidebar hook

Read or drive the sidebar from any descendant of `SidebarProvider`.

```tsx
import { useSidebar } from "@/components/ui/sidebar"
```

```tsx
const { state, isOpen, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar } =
  useSidebar()

<button onClick={toggleSidebar}>{state === "collapsed" ? "Expand" : "Collapse"}</button>
```

## Sidebar variants (floating, inset)

```tsx
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
```

```tsx
<SidebarProvider className="bg-muted">
  <Sidebar variant="floating">
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarMenu>{/* items */}</SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
  <SidebarInset className="bg-transparent">
    <header className="flex h-12 items-center gap-2 px-3">
      <SidebarTrigger />
    </header>
  </SidebarInset>
</SidebarProvider>

<SidebarProvider>
  <Sidebar variant="inset">{/* ... */}</Sidebar>
  <SidebarInset>{/* ... */}</SidebarInset>
</SidebarProvider>
```

## Sidebar on the right

Render the sidebar after the inset so it reserves space on the right.

```tsx
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
```

```tsx
<SidebarProvider>
  <SidebarInset>
    <header className="flex h-12 items-center justify-end gap-2 border-b px-3">
      <span className="text-sm font-medium">Aligned right</span>
      <SidebarTrigger />
    </header>
  </SidebarInset>
  <Sidebar side="right">
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarMenu>{/* items */}</SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</SidebarProvider>
```

## Sidebar rail

`SidebarRail` adds a draggable edge that toggles the sidebar.

```tsx
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarInset,
  SidebarMenu,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
```

```tsx
<SidebarProvider>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>{/* items */}</SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
    <SidebarRail />
  </Sidebar>
  <SidebarInset>
    <header className="flex h-12 items-center gap-2 border-b px-3">
      <SidebarTrigger />
    </header>
  </SidebarInset>
</SidebarProvider>
```

## Sidebar footer user menu

A `SidebarMenuButton` as the trigger of a `Menu`, with the popover matching the trigger width.

```tsx
import { ChevronsUpDownIcon, CreditCardIcon, LogOutIcon, SettingsIcon } from "@/components/icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, MenuContent, MenuItem } from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
```

```tsx
<SidebarProvider>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup />
    </SidebarContent>
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <Menu>
            <SidebarMenuButton size="lg">
              <Avatar className="size-8">
                <AvatarImage src="https://github.com/mehdibha.png" alt="Mehdi" />
                <AvatarFallback>M</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium text-fg">Mehdi</span>
                <span className="text-xs">m@example.com</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto" />
            </SidebarMenuButton>
            <Popover placement="top" className="w-(--trigger-width)">
              <MenuContent>
                <MenuItem>
                  <SettingsIcon />
                  Account
                </MenuItem>
                <MenuItem>
                  <CreditCardIcon />
                  Billing
                </MenuItem>
                <MenuItem>
                  <LogOutIcon />
                  Log out
                </MenuItem>
              </MenuContent>
            </Popover>
          </Menu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</SidebarProvider>
```

## Sidebar badges and hover actions

```tsx
import { CalendarIcon, HomeIcon, InboxIcon, MoreHorizontalIcon } from "@/components/icons"
import { Menu, MenuContent, MenuItem } from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
```

```tsx
<SidebarProvider>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive>
              <HomeIcon />
              <span>Dashboard</span>
            </SidebarMenuButton>
            <SidebarMenuBadge>3</SidebarMenuBadge>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <InboxIcon />
              <span>Inbox</span>
            </SidebarMenuButton>
            <SidebarMenuBadge>24</SidebarMenuBadge>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <CalendarIcon />
              <span>Calendar</span>
            </SidebarMenuButton>
            <Menu>
              <SidebarMenuAction showOnHover aria-label="More">
                <MoreHorizontalIcon />
              </SidebarMenuAction>
              <Popover>
                <MenuContent>
                  <MenuItem>Edit</MenuItem>
                  <MenuItem>Share</MenuItem>
                  <MenuItem>Delete</MenuItem>
                </MenuContent>
              </Popover>
            </Menu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</SidebarProvider>
```

## Sidebar loading skeleton

```tsx
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarProvider,
} from "@/components/ui/sidebar"
```

```tsx
<SidebarProvider>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarMenu>
          {Array.from({ length: 6 }).map((_, index) => (
            <SidebarMenuItem key={`skeleton-${index}`}>
              <SidebarMenuSkeleton showIcon />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</SidebarProvider>
```

## Sidebar with search

```tsx
import { SearchField } from "@/components/ui/search-field"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarProvider,
} from "@/components/ui/sidebar"
```

```tsx
<SidebarProvider>
  <Sidebar>
    <SidebarHeader>
      <SearchField aria-label="Search" placeholder="Search..." />
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>{/* items */}</SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</SidebarProvider>
```

# Feedback & Display

## Alert

```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
```

```tsx
<Alert>
  <AlertTitle>Payment information</AlertTitle>
  <AlertDescription>
    You are currently on the free plan. Upgrade to unlock more features.
  </AlertDescription>
</Alert>
```

## Alert with icon

The icon is the alert's first child — styles pick it up positionally, there is no icon prop.

```tsx
import { InfoIcon } from "@/components/icons"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
```

```tsx
<Alert variant="info">
  <InfoIcon />
  <AlertTitle>Information</AlertTitle>
  <AlertDescription>
    This alert uses a custom icon to convey additional context.
  </AlertDescription>
</Alert>
```

## Alert variants

`variant` is one of `neutral` (default), `info`, `success`, `warning`, `danger`.

```tsx
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
} from "@/components/icons"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
```

```tsx
<Alert variant="success">
  <CheckCircle2Icon />
  <AlertTitle>Success</AlertTitle>
  <AlertDescription>Your changes have been saved successfully.</AlertDescription>
</Alert>
<Alert variant="warning">
  <AlertTriangleIcon />
  <AlertTitle>Warning</AlertTitle>
  <AlertDescription>Your session will expire in 5 minutes.</AlertDescription>
</Alert>
<Alert variant="danger">
  <AlertCircleIcon />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Failed to save changes. Please try again.</AlertDescription>
</Alert>
```

## Alert with action

```tsx
import { AlertCircleIcon } from "lucide-react"

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
```

```tsx
<Alert>
  <AlertCircleIcon />
  <AlertTitle>Upgrade Required</AlertTitle>
  <AlertDescription>
    You are currently on the free plan. Upgrade to unlock more features.
  </AlertDescription>
  <AlertAction>
    <Button variant="primary" size="sm">
      Upgrade
    </Button>
  </AlertAction>
</Alert>
```

## Alert dismissible

```tsx
import { useState } from "react"
import { CheckCircle2Icon, XIcon } from "lucide-react"

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
```

```tsx
const [isVisible, setIsVisible] = useState(true)

if (!isVisible) return null

return (
  <Alert variant="success">
    <CheckCircle2Icon />
    <AlertTitle>Changes saved</AlertTitle>
    <AlertDescription>Your profile has been updated successfully.</AlertDescription>
    <AlertAction>
      <Button
        variant="quiet"
        size="sm"
        isIconOnly
        aria-label="Dismiss"
        onPress={() => setIsVisible(false)}
      >
        <XIcon />
      </Button>
    </AlertAction>
  </Alert>
)
```

## Alert as form error

```tsx
import { useState } from "react"
import { AlertCircleIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"
```

```tsx
const [email, setEmail] = useState("")
const [error, setError] = useState(true)

return (
  <form
    className="flex w-full max-w-xs flex-col gap-3"
    onSubmit={(e) => {
      e.preventDefault()
      setError(!email.includes("@"))
    }}
  >
    {error && (
      <Alert variant="danger">
        <AlertCircleIcon />
        <AlertTitle>Invalid email</AlertTitle>
        <AlertDescription>Enter a valid email address to continue.</AlertDescription>
      </Alert>
    )}
    <TextField value={email} onChange={setEmail} isInvalid={error}>
      <Label>Email</Label>
      <Input type="email" placeholder="you@example.com" />
    </TextField>
    <Button type="submit" variant="primary" size="sm">
      Sign in
    </Button>
  </form>
)
```

## Badge

```tsx
import { Badge } from "@/components/ui/badge"
```

```tsx
<Badge>Badge</Badge>
```

## Badge variants, appearance & sizes

`variant`: `neutral`, `success`, `danger`, `warning`, `info`, `accent`; `appearance`: `solid`…; `size`: `sm`, `md`, `lg`.

```tsx
import { Badge } from "@/components/ui/badge"
```

```tsx
<Badge variant="neutral">neutral</Badge>
<Badge variant="success">success</Badge>
<Badge variant="danger">danger</Badge>
<Badge variant="warning">warning</Badge>
<Badge variant="info">info</Badge>
<Badge variant="accent" appearance="solid">accent</Badge>

<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
```

## Badge with icon

```tsx
import { ArrowUpRightIcon, BadgeCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
```

```tsx
<Badge>
  <BadgeCheck />
  Verified
</Badge>
<Badge variant="accent">
  Open Link <ArrowUpRightIcon data-icon-inline-end="" />
</Badge>
```

## Badge with status dot

```tsx
import { Badge } from "@/components/ui/badge"
```

```tsx
<Badge>
  <span aria-hidden="true" className="size-1.5 rounded-full bg-amber-500" />
  Pending
</Badge>
```

## Badge with loader

```tsx
import { Badge } from "@/components/ui/badge"
import { Loader } from "@/components/ui/loader"
```

```tsx
<Badge>
  <Loader />
  Badge
</Badge>
```

## Badge count

```tsx
import { Badge } from "@/components/ui/badge"
```

```tsx
<Badge>8</Badge>
```

## Loader

Loader renders a React Aria indeterminate ProgressBar with no visible text — pass `aria-label`.

```tsx
import { Loader } from "@/components/ui/loader"
```

```tsx
<Loader aria-label="Loading" />
```

## Loader in button

```tsx
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Loader } from "@/components/ui/loader"
```

```tsx
const [isSaving, setIsSaving] = useState(false)

return (
  <Button
    isDisabled={isSaving}
    onPress={() => {
      setIsSaving(true)
      setTimeout(() => setIsSaving(false), 2000)
    }}
  >
    {isSaving ? (
      <>
        <Loader />
        Saving...
      </>
    ) : (
      "Save changes"
    )}
  </Button>
)
```

## Loader in input

```tsx
import { useState } from "react"
import { SearchIcon } from "lucide-react"

import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { Loader } from "@/components/ui/loader"
import { TextField } from "@/components/ui/text-field"
```

```tsx
const [value, setValue] = useState("")
const [isSearching, setIsSearching] = useState(false)

return (
  <TextField
    aria-label="Search"
    className="w-full max-w-xs"
    value={value}
    onChange={(next) => {
      setValue(next)
      setIsSearching(next.length > 0)
    }}
  >
    <InputGroup>
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <Input placeholder="Search..." />
      {isSearching && (
        <InputGroupAddon>
          <Loader aria-label="Searching" />
        </InputGroupAddon>
      )}
    </InputGroup>
  </TextField>
)
```

## Loader overlay

```tsx
import { Loader } from "@/components/ui/loader"
```

```tsx
<div className="flex w-full max-w-xs items-center justify-center rounded-md border border-dashed py-12">
  <div className="flex flex-col items-center gap-3 text-fg-muted">
    <Loader aria-label="Loading" className="size-6" />
    <p className="text-sm">Loading content...</p>
  </div>
</div>
```

## Progress bar

`ProgressBar` without children renders the track on its own; `ProgressBarControl` is the explicit track.

```tsx
import { ProgressBar, ProgressBarControl } from "@/components/ui/progress-bar"
```

```tsx
<ProgressBar aria-label="Loading" value={75} />

<ProgressBar aria-label="Loading" value={75}>
  <ProgressBarControl />
</ProgressBar>
```

## Progress bar with label

```tsx
import { Label } from "@/components/ui/field"
import { ProgressBar, ProgressBarControl } from "@/components/ui/progress-bar"
```

```tsx
<ProgressBar value={75}>
  <Label>Loading...</Label>
  <ProgressBarControl />
</ProgressBar>
```

## Progress bar with value output

```tsx
import { Label } from "@/components/ui/field"
import {
  ProgressBar,
  ProgressBarControl,
  ProgressBarOutput,
} from "@/components/ui/progress-bar"
```

```tsx
<ProgressBar value={56} className="w-full">
  <div className="flex items-center justify-between gap-2">
    <Label>Upload progress</Label>
    <ProgressBarOutput />
  </div>
  <ProgressBarControl />
</ProgressBar>
```

## Progress bar value formatting

`formatOptions` is an `Intl.NumberFormat` config; `valueLabel` replaces the output text entirely.

```tsx
import { Label } from "@/components/ui/field"
import {
  ProgressBar,
  ProgressBarControl,
  ProgressBarOutput,
} from "@/components/ui/progress-bar"
```

```tsx
<ProgressBar formatOptions={{ style: "currency", currency: "JPY" }} value={60}>
  <Label>Sending…</Label>
  <ProgressBarOutput />
  <ProgressBarControl />
</ProgressBar>

<ProgressBar value={30} valueLabel="30 of 100 dogs">
  <Label>Feeding…</Label>
  <ProgressBarOutput />
  <ProgressBarControl />
</ProgressBar>
```

## Progress bar min/max values

```tsx
import { ProgressBar, ProgressBarControl } from "@/components/ui/progress-bar"
```

```tsx
<ProgressBar aria-label="Min and max values" minValue={50} maxValue={150} value={100}>
  <ProgressBarControl />
</ProgressBar>
```

## Progress bar indeterminate

`--progress-duration` on the control tunes the indeterminate sweep; re-keying restarts it.

```tsx
import { ProgressBar, ProgressBarControl } from "@/components/ui/progress-bar"
```

```tsx
<ProgressBar isIndeterminate aria-label="Loading">
  <ProgressBarControl />
</ProgressBar>

<ProgressBar aria-label="Loading" isIndeterminate>
  <ProgressBarControl
    style={{ "--progress-duration": "30s" } as React.CSSProperties}
  />
</ProgressBar>
```

## Progress bar controlled / animated

```tsx
import { useEffect, useState } from "react"

import { ProgressBar } from "@/components/ui/progress-bar"
import { Slider, SliderControl } from "@/components/ui/slider"
```

```tsx
const [value, setValue] = useState(13)

useEffect(() => {
  const timer = setTimeout(() => setValue(66), 500)
  return () => clearTimeout(timer)
}, [])

return (
  <div className="flex w-full flex-col gap-4">
    <ProgressBar aria-label="Controlled progress" value={value} className="w-full" />
    <Slider
      aria-label="Progress"
      value={value}
      onChange={(value) => setValue(value as number)}
      minValue={0}
      maxValue={100}
      step={1}
    >
      <SliderControl />
    </Slider>
  </div>
)
```

## Progress bar custom fill & size

Style the fill by passing your own `ProgressBarFill` inside the control; size via a height class on the control.

```tsx
import { Label } from "@/components/ui/field"
import {
  ProgressBar,
  ProgressBarControl,
  ProgressBarFill,
} from "@/components/ui/progress-bar"
```

```tsx
<ProgressBar value={75}>
  <Label>success</Label>
  <ProgressBarControl>
    <ProgressBarFill className="bg-success" />
  </ProgressBarControl>
</ProgressBar>

<ProgressBar aria-label="Progress size: lg" value={75}>
  <ProgressBarControl className="h-2" />
</ProgressBar>
```

## Progress bar in file upload list

```tsx
import { FileIcon } from "lucide-react"

import { ProgressBar } from "@/components/ui/progress-bar"
```

```tsx
const files = [
  { id: "1", name: "document.pdf", progress: 45, timeRemaining: "2m 30s" },
  { id: "2", name: "image.jpg", progress: 100, timeRemaining: "Complete" },
]

return (
  <ul className="w-full max-w-md divide-y rounded-lg border bg-card">
    {files.map((file) => (
      <li
        key={file.id}
        className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-3 py-2"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-muted text-fg-muted">
          <FileIcon className="size-4" />
        </span>
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{file.name}</div>
          <ProgressBar
            aria-label={`${file.name} upload progress`}
            value={file.progress}
            className="mt-2 w-full"
          />
        </div>
        <span className="w-16 text-right text-sm text-fg-muted">{file.timeRemaining}</span>
      </li>
    ))}
  </ul>
)
```

## Skeleton

A childless `Skeleton` is a placeholder block; size and shape it with classes.

```tsx
import { Skeleton } from "@/components/ui/skeleton"
```

```tsx
<Skeleton isLoading>
  <div className="flex items-center gap-4">
    <Skeleton className="size-12 rounded-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
</Skeleton>
```

## Skeleton list items

```tsx
import { Skeleton } from "@/components/ui/skeleton"
```

```tsx
<Skeleton isLoading className="w-full max-w-xs space-y-4">
  {Array.from({ length: 4 }).map((_, index) => (
    <div key={index} className="flex items-center gap-3">
      <Skeleton className="size-9 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-3.5 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="size-4 shrink-0 rounded" />
    </div>
  ))}
</Skeleton>
```

## Skeleton wrapping real content

Wrap real components in `Skeleton isLoading`; text, buttons, inputs, avatars and badges are skeletonized automatically. Mark media with `data-skeleton="media"`.

```tsx
import { useState } from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Description, Field, Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
```

```tsx
const [isLoading, setLoading] = useState(true)

return (
  <Skeleton isLoading={isLoading}>
    <Card className="w-80">
      <img data-skeleton="media" src="/images/thumbnail.png" alt="Preview" className="h-28 w-full object-cover" />
      <CardHeader className="flex flex-row items-center gap-3">
        <Avatar size="lg">
          <AvatarFallback>DU</AvatarFallback>
        </Avatar>
        <div className="min-w-0 space-y-1">
          <CardTitle>Design system report</CardTitle>
          <CardDescription>Updated a few seconds ago</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Component usage is growing across product surfaces.</p>
        <Field>
          <Label>Workspace</Label>
          <Input defaultValue="Acme dashboard" />
          <Description>Visible to everyone on your team.</Description>
        </Field>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="quiet">Dismiss</Button>
        <Button>Open report</Button>
      </CardFooter>
    </Card>
  </Skeleton>
)
```

## Empty

```tsx
import { ArrowUpRightIcon } from "@/components/icons"
import { Button, LinkButton } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
```

```tsx
<Empty>
  <EmptyHeader>
    <EmptyTitle>No projects yet</EmptyTitle>
    <EmptyDescription>
      You haven't created any projects yet. Get started by creating your first project.
    </EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <div className="flex gap-2">
      <LinkButton variant="primary" href="#">
        Create project
      </LinkButton>
      <Button variant="secondary">Import project</Button>
    </div>
    <LinkButton variant="link" href="#" className="text-fg-muted">
      Learn more <ArrowUpRightIcon />
    </LinkButton>
  </EmptyContent>
</Empty>
```

## Empty with icon

`EmptyMedia variant="icon"` renders its child inside a bordered icon container.

```tsx
import { FolderIcon, PlusIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
```

```tsx
<Empty className="border">
  <EmptyHeader>
    <EmptyMedia variant="icon">
      <FolderIcon />
    </EmptyMedia>
    <EmptyTitle>Nothing to see here</EmptyTitle>
    <EmptyDescription>
      No posts have been created yet. Get started by <a href="#">creating your first post</a>.
    </EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button variant="secondary">
      <PlusIcon />
      New Post
    </Button>
  </EmptyContent>
</Empty>
```

## Empty with border / muted background

Surface treatment is a class on `Empty`: `border`, `bg-muted`, `bg-muted/50`.

```tsx
import { ArrowUpRightIcon } from "@/components/icons"
import { Button, LinkButton } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
```

```tsx
<Empty className="bg-muted">
  <EmptyHeader>
    <EmptyTitle>No results found</EmptyTitle>
    <EmptyDescription>
      No results found for your search. Try adjusting your search terms.
    </EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button variant="primary">Try again</Button>
    <LinkButton variant="link" href="#" className="text-fg-muted">
      Learn more <ArrowUpRightIcon />
    </LinkButton>
  </EmptyContent>
</Empty>
```

## Empty with search (404 page)

```tsx
import { CircleDashedIcon } from "@/components/icons"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Input, InputGroup, InputGroupAddon } from "@/components/ui/input"
import { Kbd } from "@/components/ui/kbd"
import { TextField } from "@/components/ui/text-field"
```

```tsx
<Empty className="border">
  <EmptyHeader>
    <EmptyTitle>404 - Not Found</EmptyTitle>
    <EmptyDescription>
      The page you're looking for doesn't exist. Try searching for what you need below.
    </EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <TextField aria-label="Search pages" className="w-3/4">
      <InputGroup>
        <InputGroupAddon>
          <CircleDashedIcon />
        </InputGroupAddon>
        <Input placeholder="Try searching for pages..." />
        <InputGroupAddon>
          <Kbd>/</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </TextField>
    <EmptyDescription>
      Need help? <a href="#">Contact support</a>
    </EmptyDescription>
  </EmptyContent>
</Empty>
```

## Empty in card

```tsx
import { FolderIcon } from "@/components/icons"
import { Button, LinkButton } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
```

```tsx
<Card className="w-full">
  <CardContent>
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderIcon />
        </EmptyMedia>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>Get started by creating your first project.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <LinkButton variant="primary" href="#">
            Create project
          </LinkButton>
          <Button variant="secondary">Import project</Button>
        </div>
      </EmptyContent>
    </Empty>
  </CardContent>
</Card>
```

## Marker

`variant`: `default` (plain row), `separator` (centered between hairlines), `border` (underlined row).

```tsx
import { Marker, MarkerContent } from "@/components/ui/marker"
```

```tsx
<Marker variant="separator">
  <MarkerContent>Today</MarkerContent>
</Marker>

<Marker variant="border">
  <MarkerContent>Earlier this week</MarkerContent>
</Marker>
```

## Marker with icon

```tsx
import { BellIcon } from "@/components/icons"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
```

```tsx
<Marker>
  <MarkerIcon>
    <BellIcon />
  </MarkerIcon>
  <MarkerContent>3 unread messages</MarkerContent>
</Marker>
```

## Avatar

Always render both: the image shows once loaded, the fallback until then and on failure.

```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
```

```tsx
<Avatar>
  <AvatarImage src="https://github.com/mehdibha.png" alt="@mehdibha" />
  <AvatarFallback>M</AvatarFallback>
</Avatar>
```

## Avatar fallback only

```tsx
import { UserIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
```

```tsx
<Avatar>
  <AvatarFallback>MB</AvatarFallback>
</Avatar>

<Avatar>
  <AvatarFallback>
    <UserIcon className="size-4" />
  </AvatarFallback>
</Avatar>
```

## Avatar sizes & radii

`size`: `sm`, `md`, `lg`; radius via a class on `Avatar`.

```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
```

```tsx
<Avatar size="sm">
  <AvatarImage src="https://github.com/mehdibha.png" alt="@mehdibha" />
  <AvatarFallback>M</AvatarFallback>
</Avatar>
<Avatar size="lg" className="rounded-full">
  <AvatarImage src="https://github.com/mehdibha.png" alt="@mehdibha" />
  <AvatarFallback>M</AvatarFallback>
</Avatar>
```

## Avatar with status badge

`AvatarBadge` sits bottom-right; `top-0` moves it to the top corner.

```tsx
import { PlusIcon } from "lucide-react"

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
```

```tsx
<Avatar>
  <AvatarImage src="https://github.com/mehdibha.png" alt="@mehdibha" />
  <AvatarFallback>M</AvatarFallback>
  <AvatarBadge className="bg-success" />
</Avatar>

<Avatar>
  <AvatarImage src="https://github.com/mehdibha.png" alt="@mehdibha" />
  <AvatarFallback>M</AvatarFallback>
  <AvatarBadge className="top-0 bg-success" />
</Avatar>

<Avatar>
  <AvatarImage src="https://github.com/mehdibha.png" alt="@mehdibha" />
  <AvatarFallback>M</AvatarFallback>
  <AvatarBadge>
    <PlusIcon />
  </AvatarBadge>
</Avatar>
```

## Avatar with notification badge

```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
```

```tsx
<Avatar>
  <AvatarImage src="https://github.com/mehdibha.png" alt="@mehdibha" />
  <AvatarFallback>M</AvatarFallback>
  <Badge size="sm" className="-top-1.5 -right-1.5 rounded-full">
    6
  </Badge>
</Avatar>
```

## Avatar group

```tsx
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
```

```tsx
<AvatarGroup>
  <Avatar>
    <AvatarImage src="https://github.com/mehdibha.png" alt="@mehdibha" />
    <AvatarFallback>M</AvatarFallback>
  </Avatar>
  <Avatar>
    <AvatarImage src="https://github.com/tannerlinsley.png" alt="@tannerlinsley" />
    <AvatarFallback>T</AvatarFallback>
  </Avatar>
  <Avatar>
    <AvatarImage src="https://github.com/devongovett.png" alt="@devongovett" />
    <AvatarFallback>D</AvatarFallback>
  </Avatar>
  <AvatarGroupCount>+3</AvatarGroupCount>
</AvatarGroup>
```

## Card

```tsx
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
```

```tsx
<Card className="w-full max-w-sm">
  <CardHeader>
    <CardTitle>Default Card</CardTitle>
    <CardDescription>This card uses the default spacing.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>The card component provides a simple container with header, content, and footer sections.</p>
  </CardContent>
  <CardFooter>
    <Button variant="secondary" className="w-full">
      Action
    </Button>
  </CardFooter>
</Card>
```

## Card with action

`CardAction` is pinned at the end of the header row.

```tsx
import { CaptionsIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
```

```tsx
<Card className="w-full max-w-sm">
  <CardHeader>
    <CardTitle>Meeting Notes</CardTitle>
    <CardDescription>Transcript from the meeting with the client.</CardDescription>
    <CardAction>
      <Button variant="secondary" size="sm">
        <CaptionsIcon />
        Transcribe
      </Button>
    </CardAction>
  </CardHeader>
  <CardContent>
    <p>Client requested dashboard redesign with focus on mobile responsiveness.</p>
  </CardContent>
</Card>
```

## Card small size

```tsx
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
```

```tsx
<Card size="sm" className="w-full max-w-sm">
  <CardHeader>
    <CardTitle>Small Card</CardTitle>
    <CardDescription>This card uses the small size variant.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>The card component supports a size prop set to "sm" for a compact appearance.</p>
  </CardContent>
  <CardFooter>
    <Button variant="secondary" size="sm" className="w-full">
      Action
    </Button>
  </CardFooter>
</Card>
```

## Card with section borders

```tsx
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
```

```tsx
<Card className="w-full max-w-sm">
  <CardHeader className="border-b">
    <CardTitle>Header with Border</CardTitle>
    <CardDescription>This card has a header with a bottom border.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>The header has a border-b class applied.</p>
  </CardContent>
  <CardFooter className="border-t">
    <Button variant="secondary" className="w-full">
      Footer with Border
    </Button>
  </CardFooter>
</Card>
```

## Card with image

```tsx
import { PlusIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
```

```tsx
<Card>
  <img
    src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop"
    alt="Event cover"
    className="relative z-20 aspect-video w-full object-cover"
  />
  <CardHeader>
    <CardTitle>Beautiful Landscape</CardTitle>
    <CardDescription>A stunning view that captures the essence of natural beauty.</CardDescription>
  </CardHeader>
  <CardFooter>
    <Button className="w-full">
      <PlusIcon />
      Button
    </Button>
  </CardFooter>
</Card>
```

## Card with form (login)

```tsx
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"
```

```tsx
<Card className="w-full max-w-xs">
  <CardHeader>
    <CardTitle>Login to your account</CardTitle>
    <CardDescription>Enter your email below to login to your account</CardDescription>
    <CardAction>
      <Button variant="link">Sign Up</Button>
    </CardAction>
  </CardHeader>
  <CardContent>
    <form className="flex flex-col gap-6">
      <TextField className="w-full">
        <Label>Email</Label>
        <Input type="email" placeholder="m@example.com" required />
      </TextField>
      <TextField className="w-full">
        <Label>Password</Label>
        <Input type="password" required />
      </TextField>
    </form>
  </CardContent>
  <CardFooter className="flex-col gap-2">
    <Button variant="primary" type="submit" className="w-full">
      Login
    </Button>
    <Button variant="secondary" className="w-full">
      Login with Google
    </Button>
  </CardFooter>
</Card>
```

## Card with avatar group footer

```tsx
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
```

```tsx
<Card className="w-full max-w-sm">
  <CardHeader>
    <CardTitle>Meeting Notes</CardTitle>
  </CardHeader>
  <CardContent>
    <ol className="flex list-decimal flex-col gap-2 pl-6">
      <li>New analytics widgets for daily/weekly metrics</li>
      <li>Simplified navigation menu</li>
    </ol>
  </CardContent>
  <CardFooter>
    <AvatarGroup>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
        <AvatarFallback>LR</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+8</AvatarGroupCount>
    </AvatarGroup>
  </CardFooter>
</Card>
```

## Separator

```tsx
import { Separator } from "@/components/ui/separator"
```

```tsx
<div className="w-full max-w-xs text-sm">
  <p>Above the separator</p>
  <Separator className="my-3" />
  <p>Below the separator</p>
</div>
```

## Separator vertical

```tsx
import { Separator } from "@/components/ui/separator"
```

```tsx
<div className="flex h-5 items-center space-x-4 text-sm">
  <div>Docs</div>
  <Separator orientation="vertical" />
  <div>Components</div>
  <Separator orientation="vertical" />
  <div>Hooks</div>
</div>
```

## Separator in menu

```tsx
import { CreditCardIcon, LogOutIcon, SettingsIcon, UserIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Menu, MenuContent, MenuItem } from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
```

```tsx
<Menu>
  <Button variant="secondary">Account</Button>
  <Popover>
    <MenuContent>
      <MenuItem textValue="Profile">
        <UserIcon />
        Profile
      </MenuItem>
      <MenuItem textValue="Billing">
        <CreditCardIcon />
        Billing
      </MenuItem>
      <MenuItem textValue="Settings">
        <SettingsIcon />
        Settings
      </MenuItem>
      <Separator />
      <MenuItem variant="danger" textValue="Log out">
        <LogOutIcon />
        Log out
      </MenuItem>
    </MenuContent>
  </Popover>
</Menu>
```

## Separator in list box (user menu)

```tsx
import { BellIcon, LogOutIcon, SettingsIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ListBox, ListBoxItem } from "@/components/ui/list-box"
import { Separator } from "@/components/ui/separator"
```

```tsx
<div className="w-full max-w-xs rounded-md border bg-card shadow-sm">
  <div className="flex items-center gap-2 p-2">
    <Avatar size="sm">
      <AvatarImage src="https://github.com/mehdibha.png" alt="@mehdibha" />
      <AvatarFallback>MB</AvatarFallback>
    </Avatar>
    <div className="flex flex-col text-sm">
      <p>Mehdi Ben Hadj Ali</p>
      <p className="text-xs text-fg-muted">mehdi@example.com</p>
    </div>
  </div>
  <Separator />
  <ListBox aria-label="User menu">
    <ListBoxItem id="settings" textValue="Settings">
      <SettingsIcon />
      Settings
    </ListBoxItem>
    <ListBoxItem id="notifications" textValue="Notifications">
      <BellIcon />
      Notifications
    </ListBoxItem>
    <Separator />
    <ListBoxItem id="logout" variant="danger" textValue="Log out">
      <LogOutIcon />
      Log out
    </ListBoxItem>
  </ListBox>
</div>
```

## Text

Text is the slotted React Aria text primitive; `Description` from field wraps it with `slot="description"`. Use it directly for a slotted description inside a control.

```tsx
import { Checkbox, CheckboxControl, CheckboxIndicator } from "@/components/ui/checkbox"
import { FieldContent, Label } from "@/components/ui/field"
import { Text } from "@/components/ui/text"
```

```tsx
<Checkbox className="w-full">
  <CheckboxControl>
    <CheckboxIndicator />
    <FieldContent>
      <Label>I agree to the terms and conditions</Label>
      <Text slot="description">Please read the terms before proceeding</Text>
    </FieldContent>
  </CheckboxControl>
</Checkbox>
```

# Chat & files

## Bubble

```tsx
import { Bubble, BubbleContent } from "@/components/ui/bubble"
```

```tsx
<Bubble align="end">
  <BubbleContent>Shipping it this week 🚀</BubbleContent>
</Bubble>
```

## Bubble variants

The variant styles the contained surface; `align` picks the side of the conversation.

```tsx
import { Bubble, BubbleContent } from "@/components/ui/bubble"
```

```tsx
<Bubble variant="primary">
  <BubbleContent>This is the primary bubble.</BubbleContent>
</Bubble>
<Bubble variant="neutral">
  <BubbleContent>This is the neutral bubble.</BubbleContent>
</Bubble>
<Bubble variant="muted">
  <BubbleContent>This is the muted bubble.</BubbleContent>
</Bubble>
<Bubble variant="tinted">
  <BubbleContent>This is the tinted bubble.</BubbleContent>
</Bubble>
<Bubble variant="outline">
  <BubbleContent>This is the outline bubble.</BubbleContent>
</Bubble>
<Bubble variant="ghost">
  <BubbleContent>This is the ghost bubble.</BubbleContent>
</Bubble>
<Bubble variant="danger">
  <BubbleContent>This is the danger bubble.</BubbleContent>
</Bubble>
```

## Bubble group

Consecutive bubbles from the same sender stack with a tight gap.

```tsx
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"
```

```tsx
<BubbleGroup>
  <Bubble variant="muted">
    <BubbleContent>Did you see the new studio panel?</BubbleContent>
  </Bubble>
  <Bubble variant="muted">
    <BubbleContent>The drill-in animation is so smooth.</BubbleContent>
  </Bubble>
</BubbleGroup>
<Bubble align="end">
  <BubbleContent>Shipping it this week 🚀</BubbleContent>
</Bubble>
```

## Bubble with reactions

Emoji reactions pinned to a corner of the bubble; `side` picks the edge, `align` the corner.

```tsx
import { Bubble, BubbleContent, BubbleReactions } from "@/components/ui/bubble"
```

```tsx
<Bubble variant="muted">
  <BubbleContent>We just passed 10k stars!</BubbleContent>
  <BubbleReactions>🎉 3</BubbleReactions>
</Bubble>
<Bubble align="end">
  <BubbleContent>Huge. Congrats team!</BubbleContent>
  <BubbleReactions align="start">❤️ 2</BubbleReactions>
</Bubble>
```

## Message

One turn in a conversation; `align="end"` flips the row to the sender's side.

```tsx
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Message, MessageContent } from "@/components/ui/message"
```

```tsx
<Message>
  <MessageContent>
    <Bubble variant="muted">
      <BubbleContent>How do I center a div?</BubbleContent>
    </Bubble>
  </MessageContent>
</Message>
<Message align="end">
  <MessageContent>
    <Bubble align="end">
      <BubbleContent>Grid on the parent, place-items center.</BubbleContent>
    </Bubble>
  </MessageContent>
</Message>
```

## Message with avatar, header and footer

```tsx
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/components/ui/message"
```

```tsx
<Message>
  <MessageAvatar>
    <Avatar size="sm">
      <AvatarFallback>LN</AvatarFallback>
    </Avatar>
  </MessageAvatar>
  <MessageContent>
    <MessageHeader>Lena · 2:14 PM</MessageHeader>
    <BubbleGroup>
      <Bubble variant="muted">
        <BubbleContent>Did you see the new studio panel?</BubbleContent>
      </Bubble>
      <Bubble variant="muted">
        <BubbleContent>The drill-in feels really smooth.</BubbleContent>
      </Bubble>
    </BubbleGroup>
  </MessageContent>
</Message>
<Message align="end">
  <MessageContent>
    <Bubble align="end">
      <BubbleContent>Shipping it this week 🚀</BubbleContent>
    </Bubble>
    <MessageFooter>Seen · 2:16 PM</MessageFooter>
  </MessageContent>
</Message>
```

## Message group

Consecutive messages from one sender stack inside a `MessageGroup`.

```tsx
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageGroup,
} from "@/components/ui/message"
```

```tsx
<MessageGroup>
  <Message>
    <MessageAvatar>
      <Avatar size="sm">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
    </MessageAvatar>
    <MessageContent>
      <BubbleGroup>
        <Bubble variant="muted">
          <BubbleContent>Three messages,</BubbleContent>
        </Bubble>
        <Bubble variant="muted">
          <BubbleContent>one sender,</BubbleContent>
        </Bubble>
        <Bubble variant="muted">
          <BubbleContent>one tight stack.</BubbleContent>
        </Bubble>
      </BubbleGroup>
    </MessageContent>
  </Message>
</MessageGroup>
```

## Message scroller

A message list that sticks to the newest message; the button appears once the reader scrolls away from the bottom edge.

```tsx
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Message, MessageContent } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
```

```tsx
<MessageScrollerProvider>
  <MessageScroller className="h-64 w-full max-w-md">
    <MessageScrollerViewport>
      <MessageScrollerContent className="p-4">
        {conversation.map((message, index) => (
          <MessageScrollerItem key={index}>
            <Message align={message.role === "user" ? "end" : "start"}>
              <MessageContent>
                {message.role === "user" ? (
                  <Bubble align="end" variant="muted">
                    <BubbleContent>{message.text}</BubbleContent>
                  </Bubble>
                ) : (
                  message.text
                )}
              </MessageContent>
            </Message>
          </MessageScrollerItem>
        ))}
      </MessageScrollerContent>
    </MessageScrollerViewport>
    <MessageScrollerButton />
  </MessageScroller>
</MessageScrollerProvider>
```

## Message scroller with autoscroll

`autoScroll` on the provider follows new messages while the reader is at the bottom and stays put once they scroll away.

```tsx
import React from "react"

import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Message, MessageContent } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
```

```tsx
const [messages, setMessages] = React.useState<Turn[]>([
  { id: 0, role: "user", text: "How does the message scroller behave?" },
  { id: 1, role: "assistant", text: "Autoscroll only follows while you're at the bottom." },
])

<MessageScrollerProvider autoScroll>
  <MessageScroller>
    <MessageScrollerViewport>
      <MessageScrollerContent className="p-4">
        {messages.map((message) => (
          <MessageScrollerItem key={message.id}>
            <Message align={message.role === "user" ? "end" : "start"}>
              <MessageContent>
                {message.role === "user" ? (
                  <Bubble align="end" variant="muted">
                    <BubbleContent>{message.text}</BubbleContent>
                  </Bubble>
                ) : (
                  message.text
                )}
              </MessageContent>
            </Message>
          </MessageScrollerItem>
        ))}
      </MessageScrollerContent>
    </MessageScrollerViewport>
    <MessageScrollerButton />
  </MessageScroller>
</MessageScrollerProvider>
<Button onPress={() => setMessages((prev) => [...prev, { id: prev.length, role: "user", text: "Tell me more." }])}>
  Add message
</Button>
```

## Attachment

```tsx
import { FileTextIcon, XIcon } from "@/components/icons"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
```

```tsx
<Attachment>
  <AttachmentMedia>
    <FileTextIcon />
  </AttachmentMedia>
  <AttachmentContent>
    <AttachmentTitle>quarterly-report.pdf</AttachmentTitle>
    <AttachmentDescription>1.2 MB · PDF</AttachmentDescription>
  </AttachmentContent>
  <AttachmentActions>
    <AttachmentAction aria-label="Remove attachment">
      <XIcon />
    </AttachmentAction>
  </AttachmentActions>
</Attachment>
```

## Attachment states

`state` walks the upload lifecycle: `idle`, `uploading`, `processing`, `error`, `done`.

```tsx
import { FileIcon, RefreshCwIcon, XIcon } from "@/components/icons"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { Loader } from "@/components/ui/loader"
```

```tsx
<Attachment state="uploading">
  <AttachmentMedia>
    <Loader />
  </AttachmentMedia>
  <AttachmentContent>
    <AttachmentTitle>screen-recording.mp4</AttachmentTitle>
    <AttachmentDescription>Uploading… 34%</AttachmentDescription>
  </AttachmentContent>
  <AttachmentActions>
    <AttachmentAction aria-label="Cancel upload">
      <XIcon />
    </AttachmentAction>
  </AttachmentActions>
</Attachment>
<Attachment state="error">
  <AttachmentMedia>
    <FileIcon />
  </AttachmentMedia>
  <AttachmentContent>
    <AttachmentTitle>design-specs.fig</AttachmentTitle>
    <AttachmentDescription>Upload failed</AttachmentDescription>
  </AttachmentContent>
  <AttachmentActions>
    <AttachmentAction aria-label="Retry upload">
      <RefreshCwIcon />
    </AttachmentAction>
    <AttachmentAction aria-label="Remove attachment">
      <XIcon />
    </AttachmentAction>
  </AttachmentActions>
</Attachment>
```

## Attachment sizes

```tsx
import { FileTextIcon } from "@/components/icons"
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
```

```tsx
<Attachment size="xs">
  <AttachmentMedia>
    <FileTextIcon />
  </AttachmentMedia>
  <AttachmentContent>
    <AttachmentTitle>quarterly-report.pdf</AttachmentTitle>
    <AttachmentDescription>1.2 MB · PDF</AttachmentDescription>
  </AttachmentContent>
</Attachment>
<Attachment size="sm">{/* … */}</Attachment>
<Attachment size="md">{/* … */}</Attachment>
```

## Attachment vertical

`orientation="vertical"` stacks the media above the content.

```tsx
import { ImageIcon, XIcon } from "@/components/icons"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
```

```tsx
<Attachment orientation="vertical">
  <AttachmentMedia>
    <ImageIcon />
  </AttachmentMedia>
  <AttachmentContent>
    <AttachmentTitle>hero-banner.png</AttachmentTitle>
    <AttachmentDescription>640 KB</AttachmentDescription>
  </AttachmentContent>
  <AttachmentActions>
    <AttachmentAction aria-label="Remove attachment">
      <XIcon />
    </AttachmentAction>
  </AttachmentActions>
</Attachment>
```

## Attachment group

A horizontally scrolling row of attachments with snap points.

```tsx
import { FileCodeIcon, FileIcon, FileTextIcon } from "@/components/icons"
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
```

```tsx
<AttachmentGroup>
  <Attachment size="sm">
    <AttachmentMedia>
      <FileTextIcon />
    </AttachmentMedia>
    <AttachmentContent>
      <AttachmentTitle>notes.md</AttachmentTitle>
      <AttachmentDescription>4 KB</AttachmentDescription>
    </AttachmentContent>
  </Attachment>
  <Attachment size="sm">
    <AttachmentMedia>
      <FileCodeIcon />
    </AttachmentMedia>
    <AttachmentContent>
      <AttachmentTitle>styles.ts</AttachmentTitle>
      <AttachmentDescription>12 KB</AttachmentDescription>
    </AttachmentContent>
  </Attachment>
  <Attachment size="sm">
    <AttachmentMedia>
      <FileIcon />
    </AttachmentMedia>
    <AttachmentContent>
      <AttachmentTitle>tokens.json</AttachmentTitle>
      <AttachmentDescription>8 KB</AttachmentDescription>
    </AttachmentContent>
  </Attachment>
</AttachmentGroup>
```

## Attachment with trigger

`AttachmentTrigger` stretches an invisible click target over the whole card while the actions stay independently pressable.

```tsx
import { FileTextIcon, XIcon } from "@/components/icons"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/components/ui/attachment"
```

```tsx
<Attachment>
  <AttachmentMedia>
    <FileTextIcon />
  </AttachmentMedia>
  <AttachmentContent>
    <AttachmentTitle>quarterly-report.pdf</AttachmentTitle>
    <AttachmentDescription>1.2 MB · PDF</AttachmentDescription>
  </AttachmentContent>
  <AttachmentActions>
    <AttachmentAction aria-label="Remove attachment">
      <XIcon />
    </AttachmentAction>
  </AttachmentActions>
  <AttachmentTrigger aria-label="Open file" onClick={openFile} />
</Attachment>
```

## Attachment with image thumbnail

```tsx
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
```

```tsx
<Attachment>
  <AttachmentMedia variant="image">
    <img src="/hero-banner.png" alt="" />
  </AttachmentMedia>
  <AttachmentContent>
    <AttachmentTitle>hero-banner.png</AttachmentTitle>
    <AttachmentDescription>640 KB</AttachmentDescription>
  </AttachmentContent>
</Attachment>
```

## Drop zone

```tsx
import { UploadIcon } from "@/components/icons"
import { DropZone, DropZoneLabel } from "@/components/ui/drop-zone"
```

```tsx
<DropZone>
  <UploadIcon className="size-5 text-fg-muted" />
  <DropZoneLabel>Drag and drop files here</DropZoneLabel>
</DropZone>
```

## Drop zone with aria-label

Without a visible `DropZoneLabel`, name the zone with `aria-label`.

```tsx
import { UploadIcon } from "@/components/icons"
import { DropZone } from "@/components/ui/drop-zone"
```

```tsx
<DropZone aria-label="drag and drop files here">
  <UploadIcon className="size-5 text-fg-muted" />
</DropZone>
```

## Drop zone with file trigger

Pair the zone with a `FileTrigger` so users can pick files without dragging.

```tsx
import { UploadIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { DropZone, DropZoneLabel } from "@/components/ui/drop-zone"
import { FileTrigger } from "@/components/ui/file-trigger"
```

```tsx
<DropZone className="space-y-1">
  <UploadIcon className="size-5 text-fg-muted" />
  <DropZoneLabel>Drag and drop files here</DropZoneLabel>
  <FileTrigger>
    <Button>Select files</Button>
  </FileTrigger>
</DropZone>
```

## Drop zone handling drops

Read dropped data from `e.items` in `onDrop`, filtering by `kind` and `types`.

```tsx
import type { TextDropItem } from "react-aria-components"

import { DropZone, DropZoneLabel } from "@/components/ui/drop-zone"
```

```tsx
<DropZone
  onDrop={async (e) => {
    const items = await Promise.all(
      e.items
        .filter((item) => item.kind === "text" && item.types.has("text/plain"))
        .map((item) => (item as TextDropItem).getText("text/plain")),
    )
    console.log(items)
  }}
>
  <DropZoneLabel>Droppable</DropZoneLabel>
</DropZone>
```

## Drop zone with draggable source

A `useDrag` element that provides items the zone can accept.

```tsx
import { useDrag } from "react-aria"
import type { TextDropItem } from "react-aria-components"

import { DropZone, DropZoneLabel } from "@/components/ui/drop-zone"
```

```tsx
const { dragProps, isDragging } = useDrag({
  getItems() {
    return [{ "text/plain": "Component A" }]
  },
})

<button {...dragProps} type="button" data-dragging={isDragging || undefined}>
  Component A
</button>
<DropZone
  onDrop={async (e) => {
    const items = await Promise.all(
      e.items
        .filter((item) => item.kind === "text" && item.types.has("text/plain"))
        .map((item) => (item as TextDropItem).getText("text/plain")),
    )
  }}
>
  <DropZoneLabel>Droppable</DropZoneLabel>
</DropZone>
```

## Drop zone accepted types & visual feedback

Return `"copy"` or `"cancel"` from `getDropOperation` based on the dragged `types`.

```tsx
import React from "react"

import { DropZone } from "@/components/ui/drop-zone"
```

```tsx
const [dropped, setDropped] = React.useState(false)

<DropZone
  getDropOperation={(types) => (types.has("image/png") ? "copy" : "cancel")}
  onDrop={() => setDropped(true)}
>
  {dropped ? "Successful drop!" : "Drop files here"}
</DropZone>
```

## Drop zone disabled

```tsx
import { UploadIcon } from "@/components/icons"
import { DropZone, DropZoneLabel } from "@/components/ui/drop-zone"
```

```tsx
<DropZone isDisabled>
  <UploadIcon className="size-5" />
  <DropZoneLabel>Drag and drop files here</DropZoneLabel>
</DropZone>
```

## Questionnaire

One question at a time; `required` items block Next, `multiple` renders checkboxes, `shortcuts` adds letter or number keys.

```tsx
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"
```

```tsx
<Questionnaire shortcuts="letters" onSubmit={(event) => event.preventDefault()}>
  <QuestionnaireProgress />
  <QuestionnaireItem name="role" required>
    <QuestionnaireTitle>What best describes your role?</QuestionnaireTitle>
    <QuestionnaireDescription>
      This helps us tailor the onboarding.
    </QuestionnaireDescription>
    <QuestionnaireChoices>
      <QuestionnaireChoice value="designer">Designer</QuestionnaireChoice>
      <QuestionnaireChoice value="engineer">Engineer</QuestionnaireChoice>
      <QuestionnaireChoice value="founder">Founder</QuestionnaireChoice>
    </QuestionnaireChoices>
  </QuestionnaireItem>
  <QuestionnaireItem name="tools" multiple>
    <QuestionnaireTitle>Which tools do you use today?</QuestionnaireTitle>
    <QuestionnaireChoices>
      <QuestionnaireChoice value="figma">Figma</QuestionnaireChoice>
      <QuestionnaireChoice value="storybook">Storybook</QuestionnaireChoice>
      <QuestionnaireChoice value="tailwind">Tailwind CSS</QuestionnaireChoice>
    </QuestionnaireChoices>
  </QuestionnaireItem>
  <QuestionnaireActions>
    <QuestionnairePrevious />
    <QuestionnaireNext />
    <QuestionnaireSubmit />
  </QuestionnaireActions>
</Questionnaire>
```

## Questionnaire with choice descriptions

```tsx
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireItem,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"
```

```tsx
<Questionnaire onSubmit={(event) => event.preventDefault()}>
  <QuestionnaireItem name="plan" required>
    <QuestionnaireTitle>Pick a plan</QuestionnaireTitle>
    <QuestionnaireChoices>
      <QuestionnaireChoice value="free">
        Free
        <QuestionnaireChoiceDescription>
          One design system, community support.
        </QuestionnaireChoiceDescription>
      </QuestionnaireChoice>
      <QuestionnaireChoice value="pro">
        Pro
        <QuestionnaireChoiceDescription>
          Unlimited systems, custom presets, priority support.
        </QuestionnaireChoiceDescription>
      </QuestionnaireChoice>
    </QuestionnaireChoices>
  </QuestionnaireItem>
  <QuestionnaireActions>
    <QuestionnaireSubmit />
  </QuestionnaireActions>
</Questionnaire>
```

## Questionnaire with input, error and skip

Free-text questions use `QuestionnaireInput`; `QuestionnaireError` shows the active validation message and `QuestionnaireSkip` only appears on optional items.

```tsx
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"
```

```tsx
<Questionnaire onSubmit={(event) => event.preventDefault()}>
  <QuestionnaireProgress />
  <QuestionnaireItem name="email" required>
    <QuestionnaireTitle>What's your work email?</QuestionnaireTitle>
    <QuestionnaireDescription>We'll send the invite there.</QuestionnaireDescription>
    <QuestionnaireInput type="email" placeholder="you@company.com" />
    <QuestionnaireError />
  </QuestionnaireItem>
  <QuestionnaireItem name="team">
    <QuestionnaireTitle>What's your team called?</QuestionnaireTitle>
    <QuestionnaireInput type="text" placeholder="Acme design systems" />
  </QuestionnaireItem>
  <QuestionnaireActions>
    <QuestionnairePrevious />
    <QuestionnaireSkip />
    <QuestionnaireNext />
    <QuestionnaireSubmit />
  </QuestionnaireActions>
</Questionnaire>
```

## QR code

Always pass an `aria-label` describing the destination.

```tsx
import { QRCode } from "@/components/ui/qr-code"
```

```tsx
<QRCode value="https://dotui.org" aria-label="dotUI website" />
```

## QR code with logo

Children render as a centered logo; the modules behind it are excavated and error correction defaults to `H`.

```tsx
import { GlobeIcon } from "lucide-react"

import { QRCode } from "@/components/ui/qr-code"
```

```tsx
<QRCode value="https://dotui.org" aria-label="dotUI website">
  <GlobeIcon />
</QRCode>
```

## QR code error correction & sizes

`errorCorrection` is `L`, `M`, `Q` or `H`; size is set with a `size-*` class.

```tsx
import { QRCode } from "@/components/ui/qr-code"
```

```tsx
<QRCode value="https://dotui.org" errorCorrection="Q" className="size-20" />
<QRCode value="https://dotui.org" className="size-32" />
<QRCode value="https://dotui.org" className="size-44" />
```

# Charts

## Chart

The base composition: Recharts components wrapped in `ChartContainer`, which turns each `config` key into a `--color-<key>` CSS variable.

```tsx
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
```

```tsx
const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
]

const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
} satisfies ChartConfig

<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
  <BarChart accessibilityLayer data={chartData}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" tickLine={false} axisLine={false} />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
  </BarChart>
</ChartContainer>
```

## Chart config with per-theme colors

Use `theme` instead of `color` when a series needs a different value in light and dark mode.

```tsx
import { type ChartConfig } from "@/components/ui/chart"
```

```tsx
const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", theme: { light: "#2563eb", dark: "#60a5fa" } },
} satisfies ChartConfig
```

## Chart tooltip and legend

`ChartTooltip`/`ChartLegend` are the Recharts primitives; the `*Content` components are the styled, config-aware contents.

```tsx
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
```

```tsx
<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
  <BarChart accessibilityLayer data={chartData}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
    <ChartTooltip
      cursor={false}
      content={<ChartTooltipContent indicator="dashed" hideLabel />}
    />
    <ChartLegend content={<ChartLegendContent hideIcon />} />
    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
  </BarChart>
</ChartContainer>
```

## Chart with series icons

An `icon` in config is picked up by the tooltip and legend.

```tsx
import { MonitorIcon, SmartphoneIcon } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
```

```tsx
const chartConfig = {
  desktop: { label: "Desktop", icon: MonitorIcon, color: "var(--chart-1)" },
  mobile: { label: "Mobile", icon: SmartphoneIcon, color: "var(--chart-2)" },
} satisfies ChartConfig

<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
  <AreaChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" tickLine={false} tickMargin={8} axisLine={false} />
    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
    <Area dataKey="mobile" type="natural" fill="var(--color-mobile)" fillOpacity={0.4} stroke="var(--color-mobile)" stackId="a" />
    <Area dataKey="desktop" type="natural" fill="var(--color-desktop)" fillOpacity={0.4} stroke="var(--color-desktop)" stackId="a" />
    <ChartLegend content={<ChartLegendContent />} />
  </AreaChart>
</ChartContainer>
```

## Chart with accessible data table

`ChartDataTable` renders a visually-hidden table from the same `data` and `config`; `labelKey` is the row header field.

```tsx
import { Bar, BarChart, XAxis } from "recharts"

import {
  ChartContainer,
  ChartDataTable,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
```

```tsx
<>
  <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
    <BarChart accessibilityLayer data={chartData}>
      <XAxis dataKey="month" tickLine={false} axisLine={false} />
      <ChartTooltip content={<ChartTooltipContent />} />
      <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
    </BarChart>
  </ChartContainer>
  <ChartDataTable
    data={chartData}
    config={chartConfig}
    labelKey="month"
    caption="Desktop visitors, January through June 2024"
  />
</>
```

## Chart in a Card

The family components (`ChartBar`, `ChartArea`, …) wrap a chart in a Card with header and footer.

```tsx
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { TrendingUpIcon } from "@/components/icons"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartDataTable,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
```

```tsx
<Card>
  <CardHeader>
    <CardTitle>Bar Chart</CardTitle>
    <CardDescription>January - June 2024</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
    <ChartDataTable data={chartData} config={chartConfig} labelKey="month" />
  </CardContent>
  <CardFooter className="flex-col items-start gap-2 text-sm">
    <div className="flex gap-2 leading-none font-medium">
      Trending up by 5.2% this month <TrendingUpIcon className="size-4" />
    </div>
    <div className="leading-none text-fg-muted">
      Showing total visitors for the last 6 months
    </div>
  </CardFooter>
</Card>
```

## Area chart

```tsx
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartDataTable,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
```

```tsx
const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
]

const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
} satisfies ChartConfig

<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
  <AreaChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
    <CartesianGrid vertical={false} />
    <XAxis
      dataKey="month"
      tickLine={false}
      tickMargin={8}
      axisLine={false}
      tickFormatter={(value) => value.slice(0, 3)}
    />
    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
    <Area
      dataKey="desktop"
      type="natural"
      fill="var(--color-desktop)"
      fillOpacity={0.4}
      stroke="var(--color-desktop)"
    />
  </AreaChart>
</ChartContainer>
<ChartDataTable data={chartData} config={chartConfig} labelKey="month" />
```

## Area chart curve types

`type` on `Area` (and `Line`) switches the interpolation: `natural`, `linear`, `step`, `monotone`.

```tsx
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
```

```tsx
<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
  <AreaChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" tickLine={false} tickMargin={8} axisLine={false} />
    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
    <Area
      dataKey="desktop"
      type="step"
      fill="var(--color-desktop)"
      fillOpacity={0.4}
      stroke="var(--color-desktop)"
    />
  </AreaChart>
</ChartContainer>
```

## Area chart with Y axis

```tsx
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
```

```tsx
<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
  <AreaChart accessibilityLayer data={chartData} margin={{ left: 0, right: 12 }}>
    <CartesianGrid vertical={false} />
    <XAxis
      dataKey="month"
      tickLine={false}
      tickMargin={8}
      axisLine={false}
      tickFormatter={(value) => value.slice(0, 3)}
    />
    <YAxis
      width="auto"
      tickLine={false}
      axisLine={false}
      tickMargin={4}
      tickCount={4}
      tickFormatter={(value) => `${value}`}
    />
    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
    <Area dataKey="desktop" type="natural" fill="var(--color-desktop)" fillOpacity={0.4} stroke="var(--color-desktop)" />
  </AreaChart>
</ChartContainer>
```

## Area chart stacked

Series sharing a `stackId` stack on top of each other; add a legend for multi-series charts.

```tsx
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
```

```tsx
const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
} satisfies ChartConfig

<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
  <AreaChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" tickLine={false} tickMargin={8} axisLine={false} />
    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
    <Area
      dataKey="mobile"
      type="natural"
      fill="var(--color-mobile)"
      fillOpacity={0.4}
      stroke="var(--color-mobile)"
      stackId="a"
    />
    <Area
      dataKey="desktop"
      type="natural"
      fill="var(--color-desktop)"
      fillOpacity={0.4}
      stroke="var(--color-desktop)"
      stackId="a"
    />
    <ChartLegend content={<ChartLegendContent />} />
  </AreaChart>
</ChartContainer>
```

## Area chart stacked expanded

`stackOffset="expand"` normalizes stacked series to 100%.

```tsx
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
```

```tsx
<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
  <AreaChart
    accessibilityLayer
    data={chartData}
    margin={{ left: 12, right: 12 }}
    stackOffset="expand"
  >
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" tickLine={false} tickMargin={8} axisLine={false} />
    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
    <Area dataKey="other" type="natural" fill="var(--color-other)" fillOpacity={0.1} stroke="var(--color-other)" stackId="a" />
    <Area dataKey="mobile" type="natural" fill="var(--color-mobile)" fillOpacity={0.4} stroke="var(--color-mobile)" stackId="a" />
    <Area dataKey="desktop" type="natural" fill="var(--color-desktop)" fillOpacity={0.4} stroke="var(--color-desktop)" stackId="a" />
    <ChartLegend content={<ChartLegendContent />} />
  </AreaChart>
</ChartContainer>
```

## Area chart with gradient fill

Define SVG gradients in `<defs>` using the config color variables, then reference them by `url(#id)`.

```tsx
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
```

```tsx
<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
  <AreaChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" tickLine={false} tickMargin={8} axisLine={false} />
    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
    <defs>
      <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
        <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
      </linearGradient>
      <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
        <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
      </linearGradient>
    </defs>
    <Area dataKey="mobile" type="natural" fill="url(#fillMobile)" fillOpacity={0.4} stroke="var(--color-mobile)" stackId="a" />
    <Area dataKey="desktop" type="natural" fill="url(#fillDesktop)" fillOpacity={0.4} stroke="var(--color-desktop)" stackId="a" />
    <ChartLegend content={<ChartLegendContent />} />
  </AreaChart>
</ChartContainer>
```

## Bar chart

```tsx
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartDataTable,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
```

```tsx
const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
]

const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
} satisfies ChartConfig

<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
  <BarChart accessibilityLayer data={chartData}>
    <CartesianGrid vertical={false} />
    <XAxis
      dataKey="month"
      tickLine={false}
      tickMargin={10}
      axisLine={false}
      tickFormatter={(value) => value.slice(0, 3)}
    />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
  </BarChart>
</ChartContainer>
<ChartDataTable data={chartData} config={chartConfig} labelKey="month" />
```

## Bar chart multiple

```tsx
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
```

```tsx
const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
} satisfies ChartConfig

<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
  <BarChart accessibilityLayer data={chartData}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
    <ChartLegend content={<ChartLegendContent />} />
    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
  </BarChart>
</ChartContainer>
```

## Bar chart stacked

Round only the outer corners of the stack with a per-corner `radius` array.

```tsx
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
```

```tsx
<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
  <BarChart accessibilityLayer data={chartData}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
    <ChartLegend content={<ChartLegendContent />} />
    <Bar dataKey="desktop" stackId="a" fill="var(--color-desktop)" radius={[0, 0, 4, 4]} />
    <Bar dataKey="mobile" stackId="a" fill="var(--color-mobile)" />
    <Bar dataKey="tablet" stackId="a" fill="var(--color-tablet)" radius={[4, 4, 0, 0]} />
  </BarChart>
</ChartContainer>
```

## Bar chart horizontal

`layout="vertical"` on the chart with a numeric `XAxis` and a category `YAxis`.

```tsx
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
```

```tsx
<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
  <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: -20 }}>
    <CartesianGrid horizontal={false} />
    <XAxis type="number" dataKey="desktop" hide />
    <YAxis
      dataKey="month"
      type="category"
      tickLine={false}
      tickMargin={10}
      axisLine={false}
      tickFormatter={(value) => value.slice(0, 3)}
    />
    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
  </BarChart>
</ChartContainer>
```

## Bar chart with labels

```tsx
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
```

```tsx
<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
  <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8}>
      <LabelList position="top" offset={12} className="fill-fg" fontSize={12} />
    </Bar>
  </BarChart>
</ChartContainer>
```

## Bar chart with custom inside labels

A horizontal bar with hidden axes and two `LabelList`s: the category inside the bar, the value to its right. The `label` config key only supplies a color.

```tsx
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
```

```tsx
const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  label: { color: "var(--chart-1)" },
} satisfies ChartConfig

<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
  <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ right: 16 }}>
    <YAxis dataKey="month" type="category" tickLine={false} tickMargin={10} axisLine={false} hide />
    <XAxis dataKey="desktop" type="number" hide />
    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4}>
      <LabelList dataKey="month" position="insideLeft" offset={8} className="fill-(--color-label)" fontSize={12} />
      <LabelList dataKey="desktop" position="right" offset={8} className="fill-fg" fontSize={12} />
    </Bar>
  </BarChart>
</ChartContainer>
```

## Bar chart per-category colors

Long-format data carries its own `fill`; a `Cell` per row applies it, and the axis reads labels from config.

```tsx
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartDataTable,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
```

```tsx
const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
]

const chartConfig = {
  visitors: { label: "Visitors" },
  chrome: { label: "Chrome", color: "var(--chart-1)" },
  safari: { label: "Safari", color: "var(--chart-2)" },
  firefox: { label: "Firefox", color: "var(--chart-3)" },
} satisfies ChartConfig

<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
  <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: 0 }}>
    <YAxis
      dataKey="browser"
      type="category"
      tickLine={false}
      tickMargin={10}
      axisLine={false}
      tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label as string}
    />
    <XAxis dataKey="visitors" type="number" hide />
    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
    <Bar dataKey="visitors" radius={5}>
      {chartData.map((entry) => (
        <Cell key={entry.browser} fill={entry.fill} />
      ))}
    </Bar>
  </BarChart>
</ChartContainer>
<ChartDataTable data={chartData} config={chartConfig} labelKey="browser" />
```

## Bar chart with negative values

A `ReferenceLine` at zero, and a `Cell` fill chosen by sign.

```tsx
import { Bar, BarChart, Cell, LabelList, ReferenceLine, XAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
```

```tsx
<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
  <BarChart accessibilityLayer data={chartData}>
    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel hideIndicator />} />
    <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
    <ReferenceLine y={0} stroke="var(--border)" />
    <Bar dataKey="visitors">
      <LabelList position="top" dataKey="month" fillOpacity={1} />
      {chartData.map((entry) => (
        <Cell
          key={entry.month}
          fill={entry.visitors > 0 ? "var(--chart-1)" : "var(--chart-2)"}
        />
      ))}
    </Bar>
  </BarChart>
</ChartContainer>
```

## Line chart

```tsx
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartDataTable,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
```

```tsx
const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
} satisfies ChartConfig

<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
  <LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
    <CartesianGrid vertical={false} />
    <XAxis
      dataKey="month"
      tickLine={false}
      axisLine={false}
      tickMargin={8}
      tickFormatter={(value) => value.slice(0, 3)}
    />
    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
    <Line
      dataKey="desktop"
      type="natural"
      stroke="var(--color-desktop)"
      strokeWidth={2}
      dot={false}
    />
  </LineChart>
</ChartContainer>
<ChartDataTable data={chartData} config={chartConfig} labelKey="month" />
```

## Line chart multiple

```tsx
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
```

```tsx
<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
  <LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
    <ChartLegend content={<ChartLegendContent />} />
    <Line dataKey="desktop" type="monotone" stroke="var(--color-desktop)" strokeWidth={2} dot={false} />
    <Line dataKey="mobile" type="monotone" stroke="var(--color-mobile)" strokeWidth={2} dot={false} />
  </LineChart>
</ChartContainer>
```

## Line chart with dots

```tsx
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
```

```tsx
<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
  <LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
    <Line
      dataKey="desktop"
      type="natural"
      stroke="var(--color-desktop)"
      strokeWidth={2}
      dot={{ fill: "var(--color-desktop)" }}
      activeDot={{ r: 6 }}
    />
  </LineChart>
</ChartContainer>
```

## Line chart with custom dots

Render each point yourself with a `dot` function; per-row `fill` gives per-category dot colors.

```tsx
import { CartesianGrid, Dot, Line, LineChart, XAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
```

```tsx
interface ColoredDotProps {
  cx?: number
  cy?: number
  index?: number
  payload?: { browser: string; fill: string }
}

<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
  <LineChart accessibilityLayer data={chartData} margin={{ top: 24, left: 12, right: 12 }}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="browser" tickLine={false} axisLine={false} tickMargin={8} />
    <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="visitors" hideLabel />} />
    <Line
      dataKey="visitors"
      type="natural"
      stroke="var(--color-visitors)"
      strokeWidth={2}
      activeDot={{ r: 6 }}
      dot={({ cx, cy, payload, index }: ColoredDotProps) =>
        cx == null || cy == null ? (
          <g key={index} />
        ) : (
          <Dot key={payload?.browser ?? index} cx={cx} cy={cy} r={5} fill={payload?.fill} stroke={payload?.fill} />
        )
      }
    />
  </LineChart>
</ChartContainer>
```

## Line chart with labels

```tsx
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
```

```tsx
<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
  <LineChart accessibilityLayer data={chartData} margin={{ top: 20, left: 12, right: 12 }}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
    <Line
      dataKey="desktop"
      type="natural"
      stroke="var(--color-desktop)"
      strokeWidth={2}
      dot={{ fill: "var(--color-desktop)" }}
      activeDot={{ r: 6 }}
    >
      <LabelList position="top" offset={12} className="fill-fg-muted" fontSize={12} />
    </Line>
  </LineChart>
</ChartContainer>
```

## Line chart with custom labels

Label points with another field via `dataKey` + `formatter`; a hidden `YAxis` with a padded `domain` keeps labels inside the chart.

```tsx
import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
```

```tsx
<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
  <LineChart accessibilityLayer data={chartData} margin={{ top: 24, left: 24, right: 24 }}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
    <YAxis hide domain={["dataMin - 40", "dataMax + 40"]} />
    <ChartTooltip
      cursor={false}
      content={<ChartTooltipContent indicator="line" nameKey="desktop" hideLabel />}
    />
    <Line
      dataKey="desktop"
      type="natural"
      stroke="var(--color-desktop)"
      strokeWidth={2}
      dot={{ fill: "var(--color-desktop)" }}
      activeDot={{ r: 6 }}
    >
      <LabelList
        dataKey="month"
        position="top"
        offset={12}
        className="fill-fg"
        fontSize={12}
        formatter={(value: unknown) => (typeof value === "string" ? value.slice(0, 3) : String(value))}
      />
    </Line>
  </LineChart>
</ChartContainer>
```

## Pie chart

Long-format data: each row is a slice with its own `fill`, and `nameKey` maps slices to config entries.

```tsx
import { Pie, PieChart } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartDataTable,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
```

```tsx
const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
]

const chartConfig = {
  visitors: { label: "Visitors" },
  chrome: { label: "Chrome", color: "var(--chart-1)" },
  safari: { label: "Safari", color: "var(--chart-2)" },
  firefox: { label: "Firefox", color: "var(--chart-3)" },
} satisfies ChartConfig

<ChartContainer config={chartConfig} className="mx-auto aspect-square min-h-[250px] w-full">
  <PieChart>
    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
    <Pie data={chartData} dataKey="visitors" nameKey="browser" />
  </PieChart>
</ChartContainer>
<ChartDataTable data={chartData} config={chartConfig} labelKey="browser" />
```

## Pie chart without separators

```tsx
import { Pie, PieChart } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
```

```tsx
<ChartContainer config={chartConfig} className="mx-auto aspect-square min-h-[250px] w-full">
  <PieChart>
    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
    <Pie data={chartData} dataKey="visitors" nameKey="browser" stroke="0" paddingAngle={0} />
  </PieChart>
</ChartContainer>
```

## Pie chart with legend

`nameKey` on `ChartLegendContent` reads legend labels from the slice field.

```tsx
import { Pie, PieChart } from "recharts"

import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
```

```tsx
<ChartContainer config={chartConfig} className="mx-auto aspect-square min-h-[250px] w-full">
  <PieChart>
    <Pie data={chartData} dataKey="visitors" />
    <ChartLegend
      content={<ChartLegendContent nameKey="browser" />}
      className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
    />
  </PieChart>
</ChartContainer>
```

## Pie chart with labels

```tsx
import { Pie, PieChart } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
```

```tsx
<ChartContainer
  config={chartConfig}
  className="mx-auto aspect-square min-h-[250px] w-full [&_.recharts-pie-label-text]:fill-fg"
>
  <PieChart>
    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
    <Pie data={chartData} dataKey="visitors" label nameKey="browser" />
  </PieChart>
</ChartContainer>
```

## Pie chart with custom labels

```tsx
import { Pie, PieChart } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
```

```tsx
<ChartContainer
  config={chartConfig}
  className="mx-auto aspect-square min-h-[250px] w-full [&_.recharts-pie-label-text]:fill-fg"
>
  <PieChart>
    <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="visitors" hideLabel />} />
    <Pie
      data={chartData}
      dataKey="visitors"
      nameKey="browser"
      labelLine={false}
      label={({ payload, ...props }) => (
        <text
          cx={props.cx}
          cy={props.cy}
          x={props.x}
          y={props.y}
          textAnchor={props.textAnchor}
          dominantBaseline={props.dominantBaseline}
          fill="var(--color-fg)"
        >
          {(payload as { visitors?: number }).visitors}
        </text>
      )}
    />
  </PieChart>
</ChartContainer>
```

## Pie chart with label list

Labels drawn inside slices with `LabelList`, resolving display names from config.

```tsx
import { LabelList, Pie, PieChart } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
```

```tsx
<ChartContainer
  config={chartConfig}
  className="mx-auto aspect-square min-h-[250px] w-full [&_.recharts-pie-label-text]:fill-fg"
>
  <PieChart>
    <ChartTooltip content={<ChartTooltipContent nameKey="visitors" hideLabel />} />
    <Pie data={chartData} dataKey="visitors">
      <LabelList
        dataKey="browser"
        className="fill-fg"
        stroke="none"
        fontSize={12}
        formatter={(value: unknown) => chartConfig[value as keyof typeof chartConfig]?.label}
      />
    </Pie>
  </PieChart>
</ChartContainer>
```

## Donut chart

```tsx
import { Pie, PieChart } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
```

```tsx
<ChartContainer config={chartConfig} className="mx-auto aspect-square min-h-[250px] w-full">
  <PieChart>
    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
    <Pie data={chartData} dataKey="visitors" nameKey="browser" innerRadius={60} />
  </PieChart>
</ChartContainer>
```

## Donut chart with center text

A Recharts `Label` inside `Pie` with a `content` render function positioned at the viewBox center.

```tsx
import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
```

```tsx
const totalVisitors = React.useMemo(
  () => chartData.reduce((acc, curr) => acc + curr.visitors, 0),
  [],
)

<ChartContainer config={chartConfig} className="mx-auto aspect-square min-h-[250px] w-full">
  <PieChart>
    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
    <Pie data={chartData} dataKey="visitors" nameKey="browser" innerRadius={60} strokeWidth={5}>
      <Label
        content={({ viewBox }) => {
          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
            return (
              <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                <tspan x={viewBox.cx} y={viewBox.cy} className="fill-fg text-3xl font-bold">
                  {totalVisitors.toLocaleString()}
                </tspan>
                <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 24} className="fill-fg-muted">
                  Visitors
                </tspan>
              </text>
            )
          }
          return <text />
        }}
      />
    </Pie>
  </PieChart>
</ChartContainer>
```

## Donut chart with active slice

A custom `shape` enlarges one `Sector` to highlight it.

```tsx
import { Pie, PieChart, Sector } from "recharts"
import type { PieSectorShapeProps } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
```

```tsx
const ACTIVE_INDEX = 0

<ChartContainer config={chartConfig} className="mx-auto aspect-square min-h-[250px] w-full">
  <PieChart>
    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
    <Pie
      data={chartData}
      dataKey="visitors"
      nameKey="browser"
      innerRadius={60}
      strokeWidth={5}
      shape={({ index, outerRadius = 0, ...props }: PieSectorShapeProps) =>
        index === ACTIVE_INDEX ? (
          <Sector {...props} outerRadius={outerRadius + 10} />
        ) : (
          <Sector {...props} outerRadius={outerRadius} />
        )
      }
    />
  </PieChart>
</ChartContainer>
```

## Pie chart stacked

Two concentric `Pie`s from separate datasets; `labelFormatter` maps the hovered series key back to its config label.

```tsx
import { Pie, PieChart } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
```

```tsx
const desktopData = [
  { month: "january", desktop: 186, fill: "var(--color-january)" },
  { month: "february", desktop: 305, fill: "var(--color-february)" },
]
const mobileData = [
  { month: "january", mobile: 80, fill: "var(--color-january)" },
  { month: "february", mobile: 200, fill: "var(--color-february)" },
]

const chartConfig = {
  visitors: { label: "Visitors" },
  desktop: { label: "Desktop" },
  mobile: { label: "Mobile" },
  january: { label: "January", color: "var(--chart-1)" },
  february: { label: "February", color: "var(--chart-2)" },
} satisfies ChartConfig

<ChartContainer config={chartConfig} className="mx-auto aspect-square min-h-[250px] w-full">
  <PieChart>
    <ChartTooltip
      content={
        <ChartTooltipContent
          labelKey="visitors"
          nameKey="month"
          indicator="line"
          labelFormatter={(_, payload) => {
            const key = payload?.[0]?.dataKey as keyof typeof chartConfig | undefined
            return key ? chartConfig[key]?.label : null
          }}
        />
      }
    />
    <Pie data={desktopData} dataKey="desktop" outerRadius={60} />
    <Pie data={mobileData} dataKey="mobile" innerRadius={70} outerRadius={90} />
  </PieChart>
</ChartContainer>
```

## Radar chart

```tsx
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartDataTable,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
```

```tsx
const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
} satisfies ChartConfig

<ChartContainer config={chartConfig} className="mx-auto aspect-square min-h-[250px]">
  <RadarChart data={chartData}>
    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
    <PolarAngleAxis dataKey="month" />
    <PolarGrid />
    <Radar dataKey="desktop" fill="var(--color-desktop)" fillOpacity={0.6} />
  </RadarChart>
</ChartContainer>
<ChartDataTable data={chartData} config={chartConfig} labelKey="month" />
```

## Radar chart multiple

`ChartLegend` (or Recharts' `Legend`) with `ChartLegendContent`; `outerRadius` on the chart shrinks the plot.

```tsx
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
```

```tsx
<ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
  <RadarChart data={chartData}>
    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
    <PolarAngleAxis dataKey="month" />
    <PolarGrid />
    <Radar dataKey="desktop" fill="var(--color-desktop)" fillOpacity={0.6} />
    <Radar dataKey="mobile" fill="var(--color-mobile)" />
    <ChartLegend className="mt-8" content={<ChartLegendContent />} />
  </RadarChart>
</ChartContainer>
```

## Radar chart with dots

```tsx
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
```

```tsx
<ChartContainer config={chartConfig} className="mx-auto aspect-square min-h-[250px]">
  <RadarChart data={chartData} outerRadius={90}>
    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
    <PolarAngleAxis dataKey="month" />
    <PolarGrid />
    <Radar
      dataKey="desktop"
      fill="var(--color-desktop)"
      fillOpacity={0.6}
      dot={{ r: 4, fillOpacity: 1 }}
    />
  </RadarChart>
</ChartContainer>
```

## Radar chart lines only

```tsx
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
```

```tsx
<ChartContainer config={chartConfig} className="mx-auto aspect-square min-h-[250px]">
  <RadarChart data={chartData}>
    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
    <PolarAngleAxis dataKey="month" />
    <PolarGrid radialLines={false} />
    <Radar dataKey="desktop" fill="var(--color-desktop)" fillOpacity={0} stroke="var(--color-desktop)" strokeWidth={2} />
    <Radar dataKey="mobile" fill="var(--color-mobile)" fillOpacity={0} stroke="var(--color-mobile)" strokeWidth={2} />
  </RadarChart>
</ChartContainer>
```

## Radar chart grid variants

`PolarGrid` takes `gridType="circle"`, `radialLines={false}`, or a filled `className`; omit it entirely for no grid.

```tsx
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
```

```tsx
<ChartContainer config={chartConfig} className="mx-auto aspect-square min-h-[250px]">
  <RadarChart data={chartData}>
    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
    <PolarGrid
      className="fill-(--color-desktop) opacity-20"
      gridType="circle"
      radialLines={false}
    />
    <PolarAngleAxis dataKey="month" />
    <Radar dataKey="desktop" fill="var(--color-desktop)" fillOpacity={0.5} />
  </RadarChart>
</ChartContainer>
```

## Radar chart with custom axis labels

Render each `PolarAngleAxis` tick yourself to show the value above the category.

```tsx
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
```

```tsx
<ChartContainer config={chartConfig} className="mx-auto aspect-square min-h-[250px]">
  <RadarChart data={chartData}>
    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
    <PolarAngleAxis
      dataKey="month"
      tick={({ x, y, textAnchor, index, ...props }) => {
        const data = chartData[index]
        return (
          <text
            x={x}
            y={index === 0 ? Number(y) - 10 : y}
            textAnchor={textAnchor}
            fontSize={13}
            fontWeight={500}
            {...props}
          >
            <tspan className="fill-fg-muted">{data?.desktop}</tspan>
            <tspan className="fill-fg" x={x} dy={"1rem"}>
              {data?.month}
            </tspan>
          </text>
        )
      }}
    />
    <PolarGrid />
    <Radar dataKey="desktop" fill="var(--color-desktop)" fillOpacity={0.6} />
  </RadarChart>
</ChartContainer>
```

## Radial chart

Long-format data with per-row `fill`; `nameKey` on the tooltip resolves each bar's label.

```tsx
import { RadialBar, RadialBarChart } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartDataTable,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
```

```tsx
const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--chart-1)" },
  { browser: "safari", visitors: 200, fill: "var(--chart-2)" },
  { browser: "firefox", visitors: 187, fill: "var(--chart-3)" },
]

const chartConfig = {
  visitors: { label: "Visitors" },
  chrome: { label: "Chrome", color: "var(--chart-1)" },
  safari: { label: "Safari", color: "var(--chart-2)" },
  firefox: { label: "Firefox", color: "var(--chart-3)" },
} satisfies ChartConfig

<ChartContainer config={chartConfig} className="mx-auto aspect-square min-h-[250px] w-full">
  <RadialBarChart data={chartData} innerRadius={30} outerRadius={110}>
    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="browser" />} />
    <RadialBar dataKey="visitors" background />
  </RadialBarChart>
</ChartContainer>
<ChartDataTable data={chartData} config={chartConfig} labelKey="browser" />
```

## Radial chart with grid

```tsx
import { PolarGrid, RadialBar, RadialBarChart } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
```

```tsx
<ChartContainer config={chartConfig} className="mx-auto aspect-square min-h-[250px] w-full">
  <RadialBarChart data={chartData} innerRadius={30} outerRadius={100}>
    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="browser" />} />
    <PolarGrid gridType="circle" />
    <RadialBar dataKey="visitors" />
  </RadialBarChart>
</ChartContainer>
```

## Radial chart with labels

```tsx
import { LabelList, RadialBar, RadialBarChart } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
```

```tsx
<ChartContainer config={chartConfig} className="mx-auto aspect-square min-h-[250px] w-full">
  <RadialBarChart data={chartData} startAngle={-90} endAngle={380} innerRadius={30} outerRadius={110}>
    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="browser" />} />
    <RadialBar dataKey="visitors" background>
      <LabelList position="insideStart" dataKey="browser" className="fill-fg-muted capitalize" fontSize={11} />
    </RadialBar>
  </RadialBarChart>
</ChartContainer>
```

## Radial chart with center text

A single-value ring: a `Label` inside `PolarRadiusAxis` draws the total at the center.

```tsx
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

import { type ChartConfig, ChartContainer } from "@/components/ui/chart"
```

```tsx
const chartData = [{ browser: "safari", visitors: 1260, fill: "var(--color-safari)" }]

const chartConfig = {
  visitors: { label: "Visitors" },
  safari: { label: "Safari", color: "var(--chart-2)" },
} satisfies ChartConfig

const totalVisitors = chartData[0]?.visitors ?? 0

<ChartContainer config={chartConfig} className="mx-auto aspect-square min-h-[250px] w-full">
  <RadialBarChart data={chartData} startAngle={0} endAngle={250} innerRadius={80} outerRadius={90}>
    <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
      <Label
        content={({ viewBox }) => {
          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
            return (
              <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                <tspan x={viewBox.cx} y={viewBox.cy} className="fill-fg text-2xl font-bold">
                  {totalVisitors.toLocaleString()}
                </tspan>
                <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 24} className="fill-fg-muted">
                  Visitors
                </tspan>
              </text>
            )
          }
          return null
        }}
      />
    </PolarRadiusAxis>
    <RadialBar dataKey="visitors" background cornerRadius={10} />
  </RadialBarChart>
</ChartContainer>
```

## Radial chart with custom shape

A `PolarGrid` with fixed `polarRadius` rings, styled via `first:`/`last:` fills, behind a rounded bar.

```tsx
import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

import { ChartContainer } from "@/components/ui/chart"
```

```tsx
<ChartContainer config={chartConfig} className="mx-auto aspect-square min-h-[250px] w-full">
  <RadialBarChart data={chartData} startAngle={0} endAngle={100} innerRadius={65} outerRadius={95}>
    <PolarGrid
      gridType="circle"
      radialLines={false}
      stroke="none"
      className="first:fill-muted last:fill-popover"
      polarRadius={[86, 74]}
    />
    <RadialBar dataKey="visitors" background cornerRadius={10} />
    <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
      <Label
        content={({ viewBox }) =>
          viewBox && "cx" in viewBox && "cy" in viewBox ? (
            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
              <tspan x={viewBox.cx} y={viewBox.cy} className="fill-fg text-2xl font-bold">
                {totalVisitors.toLocaleString()}
              </tspan>
              <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 24} className="fill-fg-muted">
                Visitors
              </tspan>
            </text>
          ) : null
        }
      />
    </PolarRadiusAxis>
  </RadialBarChart>
</ChartContainer>
```

## Radial chart stacked

A half-gauge (`endAngle={180}`) with two stacked `RadialBar`s from one wide-format row.

```tsx
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
```

```tsx
const chartData = [{ month: "january", desktop: 1260, mobile: 570 }]

const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
} satisfies ChartConfig

const totalVisitors = (chartData[0]?.desktop ?? 0) + (chartData[0]?.mobile ?? 0)

<ChartContainer config={chartConfig} className="mx-auto aspect-square min-h-[250px] w-full">
  <RadialBarChart data={chartData} endAngle={180} innerRadius={80} outerRadius={110}>
    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
    <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
      <Label
        content={({ viewBox }) =>
          viewBox && "cx" in viewBox && "cy" in viewBox ? (
            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
              <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) - 16} className="fill-fg text-2xl font-bold">
                {totalVisitors.toLocaleString()}
              </tspan>
              <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 4} className="fill-fg-muted">
                Visitors
              </tspan>
            </text>
          ) : null
        }
      />
    </PolarRadiusAxis>
    <RadialBar dataKey="desktop" stackId="a" cornerRadius={5} fill="var(--color-desktop)" className="stroke-transparent stroke-2" />
    <RadialBar dataKey="mobile" stackId="a" cornerRadius={5} fill="var(--color-mobile)" className="stroke-transparent stroke-2" />
  </RadialBarChart>
</ChartContainer>
```

