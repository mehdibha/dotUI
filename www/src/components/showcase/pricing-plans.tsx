'use client'

import { useState } from 'react'

import { cn } from '@/registry/lib/utils'
import { Badge } from '@/registry/ui/badge'
import { Button } from '@/registry/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/registry/ui/card'
import {
  Description,
  FieldContent,
  FieldGroup,
  Label,
} from '@/registry/ui/field'
import {
  Radio,
  RadioControl,
  RadioGroup,
  RadioIndicator,
} from '@/registry/ui/radio-group'

const tiers = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$0',
    description: 'For side projects.',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19',
    description: 'For growing teams.',
    popular: true,
  },
  {
    id: 'team',
    name: 'Team',
    price: '$49',
    description: 'For whole orgs.',
  },
]

export function PricingPlans({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [plan, setPlan] = useState('pro')

  return (
    <Card className={cn(className)} {...props}>
      <CardHeader>
        <CardTitle>Choose a plan</CardTitle>
        <CardDescription>Pick the plan that fits your team.</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup aria-label="Plan" value={plan} onChange={setPlan}>
          <FieldGroup>
            {tiers.map((tier) => (
              <Radio key={tier.id} value={tier.id}>
                <RadioControl>
                  <RadioIndicator />
                  <FieldContent className="flex-1">
                    <div className="flex items-center gap-2">
                      <Label>{tier.name}</Label>
                      {tier.popular ? (
                        <Badge variant="accent" size="sm">
                          Popular
                        </Badge>
                      ) : null}
                      <span className="ml-auto flex items-baseline gap-0.5 text-fg">
                        <span className="text-sm font-medium tabular-nums">
                          {tier.price}
                        </span>
                        <span className="text-xs text-fg-muted">/mo</span>
                      </span>
                    </div>
                    <Description>{tier.description}</Description>
                  </FieldContent>
                </RadioControl>
              </Radio>
            ))}
          </FieldGroup>
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button variant="primary" className="w-full">
          Continue
        </Button>
      </CardFooter>
    </Card>
  )
}
