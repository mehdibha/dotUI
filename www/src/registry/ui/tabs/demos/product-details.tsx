import { Star } from 'lucide-react'

import { Badge } from '@/registry/ui/badge'
import { Button } from '@/registry/ui/button'
import { Tab, TabList, TabPanel, Tabs } from '@/registry/ui/tabs'

export default function Demo() {
  return (
    <div className="w-full max-w-sm rounded-lg border bg-bg p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-fg">Aero Runner</h3>
          <p className="text-sm text-fg-muted">$129.00</p>
        </div>
        <Badge variant="success" appearance="subtle">
          In stock
        </Badge>
      </div>
      <Tabs>
        <TabList variant="line">
          <Tab id="description">Description</Tab>
          <Tab id="specs">Specs</Tab>
          <Tab id="reviews">Reviews</Tab>
        </TabList>
        <TabPanel id="description">
          <p className="text-sm text-fg-muted">
            Lightweight trainers built for daily mileage, with a breathable knit
            upper and responsive foam midsole.
          </p>
        </TabPanel>
        <TabPanel id="specs">
          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-fg-muted">Weight</dt>
              <dd className="text-fg">238 g</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-fg-muted">Drop</dt>
              <dd className="text-fg">8 mm</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-fg-muted">Material</dt>
              <dd className="text-fg">Recycled knit</dd>
            </div>
          </dl>
        </TabPanel>
        <TabPanel id="reviews">
          <div className="flex items-center gap-1.5 text-sm">
            <div className="flex text-warning">
              {Array.from({ length: 4 }).map((_, i) => (
                <Star key={i} className="size-3.5 fill-current" />
              ))}
              <Star className="size-3.5" />
            </div>
            <span className="text-fg-muted">4.0 (128 reviews)</span>
          </div>
        </TabPanel>
      </Tabs>
      <Button variant="primary" className="mt-4 w-full">
        Add to cart
      </Button>
    </div>
  )
}
