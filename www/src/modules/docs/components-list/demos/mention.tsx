'use client'

import { ListBox, ListBoxItem } from '@/registry/ui/list-box'

export function MentionDemo() {
  return (
    <div className="flex w-full max-w-[13rem] flex-col gap-2">
      <div className="rounded-md border bg-bg px-3 py-2 text-sm text-fg">
        Great work{' '}
        <span className="rounded-sm bg-muted px-1 font-medium">@alex</span>
      </div>
      <ListBox aria-label="People" selectionMode="none" className="w-full">
        <ListBoxItem id="alexmiller" textValue="alexmiller">
          Alex Miller
        </ListBoxItem>
        <ListBoxItem id="amandarivera" textValue="amandarivera">
          Amanda Rivera
        </ListBoxItem>
      </ListBox>
    </div>
  )
}
