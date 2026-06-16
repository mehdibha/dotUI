'use client'

import { ArrowUpIcon, SparklesIcon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import { Badge } from '@/registry/ui/badge'
import { Button } from '@/registry/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/registry/ui/card'
import { TextArea } from '@/registry/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/registry/ui/select'
import { TextField } from '@/registry/ui/text-field'

const suggestions = ['Summarize my week', 'Draft a reply', 'Find action items']

export function AskAi({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <Card className={cn(className)} {...props}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SparklesIcon className="size-4 text-fg-accent" />
          Ask AI
        </CardTitle>
        <CardDescription>Powered by Claude Opus 4.8.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <TextField
          aria-label="Prompt"
          className="w-full"
          defaultValue="Summarize the open PRs and tell me which to review first."
        >
          <TextArea placeholder="Ask anything…" rows={3} />
        </TextField>
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((suggestion) => (
            <Badge
              key={suggestion}
              appearance="subtle"
              variant="neutral"
              className="cursor-interactive font-normal"
            >
              {suggestion}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <Select aria-label="Model" defaultSelectedKey="opus" className="w-auto">
          <SelectTrigger size="sm" className="w-auto" />
          <SelectContent>
            <SelectItem id="opus">Claude Opus 4.8</SelectItem>
            <SelectItem id="sonnet">Claude Sonnet 4.6</SelectItem>
            <SelectItem id="haiku">Claude Haiku 4.5</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="primary" size="sm">
          Ask
          <ArrowUpIcon />
        </Button>
      </CardFooter>
    </Card>
  )
}
