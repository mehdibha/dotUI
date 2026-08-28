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
      promptInput: "w-full min-w-0",
      promptInputTextarea: "",
      promptInputToolbar: "",
      // The toolbar is an input-group addon, whose `justify-start` outranks a
      // plain `justify-*` here — push the submit to the end instead.
      promptInputSubmit: "ml-auto shrink-0",
    },
  },
  density: {
    compact: {
      slots: {
        conversation: "gap-4 p-3 text-xs/relaxed",
        message: "gap-2",
        messageContent:
          "gap-1.5 text-xs/relaxed group-data-[role=user]/message:px-2.5 group-data-[role=user]/message:py-1.5",
        promptInputTextarea: "min-h-12",
      },
    },
    default: {
      slots: {
        conversation: "gap-6 p-4 text-sm",
        message: "gap-3",
        messageContent:
          "gap-2 text-sm group-data-[role=user]/message:px-3 group-data-[role=user]/message:py-2",
        promptInputTextarea: "min-h-16",
      },
    },
    comfortable: {
      slots: {
        conversation: "gap-8 p-6 text-sm",
        message: "gap-4",
        messageContent:
          "gap-2.5 text-sm group-data-[role=user]/message:px-4 group-data-[role=user]/message:py-2.5",
        promptInputTextarea: "min-h-20",
      },
    },
  },
})

export type ChatStyles = typeof styles

export { useStyles }
