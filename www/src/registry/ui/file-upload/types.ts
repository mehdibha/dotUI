import type { ComponentProps, ReactNode } from 'react'

import type { DropZone } from '@/registry/ui/drop-zone'

/**
 * A file-upload block — a React Aria `DropZone` + `FileTrigger` drag/browse
 * target. Transport stays the consumer's job: `onAdd` hands back the selected
 * `File`s and you render the list with `FileUploadItem`.
 */
export interface FileUploadProps extends Omit<
  ComponentProps<typeof DropZone>,
  'onDrop' | 'children'
> {
  /** Called with the files added via drag-drop or the browse dialog. */
  onAdd?: (files: File[]) => void
  /** MIME types / extensions accepted by the browse dialog. */
  acceptedFileTypes?: string[]
  /** Allow selecting more than one file. @default true */
  allowsMultiple?: boolean
  /** Headline shown in the default prompt. */
  label?: ReactNode
  /** Secondary text shown under the label. */
  description?: ReactNode
  /** Custom drop-area content, replacing the default prompt. */
  children?: ReactNode
}

/** A single row in the uploaded-file list, with optional progress and remove. */
export interface FileUploadItemProps extends Omit<
  ComponentProps<'div'>,
  'onError'
> {
  /** File name. */
  name: string
  /** File size in bytes, formatted for display. */
  size?: number
  /** Upload progress 0–100; renders a progress bar while uploading. */
  progress?: number
  /** Upload status, exposed as `data-status` for styling. */
  status?: 'pending' | 'uploading' | 'complete' | 'error'
  /** Called when the remove button is pressed. */
  onRemove?: () => void
}
