'use client'

import { getLocalTimeZone, today } from '@internationalized/date'

import { Calendar } from '@/registry/ui/calendar'
import { Card, CardContent } from '@/registry/ui/card'

export default function Demo() {
  return (
    <Card className="mx-auto w-fit">
      <CardContent>
        <Calendar
          aria-label="Date"
          defaultValue={today(getLocalTimeZone())}
          isInvalid
        />
        <p className="mt-2 text-sm text-fg-danger">We are closed on weekends</p>
      </CardContent>
    </Card>
  )
}
