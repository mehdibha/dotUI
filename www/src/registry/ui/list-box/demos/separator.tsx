import { FileIcon, PrinterIcon, SaveIcon, SettingsIcon } from 'lucide-react'

import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Separator } from '@/registry/ui/separator'

export default function Demo() {
  return (
    <div className="rounded-md border bg-card shadow-sm">
      <ListBox aria-label="File">
        <ListBoxItem id="new" textValue="New file">
          <FileIcon />
          New file
        </ListBoxItem>
        <ListBoxItem id="open" textValue="Open">
          <FileIcon />
          Open…
        </ListBoxItem>
        <Separator />
        <ListBoxItem id="save" textValue="Save">
          <SaveIcon />
          Save
        </ListBoxItem>
        <ListBoxItem id="save-as" textValue="Save as">
          <SaveIcon />
          Save as…
        </ListBoxItem>
        <Separator />
        <ListBoxItem id="print" textValue="Print">
          <PrinterIcon />
          Print…
        </ListBoxItem>
        <ListBoxItem id="prefs" textValue="Preferences">
          <SettingsIcon />
          Preferences
        </ListBoxItem>
      </ListBox>
    </div>
  )
}
