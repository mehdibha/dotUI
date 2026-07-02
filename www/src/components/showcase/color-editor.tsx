'use client'

import { cn } from '@/registry/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/registry/ui/card'
import { ColorEditor } from '@/registry/ui/color-editor'

export function ColorEditorCard({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <Card className={cn('', className)} {...props}>
      <CardHeader>
        <CardTitle>Accent color</CardTitle>
        <CardDescription>Edit the accent color of the app.</CardDescription>
      </CardHeader>
      <CardContent>
        <ColorEditor className="w-full" />
      </CardContent>
    </Card>
  )
}
