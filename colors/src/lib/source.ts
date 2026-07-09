import { loader } from 'fumadocs-core/source'

import { docs } from '@/.source/server'

export const chaptersSource = loader({
  baseUrl: '/',
  source: docs.toFumadocsSource(),
})
