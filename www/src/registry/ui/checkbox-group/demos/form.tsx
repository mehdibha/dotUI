'use client'

import * as FormPrimitives from 'react-aria-components/Form'

import { Button } from '@/registry/ui/button'
import { Checkbox, CheckboxControl } from '@/registry/ui/checkbox'
import { CheckboxGroup } from '@/registry/ui/checkbox-group'
import { Description, FieldGroup, Label } from '@/registry/ui/field'

export default function Demo() {
  return (
    <FormPrimitives.Form
      onSubmit={(e) => {
        e.preventDefault()
        const data = Object.fromEntries(new FormData(e.currentTarget))
        alert(JSON.stringify(data, null, 2))
      }}
      className="w-full max-w-xs space-y-6"
    >
      <CheckboxGroup name="dietary">
        <Label>Dietary restrictions</Label>
        <FieldGroup>
          <Checkbox value="vegetarian">
            <CheckboxControl />
            <Label>Vegetarian</Label>
          </Checkbox>
          <Checkbox value="vegan">
            <CheckboxControl />
            <Label>Vegan</Label>
          </Checkbox>
          <Checkbox value="gluten-free">
            <CheckboxControl />
            <Label>Gluten-free</Label>
          </Checkbox>
        </FieldGroup>
      </CheckboxGroup>
      <CheckboxGroup name="activities" defaultValue={['workshop']}>
        <Label>Activities</Label>
        <FieldGroup>
          <Checkbox value="workshop">
            <CheckboxControl />
            <Label>Workshop</Label>
          </Checkbox>
          <Checkbox value="networking">
            <CheckboxControl />
            <Label>Networking</Label>
          </Checkbox>
          <Checkbox value="dinner">
            <CheckboxControl />
            <Label>Dinner</Label>
          </Checkbox>
        </FieldGroup>
      </CheckboxGroup>
      <CheckboxGroup name="consent" isRequired>
        <Label>Consent</Label>
        <Description>Required to complete your RSVP.</Description>
        <FieldGroup>
          <Checkbox value="terms">
            <CheckboxControl />
            <Label>I accept the event terms</Label>
          </Checkbox>
          <Checkbox value="photos">
            <CheckboxControl />
            <Label>I consent to event photos</Label>
          </Checkbox>
        </FieldGroup>
      </CheckboxGroup>
      <Button type="submit" variant="primary" className="w-full">
        Confirm RSVP
      </Button>
    </FormPrimitives.Form>
  )
}
