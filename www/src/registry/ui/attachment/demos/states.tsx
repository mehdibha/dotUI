"use client"

import { FileIcon, RefreshCwIcon, XIcon } from "@/registry/icons"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/registry/ui/attachment"
import { Loader } from "@/registry/ui/loader"

export default function Demo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <Attachment state="uploading" className="w-full">
        <AttachmentMedia>
          <Loader />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>screen-recording.mp4</AttachmentTitle>
          <AttachmentDescription>Uploading… 34%</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Cancel upload">
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment state="error" className="w-full">
        <AttachmentMedia>
          <FileIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>design-specs.fig</AttachmentTitle>
          <AttachmentDescription>Upload failed</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Retry upload">
            <RefreshCwIcon />
          </AttachmentAction>
          <AttachmentAction aria-label="Remove attachment">
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </div>
  )
}
