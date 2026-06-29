import { Bell, LayoutGrid } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { Input } from '@/registry/ui/input'
import { SearchField } from '@/registry/ui/search-field'

export default function Demo() {
  return (
    <div className="flex w-full max-w-xs items-center gap-3 rounded-lg border bg-bg px-3 py-2">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-fg-on-primary">
        <LayoutGrid className="size-4" />
      </div>
      <SearchField aria-label="Search the app" className="flex-1">
        <Input placeholder="Search…" size="sm" />
      </SearchField>
      <Button variant="quiet" size="sm" isIconOnly aria-label="Notifications">
        <Bell />
      </Button>
    </div>
  )
}
