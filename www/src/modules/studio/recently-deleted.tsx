"use client"

/* The picker's Recently deleted pane: systems deleted in the last 30 days,
   each restorable or deletable for good (after a confirm). */

import { useState } from "react"
import { ChevronLeftIcon, RotateCcwIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/registry/ui/button"

import { purge, recover } from "./history"
import { ago } from "./time"
import { swatchOf, useTrash } from "./workspace"
import type { Deleted } from "./workspace"

export function RecentlyDeleted({ onBack }: { onBack: () => void }) {
  const items = [...useTrash()].reverse()
  const now = Date.now()
  return (
    <div className="flex min-h-0 flex-col">
      <div className="flex items-center gap-1 border-b border-fg/6 p-1.5">
        <Button
          variant="quiet"
          size="sm"
          isIconOnly
          aria-label="Back"
          autoFocus
          className="pointer-coarse:size-11!"
          onPress={onBack}
        >
          <ChevronLeftIcon />
        </Button>
        <h2 className="text-sm font-medium">Recently deleted</h2>
      </div>
      {items.length === 0 ? (
        <p className="py-6 text-center text-sm text-fg-muted">
          Nothing deleted in the last 30 days
        </p>
      ) : (
        <ul
          aria-label="Recently deleted"
          className="no-scrollbar min-h-0 overflow-y-auto p-1"
          style={{ maxHeight: 320 }}
        >
          {items.map((item) => (
            <DeletedRow key={item.doc.id} item={item} now={now} />
          ))}
        </ul>
      )}
    </div>
  )
}

function DeletedRow({ item, now }: { item: Deleted; now: number }) {
  const { doc } = item
  const [confirming, setConfirming] = useState(false)
  const when = ago(item.deletedAt, now)
  return (
    <li className="flex min-h-10 items-center gap-2 rounded-md py-1 pr-1 pl-2 text-sm">
      {confirming ? (
        // The question gets the row's width, so the name fits.
        <span className="flex min-w-0 flex-1 flex-col gap-1.5 py-1">
          <span className="flex min-w-0 whitespace-nowrap">
            Delete "
            <span dir="auto" className="truncate">
              {doc.name}
            </span>
            " forever?
          </span>
          <span className="flex justify-end gap-2">
            <Button
              size="sm"
              aria-label={`Cancel deleting ${doc.name}`}
              onPress={() => setConfirming(false)}
              className="pointer-coarse:h-11"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              autoFocus
              aria-label={`Delete ${doc.name} forever`}
              onPress={() => purge(doc.id)}
              className="pointer-coarse:h-11"
            >
              Delete
            </Button>
          </span>
        </span>
      ) : (
        <>
          <span
            aria-hidden
            className="size-2.5 shrink-0 rounded-full ring-1 ring-fg/10 ring-inset"
            style={{ background: swatchOf(doc) }}
          />
          <span className="flex min-w-0 flex-1 flex-col">
            <span dir="auto" className="truncate">
              {doc.name}
            </span>
            <span className="text-xs text-fg-muted">
              Deleted {when.charAt(0).toLowerCase() + when.slice(1)}
            </span>
          </span>
          <Button
            variant="quiet"
            size="sm"
            isIconOnly
            aria-label={`Restore ${doc.name}`}
            className="text-fg-muted pointer-coarse:size-11!"
            onPress={() => recover(doc.id)}
          >
            <RotateCcwIcon />
          </Button>
          <Button
            variant="quiet"
            size="sm"
            isIconOnly
            aria-label={`Delete ${doc.name} forever`}
            className="text-fg-muted pointer-coarse:size-11!"
            onPress={() => setConfirming(true)}
          >
            <Trash2Icon />
          </Button>
        </>
      )}
    </li>
  )
}
