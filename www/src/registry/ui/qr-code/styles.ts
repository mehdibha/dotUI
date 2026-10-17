import { createStyles } from "@/lib/styles"

import qrCodeMeta from "./meta"

const { useStyles, styles } = createStyles(qrCodeMeta, {
  base: {
    slots: {
      root: "relative inline-flex size-32 shrink-0 items-center justify-center rounded-(--qr-code-radius) bg-(--surface-bg,var(--color-bg)) p-2 text-fg",
      logo: "absolute flex size-1/5 items-center justify-center *:size-full",
    },
  },
})

export type QrCodeStyles = typeof styles

export { useStyles }
