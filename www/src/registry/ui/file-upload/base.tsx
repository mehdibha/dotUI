'use client'

import type { ComponentProps, ReactNode } from 'react'
import { FileIcon, UploadCloudIcon, XIcon } from 'lucide-react'
import { isFileDropItem } from 'react-aria-components/useDrop'

import { Button } from '@/registry/ui/button'
import { DropZone } from '@/registry/ui/drop-zone'
import { FileTrigger } from '@/registry/ui/file-trigger'
import { ProgressBar } from '@/registry/ui/progress-bar'

import { useStyles } from './styles'

// MARK: FileUpload

interface FileUploadProps extends Omit<
  ComponentProps<typeof DropZone>,
  'onDrop' | 'children'
> {
  onAdd?: (files: File[]) => void
  acceptedFileTypes?: string[]
  allowsMultiple?: boolean
  label?: ReactNode
  description?: ReactNode
  children?: ReactNode
}

const FileUpload = ({
  onAdd,
  acceptedFileTypes,
  allowsMultiple = true,
  label,
  description,
  children,
  ...props
}: FileUploadProps) => {
  const { prompt, icon, promptLabel, promptDescription } = useStyles()()

  const handleSelect = (files: FileList | null) => {
    const list = Array.from(files ?? [])
    if (list.length) onAdd?.(list)
  }

  return (
    <DropZone
      aria-label="File upload"
      onDrop={async (event) => {
        const files = await Promise.all(
          event.items.filter(isFileDropItem).map((item) => item.getFile()),
        )
        if (files.length) onAdd?.(files)
      }}
      {...props}
    >
      {children ?? (
        <div className={prompt()}>
          <UploadCloudIcon className={icon()} />
          <div className="flex flex-col gap-0.5">
            <span className={promptLabel()}>
              {label ?? 'Drag and drop files here'}
            </span>
            {description ? (
              <span className={promptDescription()}>{description}</span>
            ) : null}
          </div>
          <FileTrigger
            acceptedFileTypes={acceptedFileTypes}
            allowsMultiple={allowsMultiple}
            onSelect={handleSelect}
          >
            <Button variant="default" size="sm">
              Browse files
            </Button>
          </FileTrigger>
        </div>
      )}
    </DropZone>
  )
}

// MARK: FileUploadList

const FileUploadList = ({ className, ...props }: ComponentProps<'div'>) => {
  const { list } = useStyles()()
  return (
    <div data-file-upload-list="" className={list({ className })} {...props} />
  )
}

// MARK: FileUploadItem

interface FileUploadItemProps extends Omit<ComponentProps<'div'>, 'onError'> {
  name: string
  size?: number
  progress?: number
  status?: 'pending' | 'uploading' | 'complete' | 'error'
  onRemove?: () => void
}

const FileUploadItem = ({
  name,
  size,
  progress,
  status = 'pending',
  onRemove,
  className,
  ...props
}: FileUploadItemProps) => {
  const { item, itemIcon, itemInfo, itemName, itemMeta } = useStyles()()
  const showProgress = typeof progress === 'number' && status !== 'complete'
  return (
    <div
      data-file-upload-item=""
      data-status={status}
      className={item({ className })}
      {...props}
    >
      <FileIcon className={itemIcon()} />
      <div className={itemInfo()}>
        <span className={itemName()}>{name}</span>
        {showProgress ? (
          <ProgressBar
            aria-label={`Uploading ${name}`}
            value={progress}
            className="mt-1.5"
          />
        ) : size != null ? (
          <span className={itemMeta()}>{formatBytes(size)}</span>
        ) : null}
      </div>
      {onRemove ? (
        <Button
          variant="quiet"
          size="sm"
          isIconOnly
          onPress={onRemove}
          aria-label={`Remove ${name}`}
        >
          <XIcon />
        </Button>
      ) : null}
    </div>
  )
}

// MARK: formatBytes

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  )
  const value = bytes / 1024 ** exponent
  return `${value.toFixed(value < 10 && exponent > 0 ? 1 : 0)} ${units[exponent]}`
}

// MARK: Separator

export type { FileUploadProps, FileUploadItemProps }
export { FileUpload, FileUploadList, FileUploadItem }
