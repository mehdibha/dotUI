import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from '@/registry/ui/attachment'

export default function Demo() {
  return (
    <AttachmentGroup>
      <Attachment orientation="vertical">
        <AttachmentMedia variant="image">
          <img src="https://github.com/mehdibha.png" alt="" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>avatar.png</AttachmentTitle>
          <AttachmentDescription>PNG · 48 KB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment orientation="vertical">
        <AttachmentMedia variant="image">
          <img src="https://github.com/shadcn.png" alt="" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>cover.png</AttachmentTitle>
          <AttachmentDescription>PNG · 120 KB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    </AttachmentGroup>
  )
}
