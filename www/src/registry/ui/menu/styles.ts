import { createStyles } from "@/lib/styles"

import { LIST_ROWS } from "../list-box/styles"
import menuMeta from "./meta"

const { useStyles, styles } = createStyles(menuMeta, LIST_ROWS)

export type MenuStyles = typeof styles

export { useStyles }
