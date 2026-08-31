"use client"

import { ArrowUpIcon } from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Bubble, BubbleContent } from "@/registry/ui/bubble"
import { Button } from "@/registry/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import { InputGroup, InputGroupAddon, TextArea } from "@/registry/ui/input"
import { Message, MessageAvatar, MessageContent } from "@/registry/ui/message"

export function SupportChat({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <Card className={cn("gap-0", className)} {...props}>
      <CardHeader className="border-b">
        <CardTitle>Support</CardTitle>
        <CardDescription className="flex items-center gap-1.5">
          <span className="size-1.5 shrink-0 rounded-full bg-success" />
          <span className="min-w-0 truncate">Maya · online</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="min-w-0 px-0">
        <div
          role="log"
          className="flex w-full min-w-0 flex-1 flex-col gap-6 overflow-y-auto overscroll-contain p-4 text-sm"
        >
          <Message align="end">
            <MessageContent>
              <Bubble align="end" variant="muted">
                <BubbleContent>
                  Hey — can I transfer my subscription to a new workspace?
                </BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
          <Message>
            <MessageAvatar>
              <Avatar size="sm">
                <AvatarFallback>MA</AvatarFallback>
              </Avatar>
            </MessageAvatar>
            <MessageContent>
              Yes — go to Settings → Billing → Transfer plan, pick the
              destination workspace, and your seats and remaining credit move
              over. Nothing is charged twice.
            </MessageContent>
          </Message>
          <Message align="end">
            <MessageContent>
              <Bubble align="end" variant="muted">
                <BubbleContent>Found it — that worked, thanks!</BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
        </div>
      </CardContent>
      <CardFooter>
        <form onSubmit={(e) => e.preventDefault()} className="w-full min-w-0">
          <InputGroup>
            <TextArea
              placeholder="Reply to Maya..."
              aria-label="Message"
              className="min-h-16"
              onKeyDown={(e) => {
                if (
                  e.defaultPrevented ||
                  e.key !== "Enter" ||
                  e.shiftKey ||
                  e.nativeEvent.isComposing
                )
                  return
                e.preventDefault()
                e.currentTarget.form?.requestSubmit()
              }}
            />
            <InputGroupAddon>
              <Button
                type="submit"
                variant="primary"
                isIconOnly
                aria-label="Send message"
                className="ml-auto shrink-0"
              >
                <ArrowUpIcon />
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </CardFooter>
    </Card>
  )
}
