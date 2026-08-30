"use client"

import { FileTextIcon } from "@/registry/icons"
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/registry/ui/attachment"

const sizes = ["xs", "sm", "md"] as const

export default function Demo() {
  return (
    <div className="flex w-full max-w-xs flex-col items-start gap-3">
      {sizes.map((size) => (
        <Attachment key={size} size={size}>
          <AttachmentMedia>
            <FileTextIcon />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>quarterly-report.pdf</AttachmentTitle>
            <AttachmentDescription>1.2 MB · PDF</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      ))}
    </div>
  )
}
