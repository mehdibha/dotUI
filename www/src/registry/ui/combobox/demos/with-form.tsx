'use client'

import { ChevronDownIcon } from 'lucide-react'
import * as FormPrimitives from 'react-aria-components/Form'

import { Button } from '@/registry/ui/button'
import { Card, CardContent, CardFooter } from '@/registry/ui/card'
import { Combobox } from '@/registry/ui/combobox'
import { Label } from '@/registry/ui/field'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'

const frameworks = ['Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro']

export default function Demo() {
  return (
    <Card className="w-full max-w-xs">
      <CardContent>
        <FormPrimitives.Form
          id="form-with-combobox"
          className="w-full"
          onSubmit={(e) => {
            e.preventDefault()
            const data = new FormData(e.currentTarget)
            alert(`You selected ${data.get('framework')} as your framework.`)
          }}
        >
          <Combobox name="framework" isRequired>
            <Label>Framework</Label>
            <InputGroup>
              <Input placeholder="Select a framework" />
              <InputGroupAddon>
                <Button variant="quiet" isIconOnly>
                  <ChevronDownIcon />
                </Button>
              </InputGroupAddon>
            </InputGroup>
            <Popover>
              <ListBox items={frameworks.map((id) => ({ id }))}>
                {(item) => <ListBoxItem id={item.id}>{item.id}</ListBoxItem>}
              </ListBox>
            </Popover>
          </Combobox>
        </FormPrimitives.Form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="form-with-combobox">
          Submit
        </Button>
      </CardFooter>
    </Card>
  )
}
