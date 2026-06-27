'use client'

import { cn } from '@/registry/lib/utils'
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
  Checkbox,
  CheckboxControl,
  CheckboxIndicator,
} from '@/registry/ui/checkbox'
import { CheckboxGroup } from '@/registry/ui/checkbox-group'
import {
  Description,
  FieldContent,
  FieldGroup,
  Label,
} from '@/registry/ui/field'

export function CookiePreferences({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <Card className={cn(className)} {...props}>
      <CardHeader>
        <CardTitle>Cookie preferences</CardTitle>
        <CardDescription>
          Manage how we use cookies on this site.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CheckboxGroup
          aria-label="Cookie preferences"
          defaultValue={['performance', 'analytics']}
        >
          <FieldGroup>
            <Checkbox value="analytics">
              <CheckboxControl>
                <CheckboxIndicator />
                <FieldContent>
                  <Label>Analytics</Label>
                  <Description>Help us understand usage.</Description>
                </FieldContent>
              </CheckboxControl>
            </Checkbox>
            <Checkbox value="marketing">
              <CheckboxControl>
                <CheckboxIndicator />
                <FieldContent>
                  <Label>Marketing</Label>
                  <Description>Personalized offers and ads.</Description>
                </FieldContent>
              </CheckboxControl>
            </Checkbox>
            <Checkbox value="performance">
              <CheckboxControl>
                <CheckboxIndicator />
                <FieldContent>
                  <Label>Performance</Label>
                  <Description>Measure and improve site speed.</Description>
                </FieldContent>
              </CheckboxControl>
            </Checkbox>
          </FieldGroup>
        </CheckboxGroup>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button>Reject all</Button>
        <Button variant="primary">Accept selected</Button>
      </CardFooter>
    </Card>
  )
}
