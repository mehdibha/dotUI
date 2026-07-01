import { FileTextIcon } from 'lucide-react'

import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from '@/registry/ui/attachment'

const STATES = [
  { state: 'idle', label: 'PDF · 2.4 MB' },
  { state: 'uploading', label: 'Uploading…' },
  { state: 'error', label: 'Upload failed' },
] as const

export default function Demo() {
  return (
    <div className="flex flex-col gap-2">
      {STATES.map(({ state, label }) => (
        <Attachment key={state} state={state} className="w-72">
          <AttachmentMedia>
            <FileTextIcon />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>report.pdf</AttachmentTitle>
            <AttachmentDescription>{label}</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      ))}
    </div>
  )
}
