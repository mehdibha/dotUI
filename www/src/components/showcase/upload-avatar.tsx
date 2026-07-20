'use client'

import { ImageUpIcon } from '@/registry/icons'
import { cn } from '@/registry/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/ui/avatar'
import { Button } from '@/registry/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/registry/ui/card'
import { DropZone, DropZoneLabel } from '@/registry/ui/drop-zone'
import { FileTrigger } from '@/registry/ui/file-trigger'

export function UploadAvatar({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <Card className={cn(className)} {...props}>
      <CardHeader>
        <CardTitle>Profile photo</CardTitle>
        <CardDescription>Drag a file here or browse to upload.</CardDescription>
      </CardHeader>
      <CardContent>
        <DropZone className="w-full gap-3 py-6">
          <Avatar size="lg" className="size-16">
            <AvatarImage
              src="https://github.com/mehdibha.png"
              alt="Profile photo"
            />
            <AvatarFallback>
              <ImageUpIcon className="size-5 text-fg-muted" />
            </AvatarFallback>
          </Avatar>
          <DropZoneLabel className="sr-only">
            Drag a file here to upload
          </DropZoneLabel>
          <FileTrigger acceptedFileTypes={['image/png', 'image/jpeg']}>
            <Button variant="default" size="sm">
              Choose file
            </Button>
          </FileTrigger>
          <p className="min-w-0 text-center text-xs text-fg-muted">
            PNG or JPG, up to 2MB
          </p>
        </DropZone>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="quiet">Remove</Button>
        <Button variant="primary">Save</Button>
      </CardFooter>
    </Card>
  )
}
