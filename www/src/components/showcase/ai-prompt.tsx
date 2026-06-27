'use client'

import React from 'react'
import {
  AudioLinesIcon,
  BlocksIcon,
  BoxesIcon,
  CameraIcon,
  CheckIcon,
  ChevronDownIcon,
  FolderIcon,
  GitBranchIcon,
  GlobeIcon,
  HandIcon,
  InfoIcon,
  MicIcon,
  PaperclipIcon,
  PlugIcon,
  PlusIcon,
  TelescopeIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import type { Selection } from 'react-aria-components'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { Dialog, DialogContent } from '@/registry/ui/dialog'
import { Label } from '@/registry/ui/field'
import { TextArea } from '@/registry/ui/input'
import { Kbd } from '@/registry/ui/kbd'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSection,
  MenuSectionHeader,
  MenuSub,
} from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'
import { Separator } from '@/registry/ui/separator'
import { Switch, SwitchControl } from '@/registry/ui/switch'
import { TextField } from '@/registry/ui/text-field'

// Models offered by the model picker. The first four fill the menu; `legacy`
// ones live behind the "More models" submenu. `name` is what the toolbar shows.
type ModelOption = {
  id: string
  name: string
  description: string
  disabled?: boolean
  legacy?: boolean
}

const MODELS: ModelOption[] = [
  {
    id: 'fable',
    name: 'Fable 5',
    description: 'For your toughest challenges',
    disabled: true,
  },
  { id: 'opus', name: 'Opus 4.8', description: 'For complex tasks' },
  {
    id: 'sonnet',
    name: 'Sonnet 4.6',
    description: 'Most efficient for everyday tasks',
  },
  { id: 'haiku', name: 'Haiku 4.5', description: 'Fastest for quick answers' },
  {
    id: 'opus-4-6',
    name: 'Opus 4.6',
    description: 'Previous generation',
    legacy: true,
  },
  {
    id: 'sonnet-4-4',
    name: 'Sonnet 4.4',
    description: 'Previous generation',
    legacy: true,
  },
]

const EFFORTS = [
  { id: 'high', name: 'High' },
  { id: 'medium', name: 'Medium' },
  { id: 'low', name: 'Low' },
] as const

const DEVICES = [
  { id: 'macbook', name: 'MacBook Pro Microphone (Built-in)' },
  { id: 'iphone', name: "mehdibha's iPhone Microphone" },
  { id: 'airpods-default', name: 'Default - AirPods' },
  { id: 'airpods', name: 'AirPods' },
] as const

// The showcase's lead card: an AI prompt composer — a text input with a toolbar
// for attachment, a model + effort picker (Opus 4.8 / High), dictation and voice.
// Unlike the other showcase cards it isn't wrapped in <Card>; the bordered
// composer *is* the surface — a short, wide banner across the top of the grid's
// main region. Every visual goes through design-system tokens (--card-radius,
// bg-card, text-fg-muted…) so it re-themes live with the rest of the grid, and
// every toolbar action is a live, themed overlay — the "+" tools menu, the model
// and effort pickers, and the microphone popover — so the card doubles as a
// playground for the menu, popover, list-box and switch primitives.
export function AiPrompt({ className, ...props }: React.ComponentProps<'div'>) {
  const [model, setModel] = React.useState('opus')
  const [effort, setEffort] = React.useState<string>('high')
  const [webSearch, setWebSearch] = React.useState(true)
  const [device, setDevice] = React.useState('macbook')
  const [holdToRecord, setHoldToRecord] = React.useState(true)
  const [voiceMode, setVoiceMode] = React.useState(false)

  const modelName = MODELS.find((m) => m.id === model)?.name ?? 'Opus 4.8'
  const effortName = EFFORTS.find((e) => e.id === effort)?.name ?? 'High'

  return (
    <div
      className={cn(
        'flex flex-col rounded-(--card-radius) border bg-card p-2 shadow-sm',
        className,
      )}
      {...props}
    >
      <TextField aria-label="Prompt" className="flex w-full flex-1 flex-col">
        <TextArea
          placeholder="How can I help you today?"
          rows={2}
          className="min-h-14 flex-1 resize-none border-0 bg-transparent px-2 pt-2 text-base shadow-none focus:border-0 focus:ring-0"
        />
      </TextField>
      <div className="flex items-center justify-between gap-2 pt-1">
        {/* "+" — files, screenshots, projects, skills, connectors, web search. */}
        <Menu>
          <Button
            variant="quiet"
            size="sm"
            isIconOnly
            aria-label="Add files and tools"
            className="rounded-full"
          >
            <PlusIcon />
          </Button>
          <Popover>
            <MenuContent className="min-w-60">
              <MenuItem textValue="Add files or photos">
                <PaperclipIcon />
                Add files or photos
                <Kbd>⌘U</Kbd>
              </MenuItem>
              <MenuItem textValue="Take a screenshot">
                <CameraIcon />
                Take a screenshot
              </MenuItem>
              <MenuSub>
                <MenuItem textValue="Add to project">
                  <FolderIcon />
                  Add to project
                </MenuItem>
                <Popover>
                  <MenuContent>
                    <MenuItem>Design system</MenuItem>
                    <MenuItem>Marketing site</MenuItem>
                    <MenuItem>Mobile app</MenuItem>
                    <Separator />
                    <MenuItem>New project…</MenuItem>
                  </MenuContent>
                </Popover>
              </MenuSub>
              <MenuItem textValue="Add from GitHub">
                <GitBranchIcon />
                Add from GitHub
              </MenuItem>
              <Separator />
              <MenuSub>
                <MenuItem textValue="Skills">
                  <BlocksIcon />
                  Skills
                </MenuItem>
                <Popover>
                  <MenuContent>
                    <MenuItem>Code review</MenuItem>
                    <MenuItem>Deep research</MenuItem>
                    <MenuItem>Slide generator</MenuItem>
                  </MenuContent>
                </Popover>
              </MenuSub>
              <MenuSub>
                <MenuItem textValue="Connectors" className="pr-7">
                  <BoxesIcon />
                  Connectors
                  <span className="ml-auto flex items-center gap-1 text-fg-muted">
                    <TriangleAlertIcon className="size-3.5 text-warning" />1
                  </span>
                </MenuItem>
                <Popover>
                  <MenuContent>
                    <MenuItem>Google Drive</MenuItem>
                    <MenuItem>Linear</MenuItem>
                    <MenuItem>Notion</MenuItem>
                    <Separator />
                    <MenuItem>Manage connectors…</MenuItem>
                  </MenuContent>
                </Popover>
              </MenuSub>
              <MenuItem textValue="Add plugins">
                <PlugIcon />
                Add plugins…
              </MenuItem>
              <Separator />
              <MenuItem textValue="Research">
                <TelescopeIcon />
                Research
              </MenuItem>
              <MenuItem
                textValue="Web search"
                className="pr-7"
                onAction={() => setWebSearch((v) => !v)}
              >
                <GlobeIcon />
                Web search
                {webSearch && <CheckIcon className="ml-auto text-fg-accent" />}
              </MenuItem>
            </MenuContent>
          </Popover>
        </Menu>

        {/* Right side: the tool cluster and the voice-mode Stop pill both stay
            mounted and cross-fade (opacity + scale) so toggling voice mode is a
            smooth swap, not a hard cut. The pill is absolutely overlaid on the
            cluster's right edge, so the row's width never reflows mid-transition;
            `inert` pulls whichever side is hidden out of focus order and the a11y
            tree. */}
        <div className="relative flex items-center">
          <div
            inert={voiceMode || undefined}
            className={cn(
              'flex items-center gap-0.5 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none',
              voiceMode && 'scale-95 opacity-0',
            )}
          >
            {/* Model + effort — one menu, two labelled sections. */}
            <Menu>
              <Button variant="quiet" size="sm" className="gap-1.5 font-normal">
                {modelName}
                <span className="text-fg-muted">{effortName}</span>
                <ChevronDownIcon className="text-fg-muted" />
              </Button>
              <Popover>
                <MenuContent className="min-w-64">
                  <MenuSection>
                    <MenuSectionHeader>Model</MenuSectionHeader>
                    {MODELS.filter((m) => !m.legacy).map((m) => (
                      <MenuItem
                        key={m.id}
                        textValue={m.name}
                        isDisabled={m.disabled}
                        onAction={() => setModel(m.id)}
                      >
                        <div className="flex flex-1 flex-col">
                          <span className="flex items-center gap-1.5">
                            {m.name}
                            {m.disabled && (
                              <span className="flex items-center gap-1 text-xs text-fg-muted">
                                <InfoIcon className="size-3" />
                                Currently unavailable
                              </span>
                            )}
                          </span>
                          <span className="text-xs text-fg-muted">
                            {m.description}
                          </span>
                        </div>
                        {model === m.id && (
                          <CheckIcon className="text-fg-accent" />
                        )}
                      </MenuItem>
                    ))}
                  </MenuSection>
                  <MenuSub>
                    <MenuItem textValue="More models">More models</MenuItem>
                    <Popover>
                      <MenuContent className="min-w-48">
                        {MODELS.filter((m) => m.legacy).map((m) => (
                          <MenuItem
                            key={m.id}
                            textValue={m.name}
                            onAction={() => setModel(m.id)}
                          >
                            {m.name}
                            {model === m.id && (
                              <CheckIcon className="ml-auto text-fg-accent" />
                            )}
                          </MenuItem>
                        ))}
                      </MenuContent>
                    </Popover>
                  </MenuSub>
                  <Separator />
                  <MenuSection>
                    <MenuSectionHeader>Effort</MenuSectionHeader>
                    {EFFORTS.map((e) => (
                      <MenuItem
                        key={e.id}
                        textValue={e.name}
                        onAction={() => setEffort(e.id)}
                      >
                        {e.name}
                        {effort === e.id && (
                          <CheckIcon className="ml-auto text-fg-accent" />
                        )}
                      </MenuItem>
                    ))}
                  </MenuSection>
                </MenuContent>
              </Popover>
            </Menu>

            {/* Dictation — opens the microphone popover (device + hold-to-record). */}
            <Dialog>
              <Button
                variant="quiet"
                size="sm"
                isIconOnly
                aria-label="Microphone settings"
                className="rounded-full"
              >
                <MicIcon />
              </Button>
              <Popover className="w-72">
                <DialogContent className="gap-1.5 p-1.5">
                  <div className="flex items-center gap-2 px-2 pt-1.5">
                    <MicIcon className="size-4 shrink-0 text-fg-muted" />
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                      <div className="h-full w-1/5 rounded-full bg-accent" />
                    </div>
                  </div>
                  <ListBox
                    aria-label="Microphone"
                    selectionMode="single"
                    disallowEmptySelection
                    selectedKeys={[device]}
                    onSelectionChange={(keys: Selection) => {
                      if (keys === 'all') return
                      const next = [...keys][0]
                      if (next != null) setDevice(String(next))
                    }}
                    className="max-h-none border-0 bg-transparent p-0 shadow-none"
                  >
                    {DEVICES.map((d) => (
                      <ListBoxItem key={d.id} id={d.id} textValue={d.name}>
                        {d.name}
                      </ListBoxItem>
                    ))}
                  </ListBox>
                  <Separator />
                  <Switch
                    isSelected={holdToRecord}
                    onChange={setHoldToRecord}
                    className="w-full justify-between gap-2 rounded-sm px-2 py-1.5"
                  >
                    <Label className="flex items-center gap-2 font-normal text-fg">
                      <HandIcon className="size-4 text-fg-muted" />
                      Hold to record
                    </Label>
                    <SwitchControl />
                  </Switch>
                </DialogContent>
              </Popover>
            </Dialog>

            <Button
              variant="quiet"
              size="sm"
              isIconOnly
              aria-label="Voice mode"
              className="rounded-full"
              onPress={() => setVoiceMode(true)}
            >
              <AudioLinesIcon />
            </Button>
          </div>

          {/* Voice mode active — Stop pill, overlaid on the cluster's right edge. */}
          <div
            inert={!voiceMode || undefined}
            className={cn(
              'absolute inset-y-0 right-0 flex items-center transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none',
              voiceMode ? 'opacity-100' : 'scale-95 opacity-0',
            )}
          >
            <Button
              variant="primary"
              size="sm"
              className="gap-1.5"
              onPress={() => setVoiceMode(false)}
            >
              <AudioLinesIcon />
              Stop
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
