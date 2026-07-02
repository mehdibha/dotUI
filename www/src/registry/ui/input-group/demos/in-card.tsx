'use client'

import { ExternalLinkIcon, MailIcon } from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/registry/ui/card'
import { Label } from '@/registry/ui/field'
import {
  Input,
  InputGroup,
  InputGroupAddon,
  TextArea,
} from '@/registry/ui/input'
import { TextField } from '@/registry/ui/text-field'

export default function Demo() {
  return (
    <Card className="w-full max-w-xs">
      <CardHeader>
        <CardTitle>Card with Input Group</CardTitle>
        <CardDescription>This is a card with an input group.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <TextField>
          <Label>Email Address</Label>
          <InputGroup>
            <Input type="email" placeholder="you@example.com" />
            <InputGroupAddon>
              <MailIcon />
            </InputGroupAddon>
          </InputGroup>
        </TextField>
        <TextField>
          <Label>Website URL</Label>
          <InputGroup>
            <InputGroupAddon>
              <span>https://</span>
            </InputGroupAddon>
            <Input placeholder="example.com" />
            <InputGroupAddon>
              <ExternalLinkIcon />
            </InputGroupAddon>
          </InputGroup>
        </TextField>
        <TextField>
          <Label>Feedback &amp; Comments</Label>
          <InputGroup>
            <TextArea
              placeholder="Share your thoughts..."
              className="min-h-[100px]"
            />
            <InputGroupAddon>
              <span>0/500 characters</span>
            </InputGroupAddon>
          </InputGroup>
        </TextField>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button>Cancel</Button>
        <Button variant="primary">Submit</Button>
      </CardFooter>
    </Card>
  )
}
