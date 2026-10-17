"use client"

import React from "react"
import * as FormPrimitives from "react-aria-components/Form"

import { ChevronDownIcon } from "@/registry/icons"
import { Button } from "@/registry/ui/button"
import { Card, CardContent, CardFooter } from "@/registry/ui/card"
import { Combobox } from "@/registry/ui/combobox"
import { Label } from "@/registry/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { ListBox, ListBoxItem } from "@/registry/ui/list-box"
import { Popover } from "@/registry/ui/popover"

const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"]

export default function Demo() {
  const [framework, setFramework] = React.useState<string | null>(null)
  return (
    <Card className="w-52">
      <CardContent>
        <FormPrimitives.Form
          id="form-with-combobox"
          className="w-full"
          onSubmit={(e) => {
            e.preventDefault()
            const data = new FormData(e.currentTarget)
            setFramework(String(data.get("framework")))
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
        {framework && (
          <p className="mt-2 text-sm text-fg-muted">
            You selected {framework} as your framework.
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button type="submit" form="form-with-combobox">
          Submit
        </Button>
      </CardFooter>
    </Card>
  )
}
