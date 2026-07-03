import rawIndex from './__generated__/index.json'
import type { DataIndex } from './schema'

export const dataIndex = rawIndex as unknown as DataIndex
