import { geist } from './geist'
import { primer } from './primer'
import { radix } from './radix'
import { spectrum } from './spectrum'

export type { ReferenceScale, ReferenceSource } from './types'

export const REFERENCE_SOURCES = [radix, geist, spectrum, primer]
