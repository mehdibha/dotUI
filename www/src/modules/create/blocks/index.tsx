'use client'

import { getRouteApi } from '@tanstack/react-router'
import {
  ChevronDownIcon,
  LayoutTemplateIcon,
  PlusIcon,
  Trash2Icon,
} from 'lucide-react'

import { registryBlocks } from '@/registry/blocks/registry'
import type { BlockCategory, BlockRegistryItem } from '@/registry/types'
import { Button } from '@/registry/ui/button'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'
import { Select, SelectValue } from '@/registry/ui/select'

import { useDesignSystem } from '../preset'

const routeApi = getRouteApi('/_app/create')

/** Preview slug for a block — matches its `group-examples/block-<slot>.tsx` file. */
export const blockPreviewSlug = (slot: string) => `block-${slot}`

const CATEGORY_ORDER: BlockCategory[] = ['layout', 'page', 'section']
const CATEGORY_LABELS: Record<BlockCategory, string> = {
  layout: 'Layouts',
  page: 'Pages',
  section: 'Sections',
}

function titleCase(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

/** Home-card preview: how many blocks the user has added. */
export function BlocksSummary() {
  const { designSystem } = useDesignSystem()
  const count = designSystem.includedBlocks?.length ?? 0
  return (
    <div className="-mt-1 flex items-center justify-between">
      <div className="flex flex-col items-start gap-1">
        <span className="text-[10px] tracking-widest text-fg-muted uppercase">
          {count > 0 ? 'Added' : 'Starters'}
        </span>
        <p className="font-medium">
          {count > 0 ? `${count} block${count > 1 ? 's' : ''}` : 'None yet'}
        </p>
      </div>
      <LayoutTemplateIcon className="size-7 text-fg-muted" />
    </div>
  )
}

export function BlocksConfig() {
  const { designSystem, addBlock, removeBlock, setBlockVariant } =
    useDesignSystem()
  const navigate = routeApi.useNavigate()

  const included = designSystem.includedBlocks ?? []
  const showPreview = (slot: string) =>
    navigate({
      search: (prev) => ({ ...prev, preview: blockPreviewSlug(slot) }),
      replace: true,
    })

  const includedMetas = included
    .map((slot) => registryBlocks.find((b) => b.name === slot))
    .filter((b): b is BlockRegistryItem => Boolean(b))
  const available = registryBlocks.filter((b) => !included.includes(b.name))

  if (registryBlocks.length === 0) {
    return <p className="text-sm text-fg-muted">No blocks available yet.</p>
  }

  return (
    <div className="flex flex-col gap-5">
      {includedMetas.length > 0 && (
        <section className="flex flex-col gap-2">
          <div
            data-label
            className="text-[10px] tracking-widest text-fg-muted uppercase"
          >
            Your blocks
          </div>
          <div className="flex flex-col gap-2">
            {includedMetas.map((meta) => (
              <SlotCard
                key={meta.name}
                meta={meta}
                variant={
                  designSystem.componentParams[meta.name]?.variant ??
                  meta.params.variant.default
                }
                onVariantChange={(v) => {
                  setBlockVariant(meta.name, v)
                  showPreview(meta.name)
                }}
                onPreview={() => showPreview(meta.name)}
                onRemove={() => removeBlock(meta.name)}
              />
            ))}
          </div>
        </section>
      )}

      {available.length > 0 && (
        <section className="flex flex-col gap-3">
          <div
            data-label
            className="text-[10px] tracking-widest text-fg-muted uppercase"
          >
            {includedMetas.length > 0 ? 'Add more' : 'Add a block'}
          </div>
          {CATEGORY_ORDER.map((cat) => {
            const items = available.filter((b) => b.category === cat)
            if (items.length === 0) return null
            return (
              <div key={cat} className="flex flex-col gap-2">
                <div className="px-1 text-xs text-fg-muted">
                  {CATEGORY_LABELS[cat]}
                </div>
                {items.map((meta) => (
                  <AddBlockRow
                    key={meta.name}
                    meta={meta}
                    onAdd={() => {
                      addBlock(meta.name, meta.params.variant.default)
                      showPreview(meta.name)
                    }}
                  />
                ))}
              </div>
            )
          })}
        </section>
      )}
    </div>
  )
}

interface SlotCardProps {
  meta: BlockRegistryItem
  variant: string
  onVariantChange: (variant: string) => void
  onPreview: () => void
  onRemove: () => void
}

function SlotCard({
  meta,
  variant,
  onVariantChange,
  onPreview,
  onRemove,
}: SlotCardProps) {
  const labels = meta.display.variantLabels ?? {}
  return (
    <div className="flex flex-col gap-2 rounded-lg border p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{meta.display.title}</span>
        <Button
          variant="quiet"
          size="sm"
          isIconOnly
          aria-label={`Remove ${meta.display.title}`}
          onPress={onRemove}
        >
          <Trash2Icon />
        </Button>
      </div>
      <Select
        aria-label={`${meta.display.title} variant`}
        selectedKey={variant}
        onSelectionChange={(key) => onVariantChange(key as string)}
        onOpenChange={(open) => {
          if (open) onPreview()
        }}
      >
        <Button size="sm" className="w-full">
          <SelectValue />
          <ChevronDownIcon data-icon-end="" />
        </Button>
        <Popover>
          <ListBox>
            {meta.params.variant.values.map((value) => (
              <ListBoxItem key={value} id={value}>
                {labels[value] ?? titleCase(value)}
              </ListBoxItem>
            ))}
          </ListBox>
        </Popover>
      </Select>
    </div>
  )
}

function AddBlockRow({
  meta,
  onAdd,
}: {
  meta: BlockRegistryItem
  onAdd: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border p-3">
      <div className="flex min-w-0 flex-col">
        <span className="text-sm font-medium">{meta.display.title}</span>
        <span className="truncate text-xs text-fg-muted">
          {meta.display.description}
        </span>
      </div>
      <Button
        size="sm"
        isIconOnly
        aria-label={`Add ${meta.display.title}`}
        onPress={onAdd}
      >
        <PlusIcon />
      </Button>
    </div>
  )
}
