"use client"

import { FileTextIcon, XIcon } from "@/registry/icons"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  type AttachmentProps,
} from "@/registry/ui/attachment"

export default function Demo({
  title = "quarterly-report.pdf",
  description = "1.2 MB · PDF",
  state = "done",
  size = "md",
  orientation = "horizontal",
}: {
  title?: string
  description?: string
  state?: AttachmentProps["state"]
  size?: AttachmentProps["size"]
  orientation?: AttachmentProps["orientation"]
} = {}) {
  return (
    <Attachment state={state} size={size} orientation={orientation}>
      <AttachmentMedia>
        <FileTextIcon />
      </AttachmentMedia>
      <AttachmentContent>
        {title && <AttachmentTitle>{title}</AttachmentTitle>}
        {description && (
          <AttachmentDescription>{description}</AttachmentDescription>
        )}
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction aria-label="Remove attachment">
          <XIcon />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  )
}
