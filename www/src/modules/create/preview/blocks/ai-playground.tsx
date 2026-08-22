"use client"

import { useEffect, useState } from "react"

import {
  BotIcon,
  CheckIcon,
  ClockIcon,
  CopyIcon,
  DownloadIcon,
  LayersIcon,
  PaperclipIcon,
  RefreshCwIcon,
  RotateCwIcon,
  SaveIcon,
  ShareIcon,
  SparklesIcon,
  SquarePenIcon,
  TerminalIcon,
  UserIcon,
  ZapIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/registry/ui/alert"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import { Description, Label } from "@/registry/ui/field"
import { Group } from "@/registry/ui/group"
import { Input, TextArea } from "@/registry/ui/input"
import { Kbd } from "@/registry/ui/kbd"
import { Loader } from "@/registry/ui/loader"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSection,
  MenuSectionHeader,
} from "@/registry/ui/menu"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldIncrement,
} from "@/registry/ui/number-field"
import { Popover } from "@/registry/ui/popover"
import {
  ProgressBar,
  ProgressBarControl,
  ProgressBarOutput,
} from "@/registry/ui/progress-bar"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSection,
  SelectSectionHeader,
  SelectTrigger,
} from "@/registry/ui/select"
import { Separator } from "@/registry/ui/separator"
import { Skeleton } from "@/registry/ui/skeleton"
import { Slider, SliderControl, SliderOutput } from "@/registry/ui/slider"
import { Switch, SwitchControl } from "@/registry/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
} from "@/registry/ui/table"
import { Tab, TabList, TabPanel, Tabs } from "@/registry/ui/tabs"
import { Tag, TagGroup, TagList } from "@/registry/ui/tag-group"
import { TextField } from "@/registry/ui/text-field"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

interface Model {
  id: string
  name: string
  description: string
  context: string
  price: string
}

const DEFAULT_MODEL: Model = {
  id: "meridian-3-opus",
  name: "Meridian 3 Opus",
  description: "Deepest reasoning, slowest",
  context: "200K context",
  price: "$3.00 / M input",
}

const MODELS: Model[] = [
  DEFAULT_MODEL,
  {
    id: "meridian-3-sonnet",
    name: "Meridian 3 Sonnet",
    description: "Balanced quality and speed",
    context: "200K context",
    price: "$0.90 / M input",
  },
  {
    id: "meridian-2-haiku",
    name: "Meridian 2 Haiku",
    description: "Fastest, for high-volume calls",
    context: "128K context",
    price: "$0.20 / M input",
  },
  {
    id: "vela-70b-instruct",
    name: "Vela 70B Instruct",
    description: "Open weights, self-hosted",
    context: "32K context",
    price: "$0.35 / M input",
  },
  {
    id: "kestrel-8b",
    name: "Kestrel 8B",
    description: "Open weights, edge deployments",
    context: "16K context",
    price: "$0.06 / M input",
  },
]

const SYSTEM_PROMPT =
  "You are Meridian, a senior support engineer at Northwind Logistics. Answer in plain English, quote the shipment ID whenever you reference one, and never promise a delivery date you cannot verify against the tracking record."

const COMPLETION_PROMPT = `## Release notes — Northwind Tracking API v2.4

Shipped 12 August. The streaming endpoint now returns`

const TRANSCRIPT = [
  {
    id: "m1",
    role: "user" as const,
    author: "Dana Whitfield",
    initials: "DW",
    text: "A customer is asking why shipment NW-48210 has been sitting in Rotterdam for four days. What do I tell them?",
  },
  {
    id: "m2",
    role: "assistant" as const,
    author: "Meridian 3 Opus",
    initials: "M",
    text: "NW-48210 is held at the Rotterdam hub pending customs clearance — line 3 of the commercial invoice is missing an HS code, so the broker can't file. Nothing is wrong with the freight itself.",
  },
  {
    id: "m3",
    role: "user" as const,
    author: "Dana Whitfield",
    initials: "DW",
    text: "Draft the reply. The customer is Aleks Novak at Brightline Interiors — he's already emailed twice this week.",
  },
]

const OUTPUT_PARAGRAPHS = [
  "Hi Aleks — thanks for following up, and sorry you've had to chase this twice.",
  "Shipment NW-48210 is at our Rotterdam hub and hasn't moved since 8 August because customs can't clear it: line 3 of the commercial invoice (the brushed-oak panels) is missing an HS code, so our broker isn't able to file the entry. The freight itself is intact and in a bonded warehouse — there's no damage and no storage charge to you while it sits.",
  "To release it we need one thing from your side: the HS code for line 3, or a corrected invoice. Reply to this email with either and I'll hand it straight to the broker.",
]

const OUTPUT_STEPS = [
  "Filing typically clears within 4 business hours of the correction landing.",
  "Rotterdam → Manchester leg is 2 days once released.",
  "I'll email you the moment the entry is accepted — you won't need to check the portal.",
]

const RAW_OUTPUT = `{
  "id": "run_9f4c21ab",
  "model": "meridian-3-opus",
  "stop_reason": "end_turn",
  "usage": { "input_tokens": 412, "output_tokens": 268 },
  "content": [{ "type": "text", "text": "Hi Aleks — thanks for following up…" }]
}`

interface Run {
  id: string
  time: string
  model: string
  temperature: string
  tokens: string
  latency: string
  status: "completed" | "failed"
}

const HISTORY: Run[] = [
  {
    id: "run_9f4c21ab",
    time: "14:02:11",
    model: "Meridian 3 Opus",
    temperature: "0.42",
    tokens: "680",
    latency: "2.14s",
    status: "completed",
  },
  {
    id: "run_7d10e883",
    time: "13:58:47",
    model: "Meridian 3 Sonnet",
    temperature: "0.42",
    tokens: "612",
    latency: "0.91s",
    status: "completed",
  },
  {
    id: "run_2b88c410",
    time: "13:51:03",
    model: "Vela 70B Instruct",
    temperature: "0.90",
    tokens: "—",
    latency: "0.12s",
    status: "failed",
  },
]

function PanelSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-[10px] font-medium tracking-widest text-fg-muted uppercase">
        {title}
      </span>
      {children}
    </div>
  )
}

function Message({ message }: { message: (typeof TRANSCRIPT)[number] }) {
  const isAssistant = message.role === "assistant"
  return (
    <div className="flex gap-3">
      <Avatar size="sm" className="mt-0.5 shrink-0">
        <AvatarFallback>
          {isAssistant ? <BotIcon /> : message.initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{message.author}</span>
          {isAssistant && (
            <Badge variant="accent" appearance="subtle" size="sm">
              assistant
            </Badge>
          )}
        </div>
        <p
          className={cn(
            "text-pretty",
            isAssistant ? "text-fg" : "text-fg-muted",
          )}
        >
          {message.text}
        </p>
      </div>
    </div>
  )
}

export default function AiPlayground() {
  const [mode, setMode] = useState("chat")
  const [model, setModel] = useState("meridian-3-opus")
  const [temperature, setTemperature] = useState(0.42)
  const [maxTokens, setMaxTokens] = useState(2048)
  const [topP, setTopP] = useState(0.9)
  const [seed, setSeed] = useState(184620)
  const [system, setSystem] = useState(SYSTEM_PROMPT)
  const [stops, setStops] = useState([
    { id: "human", name: "\\n\\nHuman:" },
    { id: "end", name: "</answer>" },
  ])
  const [streaming, setStreaming] = useState(true)
  const [jsonMode, setJsonMode] = useState(false)
  const [tools, setTools] = useState(true)
  const [cachePrompt, setCachePrompt] = useState(true)
  const [outputView, setOutputView] = useState("rendered")
  const [isRunning, setRunning] = useState(false)
  const [copied, setCopied] = useState(false)

  const activeModel = MODELS.find((m) => m.id === model) ?? DEFAULT_MODEL

  useEffect(() => {
    if (!isRunning) return
    const timeout = setTimeout(() => setRunning(false), 1600)
    return () => clearTimeout(timeout)
  }, [isRunning])

  useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-20 border-b bg-bg/85 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-3 px-4 sm:px-6">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-neutral text-fg-on-neutral">
            <SparklesIcon className="size-4" />
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate font-medium">Meridian Playground</span>
            <Badge appearance="subtle" size="sm" className="hidden sm:flex">
              Beta
            </Badge>
          </div>
          <Separator orientation="vertical" className="hidden h-5 sm:block" />
          <Menu>
            <Button
              variant="quiet"
              size="sm"
              className="hidden gap-1.5 sm:flex"
            >
              <SquarePenIcon />
              Customer support reply
            </Button>
            <Popover>
              <MenuContent className="min-w-60">
                <MenuSection>
                  <MenuSectionHeader>Saved prompts</MenuSectionHeader>
                  <MenuItem>Customer support reply</MenuItem>
                  <MenuItem>Shipment delay summary</MenuItem>
                  <MenuItem>Invoice line extraction</MenuItem>
                  <MenuItem>Carrier email triage</MenuItem>
                </MenuSection>
                <Separator />
                <MenuItem>New prompt…</MenuItem>
              </MenuContent>
            </Popover>
          </Menu>
          <div className="ml-auto flex items-center gap-1.5">
            <Button
              variant="quiet"
              size="sm"
              className="hidden gap-1.5 md:flex"
            >
              <ShareIcon />
              Share
            </Button>
            <Button size="sm" className="gap-1.5">
              <SaveIcon />
              Save
            </Button>
            <Avatar size="sm" className="ml-1">
              <AvatarFallback>DW</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid items-start gap-6 lg:grid-cols-[320px_1fr] xl:grid-cols-[360px_1fr]">
          {/* Parameters — sticky alongside the editor on wide viewports. */}
          <aside className="order-2 lg:sticky lg:top-20 lg:order-1">
            <Card>
              <CardHeader className="border-b">
                <CardTitle>Parameters</CardTitle>
                <CardDescription>
                  Applied to every run in this session.
                </CardDescription>
                <CardAction>
                  <Tooltip>
                    <Button
                      variant="quiet"
                      size="sm"
                      isIconOnly
                      aria-label="Reset parameters"
                      onPress={() => {
                        setTemperature(0.42)
                        setMaxTokens(2048)
                        setTopP(0.9)
                      }}
                    >
                      <RotateCwIcon />
                    </Button>
                    <TooltipContent>Reset to defaults</TooltipContent>
                  </Tooltip>
                </CardAction>
              </CardHeader>
              <CardContent className="flex flex-col gap-6 lg:max-h-[calc(100svh-12rem)] lg:overflow-y-auto">
                <PanelSection title="Model">
                  <Select
                    className="w-full"
                    aria-label="Model"
                    value={model}
                    onChange={(key) => setModel(String(key))}
                  >
                    <SelectTrigger className="w-full" />
                    <SelectContent>
                      <SelectSection>
                        <SelectSectionHeader>Meridian</SelectSectionHeader>
                        {MODELS.filter((m) => m.id.startsWith("meridian")).map(
                          (m) => (
                            <SelectItem key={m.id} id={m.id} textValue={m.name}>
                              <div className="flex flex-col">
                                <span>{m.name}</span>
                                <span className="text-xs text-fg-muted">
                                  {m.description}
                                </span>
                              </div>
                            </SelectItem>
                          ),
                        )}
                      </SelectSection>
                      <Separator />
                      <SelectSection>
                        <SelectSectionHeader>Open weights</SelectSectionHeader>
                        {MODELS.filter((m) => !m.id.startsWith("meridian")).map(
                          (m) => (
                            <SelectItem key={m.id} id={m.id} textValue={m.name}>
                              <div className="flex flex-col">
                                <span>{m.name}</span>
                                <span className="text-xs text-fg-muted">
                                  {m.description}
                                </span>
                              </div>
                            </SelectItem>
                          ),
                        )}
                      </SelectSection>
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge appearance="subtle" size="lg">
                      {activeModel.context}
                    </Badge>
                    <Badge appearance="subtle" size="lg">
                      {activeModel.price}
                    </Badge>
                  </div>
                </PanelSection>

                <Separator />

                <PanelSection title="Sampling">
                  <Slider
                    minValue={0}
                    maxValue={1}
                    step={0.01}
                    value={temperature}
                    onChange={(value) => setTemperature(value as number)}
                  >
                    <div className="flex items-baseline justify-between">
                      <Label>Temperature</Label>
                      <SliderOutput className="font-mono text-xs tabular-nums">
                        {temperature.toFixed(2)}
                      </SliderOutput>
                    </div>
                    <SliderControl />
                  </Slider>

                  <Slider
                    minValue={256}
                    maxValue={8192}
                    step={128}
                    value={maxTokens}
                    onChange={(value) => setMaxTokens(value as number)}
                  >
                    <div className="flex items-baseline justify-between">
                      <Label>Max tokens</Label>
                      <SliderOutput className="font-mono text-xs tabular-nums">
                        {maxTokens.toLocaleString("en-US")}
                      </SliderOutput>
                    </div>
                    <SliderControl />
                  </Slider>

                  <Slider
                    minValue={0}
                    maxValue={1}
                    step={0.01}
                    value={topP}
                    onChange={(value) => setTopP(value as number)}
                  >
                    <div className="flex items-baseline justify-between">
                      <Label>Top P</Label>
                      <SliderOutput className="font-mono text-xs tabular-nums">
                        {topP.toFixed(2)}
                      </SliderOutput>
                    </div>
                    <SliderControl />
                  </Slider>

                  <NumberField
                    value={seed}
                    onChange={setSeed}
                    minValue={0}
                    formatOptions={{ useGrouping: false }}
                  >
                    <Label>Seed</Label>
                    <Group>
                      <NumberFieldDecrement />
                      <Input />
                      <NumberFieldIncrement />
                    </Group>
                    <Description>
                      Fixed seeds make runs reproducible.
                    </Description>
                  </NumberField>
                </PanelSection>

                <Separator />

                <PanelSection title="System prompt">
                  <TextField
                    className="w-full"
                    value={system}
                    onChange={setSystem}
                  >
                    <Label className="sr-only">System prompt</Label>
                    <TextArea
                      rows={5}
                      placeholder="Describe how the model should behave."
                    />
                    <Description>
                      {system.length} characters · counted against context.
                    </Description>
                  </TextField>

                  <TagGroup
                    onRemove={(keys) =>
                      setStops((prev) => prev.filter((s) => !keys.has(s.id)))
                    }
                  >
                    <Label>Stop sequences</Label>
                    <TagList
                      items={stops}
                      renderEmptyState={() => (
                        <span className="text-sm text-fg-muted">
                          No stop sequences.
                        </span>
                      )}
                    >
                      {(item) => <Tag>{item.name}</Tag>}
                    </TagList>
                  </TagGroup>
                </PanelSection>

                <Separator />

                <PanelSection title="Behaviour">
                  <Switch
                    isSelected={streaming}
                    onChange={setStreaming}
                    className="w-full justify-between"
                  >
                    <Label>Stream tokens</Label>
                    <SwitchControl />
                  </Switch>
                  <Switch
                    isSelected={jsonMode}
                    onChange={setJsonMode}
                    className="w-full justify-between"
                  >
                    <Label>JSON mode</Label>
                    <SwitchControl />
                  </Switch>
                  <Switch
                    isSelected={tools}
                    onChange={setTools}
                    className="w-full justify-between"
                  >
                    <Label>Tool use</Label>
                    <SwitchControl />
                  </Switch>
                  <Switch
                    isSelected={cachePrompt}
                    onChange={setCachePrompt}
                    className="w-full justify-between"
                  >
                    <Label>Cache system prompt</Label>
                    <SwitchControl />
                  </Switch>
                </PanelSection>

                <Separator />

                <ProgressBar value={31} aria-label="Context used">
                  <div className="flex items-baseline justify-between">
                    <Label>Context used</Label>
                    <ProgressBarOutput className="font-mono text-xs tabular-nums" />
                  </div>
                  <ProgressBarControl />
                  <Description>
                    62,400 of 200,000 tokens in this session.
                  </Description>
                </ProgressBar>

                {jsonMode && (
                  <Alert variant="warning">
                    <AlertTitle>JSON mode is on</AlertTitle>
                    <AlertDescription>
                      Stop sequences are ignored while the model is forced to
                      emit valid JSON.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </aside>

          {/* Editor + output. */}
          <div className="order-1 flex min-w-0 flex-col gap-6 lg:order-2">
            <Card>
              <CardHeader className="border-b">
                <CardTitle>Prompt</CardTitle>
                <CardDescription>
                  Ticket #4821 · Brightline Interiors
                </CardDescription>
                <CardAction>
                  <Badge appearance="subtle" size="lg">
                    412 input tokens
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Tabs
                  selectedKey={mode}
                  onSelectionChange={(key) => setMode(String(key))}
                >
                  <TabList variant="line" aria-label="Playground mode">
                    <Tab id="chat">Chat</Tab>
                    <Tab id="complete">Complete</Tab>
                  </TabList>

                  <TabPanel id="chat" className="flex flex-col gap-4 pt-4">
                    <div className="flex items-center gap-2 rounded-lg border border-dashed px-3 py-2 text-fg-muted">
                      <TerminalIcon className="size-4 shrink-0" />
                      <span className="min-w-0 truncate text-sm">
                        System · {system}
                      </span>
                    </div>
                    <div className="flex flex-col gap-5">
                      {TRANSCRIPT.map((message) => (
                        <Message key={message.id} message={message} />
                      ))}
                    </div>
                    <TextField
                      className="w-full"
                      aria-label="Message"
                      defaultValue="Keep it under 150 words and don't apologise twice."
                    >
                      <TextArea
                        rows={3}
                        placeholder="Ask a follow-up, or paste the customer's message…"
                      />
                    </TextField>
                  </TabPanel>

                  <TabPanel id="complete" className="flex flex-col gap-4 pt-4">
                    <TextField
                      className="w-full"
                      aria-label="Completion prompt"
                      defaultValue={COMPLETION_PROMPT}
                    >
                      <TextArea
                        rows={10}
                        className="font-mono text-sm"
                        placeholder="Start the text you want the model to continue…"
                      />
                      <Description>
                        The model continues from the caret — no chat roles are
                        applied.
                      </Description>
                    </TextField>
                  </TabPanel>
                </Tabs>
              </CardContent>
              <CardFooter className="flex-wrap justify-between gap-3 border-t">
                <div className="flex items-center gap-1">
                  <Tooltip>
                    <Button
                      variant="quiet"
                      size="sm"
                      isIconOnly
                      aria-label="Attach a file"
                    >
                      <PaperclipIcon />
                    </Button>
                    <TooltipContent>Attach a file</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <Button
                      variant="quiet"
                      size="sm"
                      isIconOnly
                      aria-label="Insert a variable"
                    >
                      <LayersIcon />
                    </Button>
                    <TooltipContent>Insert a variable</TooltipContent>
                  </Tooltip>
                  <span className="ml-1 hidden text-sm text-fg-muted sm:inline">
                    {mode === "chat" ? "3 turns" : "1 completion"} ·{" "}
                    {activeModel.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="quiet" size="sm">
                    Clear
                  </Button>
                  {isRunning ? (
                    <Button
                      variant="secondary"
                      className="gap-1.5"
                      onPress={() => setRunning(false)}
                    >
                      <Loader />
                      Stop
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      className="gap-1.5"
                      onPress={() => setRunning(true)}
                    >
                      <ZapIcon />
                      Run
                      <Kbd className="ml-1">⌘↵</Kbd>
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="border-b">
                <CardTitle>Output</CardTitle>
                <CardDescription>
                  {activeModel.name} · temperature {temperature.toFixed(2)} ·
                  seed {seed}
                </CardDescription>
                <CardAction>
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <Button
                        variant="quiet"
                        size="sm"
                        isIconOnly
                        aria-label="Regenerate"
                        onPress={() => setRunning(true)}
                      >
                        <RefreshCwIcon />
                      </Button>
                      <TooltipContent>
                        <div className="flex items-center gap-2">
                          Regenerate <Kbd>⌘R</Kbd>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <Button
                        variant="quiet"
                        size="sm"
                        isIconOnly
                        aria-label="Copy output"
                        onPress={() => setCopied(true)}
                      >
                        {copied ? <CheckIcon /> : <CopyIcon />}
                      </Button>
                      <TooltipContent>
                        {copied ? "Copied" : "Copy output"}
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <Button
                        variant="quiet"
                        size="sm"
                        isIconOnly
                        aria-label="Download output"
                      >
                        <DownloadIcon />
                      </Button>
                      <TooltipContent>Download as .md</TooltipContent>
                    </Tooltip>
                  </div>
                </CardAction>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <SegmentedControl
                    aria-label="Output format"
                    selectedKeys={[outputView]}
                    onSelectionChange={(keys) => {
                      const next = [...keys][0]
                      if (next != null) setOutputView(String(next))
                    }}
                  >
                    <SegmentedControlItem id="rendered">
                      Rendered
                    </SegmentedControlItem>
                    <SegmentedControlItem id="raw">Raw</SegmentedControlItem>
                  </SegmentedControl>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="success" appearance="subtle" size="lg">
                      end_turn
                    </Badge>
                    {streaming && (
                      <Badge appearance="subtle" size="lg">
                        streamed
                      </Badge>
                    )}
                  </div>
                </div>

                {isRunning ? (
                  <div className="flex flex-col gap-3 py-1">
                    <Skeleton className="h-3 w-4/5" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-11/12" />
                    <Skeleton className="h-3 w-2/3" />
                    <div className="flex items-center gap-2 pt-1 text-fg-muted">
                      <Loader className="size-4" />
                      <span className="text-sm">
                        Generating with {activeModel.name}…
                      </span>
                    </div>
                  </div>
                ) : outputView === "raw" ? (
                  <div className="overflow-x-auto rounded-lg border bg-muted p-4">
                    <pre className="font-mono text-xs whitespace-pre">
                      {RAW_OUTPUT}
                    </pre>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 text-pretty">
                    {OUTPUT_PARAGRAPHS.map((paragraph) => (
                      <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                    ))}
                    <ul className="flex flex-col gap-1.5 pl-4 text-fg-muted">
                      {OUTPUT_STEPS.map((step) => (
                        <li key={step.slice(0, 24)} className="list-disc">
                          {step}
                        </li>
                      ))}
                    </ul>
                    <p>Best, Dana — Northwind Logistics support</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex-wrap gap-x-5 gap-y-2 border-t text-sm text-fg-muted">
                <span className="flex items-center gap-1.5">
                  <ClockIcon className="size-3.5" />
                  2.14s
                </span>
                <span className="flex items-center gap-1.5">
                  <BotIcon className="size-3.5" />
                  412 in · 268 out
                </span>
                <span className="flex items-center gap-1.5">
                  <UserIcon className="size-3.5" />
                  dana@northwind.co
                </span>
                <span className="ml-auto font-mono tabular-nums">$0.0091</span>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent runs</CardTitle>
                <CardDescription>
                  Last 3 runs in this workspace.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TableContainer>
                  <Table aria-label="Recent runs">
                    <TableHeader>
                      <TableColumn isRowHeader>Run</TableColumn>
                      <TableColumn>Model</TableColumn>
                      <TableColumn>Temp</TableColumn>
                      <TableColumn>Tokens</TableColumn>
                      <TableColumn>Latency</TableColumn>
                      <TableColumn>Status</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {HISTORY.map((run) => (
                        <TableRow key={run.id}>
                          <TableCell>
                            <span className="font-mono text-xs">{run.id}</span>
                            <span className="block text-xs text-fg-muted">
                              {run.time}
                            </span>
                          </TableCell>
                          <TableCell>{run.model}</TableCell>
                          <TableCell className="font-mono tabular-nums">
                            {run.temperature}
                          </TableCell>
                          <TableCell className="font-mono tabular-nums">
                            {run.tokens}
                          </TableCell>
                          <TableCell className="font-mono tabular-nums">
                            {run.latency}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                run.status === "completed"
                                  ? "success"
                                  : "danger"
                              }
                              appearance="subtle"
                            >
                              {run.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
