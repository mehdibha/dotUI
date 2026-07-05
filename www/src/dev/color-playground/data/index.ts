import { geist } from './geist'
import { primer } from './primer'
import { radix } from './radix'
import { spectrum } from './spectrum'
import { tailwind } from './tailwind'

export type { ReferenceScale, ReferenceSource } from './types'

export const REFERENCE_SOURCES = [tailwind, radix, geist, spectrum, primer]
