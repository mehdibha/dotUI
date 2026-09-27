import { MailIcon } from "@/registry/icons"
import { Button } from "@/registry/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/ui/card"
import { Description, Label } from "@/registry/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { TextField } from "@/registry/ui/text-field"

/* Compose's finished card, verbatim (compose/steps.tsx, last step): the
   match cut depends on it being the same tree. */

/** Screen px per component px at the cut (Compose's HANDOFF_SCALE). */
export const HANDOFF_SCALE = 2

export function Newsletter() {
  return (
    <Card data-patterns-card="">
      <CardHeader>
        <CardTitle>Stay in the loop</CardTitle>
      </CardHeader>
      <CardContent>
        <TextField style={{ width: 320 }}>
          <Label>Email</Label>
          <InputGroup>
            <InputGroupAddon>
              <MailIcon />
            </InputGroupAddon>
            <Input placeholder="you@example.com" />
            <InputGroupAddon>
              <Button>Subscribe</Button>
            </InputGroupAddon>
          </InputGroup>
          <Description>No spam, ever.</Description>
        </TextField>
      </CardContent>
    </Card>
  )
}
