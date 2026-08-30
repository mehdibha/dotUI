"use client"

import { ArrowUpIcon } from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import {
  Conversation,
  Message,
  MessageAvatar,
  MessageContent,
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "@/registry/ui/chat"

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
        <Conversation>
          <Message role="user">
            <MessageContent>
              Hey — can I transfer my subscription to a new workspace?
            </MessageContent>
          </Message>
          <Message role="assistant">
            <MessageAvatar name="Maya" />
            <MessageContent>
              Yes — go to Settings → Billing → Transfer plan, pick the
              destination workspace, and your seats and remaining credit move
              over. Nothing is charged twice.
            </MessageContent>
          </Message>
          <Message role="user">
            <MessageContent>Found it — that worked, thanks!</MessageContent>
          </Message>
        </Conversation>
      </CardContent>
      <CardFooter>
        <PromptInput onSubmit={(e) => e.preventDefault()}>
          <PromptInputTextarea
            placeholder="Reply to Maya..."
            aria-label="Message"
          />
          <PromptInputToolbar>
            <PromptInputSubmit isIconOnly aria-label="Send message">
              <ArrowUpIcon />
            </PromptInputSubmit>
          </PromptInputToolbar>
        </PromptInput>
      </CardFooter>
    </Card>
  )
}
