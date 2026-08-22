import { createStyles } from "@/lib/styles"

import chatMeta from "./meta"

const { useStyles, styles } = createStyles(chatMeta, {
  base: {
    slots: {
      conversation:
        "flex w-full min-w-0 flex-1 flex-col overflow-y-auto overscroll-contain",
      message:
        "group/message flex w-full min-w-0 items-start data-[role=user]:flex-row-reverse",
      messageContent: [
        "flex min-w-0 flex-col text-fg",
        "group-data-[role=assistant]/message:w-full",
        "group-data-[role=user]/message:max-w-[80%] group-data-[role=user]/message:rounded-(--chat-message-radius) group-data-[role=user]/message:bg-muted",
      ],
      messageAvatar: "shrink-0",
      promptInput: [
        "group/prompt-input flex w-full min-w-0 cursor-text flex-col rounded-(--chat-input-radius) border border-border-field bg-field",
        "shadow-[var(--shadow-control,none)] transition-[box-shadow,border-color]",
        "has-[[data-input-control][data-focused]]:border-border-focus has-[[data-input-control][data-focused]]:ring-2 has-[[data-input-control][data-focused]]:ring-border-focus-muted",
        "has-[[data-input-control]:disabled]:border-border-disabled has-[[data-input-control]:disabled]:bg-disabled",
      ],
      promptInputTextarea:
        "w-full rounded-none border-0 bg-transparent shadow-none focus:ring-0",
      promptInputToolbar: "flex shrink-0 items-center justify-between",
      promptInputSubmit: "shrink-0",
    },
  },
  density: {
    compact: {
      slots: {
        conversation: "gap-4 p-3 text-xs/relaxed",
        message: "gap-2",
        messageContent:
          "gap-1.5 text-xs/relaxed group-data-[role=user]/message:px-2.5 group-data-[role=user]/message:py-1.5",
        promptInput: "p-1.5",
        promptInputTextarea: "min-h-12 px-2 py-1.5 text-xs/relaxed",
        promptInputToolbar: "gap-1 px-0.5 pt-1",
      },
    },
    default: {
      slots: {
        conversation: "gap-6 p-4 text-sm",
        message: "gap-3",
        messageContent:
          "gap-2 text-sm group-data-[role=user]/message:px-3 group-data-[role=user]/message:py-2",
        promptInput: "p-2",
        promptInputTextarea: "min-h-16 px-2 py-1.5 text-sm",
        promptInputToolbar: "gap-1.5 px-0.5 pt-1.5",
      },
    },
    comfortable: {
      slots: {
        conversation: "gap-8 p-6 text-sm",
        message: "gap-4",
        messageContent:
          "gap-2.5 text-sm group-data-[role=user]/message:px-4 group-data-[role=user]/message:py-2.5",
        promptInput: "p-2.5",
        promptInputTextarea: "min-h-20 px-2.5 py-2 text-sm",
        promptInputToolbar: "gap-2 px-1 pt-2",
      },
    },
  },
})

export type ChatStyles = typeof styles

export { useStyles }
