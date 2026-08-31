"use client"

import { FileCodeIcon, FileIcon, FileTextIcon } from "@/registry/icons"
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/registry/ui/attachment"

const files = [
  { icon: FileTextIcon, title: "notes.md", description: "4 KB" },
  { icon: FileCodeIcon, title: "styles.ts", description: "12 KB" },
  { icon: FileIcon, title: "tokens.json", description: "8 KB" },
] as const

export default function Demo() {
  return (
    <AttachmentGroup className="w-full max-w-sm">
      {files.map(({ icon: Icon, title, description }) => (
        <Attachment key={title} size="sm">
          <AttachmentMedia>
            <Icon />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{title}</AttachmentTitle>
            <AttachmentDescription>{description}</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      ))}
    </AttachmentGroup>
  )
}
