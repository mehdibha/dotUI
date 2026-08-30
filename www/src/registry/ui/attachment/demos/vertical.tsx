"use client"

import { ImageIcon, XIcon } from "@/registry/icons"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/registry/ui/attachment"

export default function Demo() {
  return (
    <Attachment orientation="vertical">
      <AttachmentMedia>
        <ImageIcon />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>hero-banner.png</AttachmentTitle>
        <AttachmentDescription>640 KB</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction aria-label="Remove attachment">
          <XIcon />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  )
}
