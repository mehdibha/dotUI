'use client'

import { getLocalTimeZone, today } from '@internationalized/date'
import * as I18nProviderPrimitives from 'react-aria-components/I18nProvider'

import { Calendar } from '@/registry/ui/calendar'

export default function Demo() {
  return (
    <I18nProviderPrimitives.I18nProvider locale="ar-EG">
      <Calendar aria-label="التاريخ" defaultValue={today(getLocalTimeZone())} />
    </I18nProviderPrimitives.I18nProvider>
  )
}
