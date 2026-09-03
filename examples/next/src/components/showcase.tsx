"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button, LinkButton } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch, SwitchControl } from "@/components/ui/switch"
import { TextField } from "@/components/ui/text-field"

// A handful of installed components composed the way the docs show them.
// Every import resolves to a file `shadcn add` wrote — see examples/README.md.
export function Showcase({ framework }: { framework: string }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-8 p-8">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://github.com/mehdibha.png" alt="mehdibha" />
            <AvatarFallback>M</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">dotUI on {framework}</p>
            <p className="text-sm text-fg-muted">
              Installed with shadcn init + shadcn add.
            </p>
          </div>
        </div>
        <Badge>consumer</Badge>
      </header>
      <section className="flex flex-wrap gap-2">
        <Button variant="primary">Primary</Button>
        <Button>Secondary</Button>
        <Button variant="quiet">Quiet</Button>
        <Button variant="danger">Danger</Button>
        <LinkButton href="https://dotui.org" target="_blank" variant="link">
          dotui.org
        </LinkButton>
      </section>
      <Card>
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            A form built from the registry's field primitives.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => event.preventDefault()}
          >
            <TextField>
              <Label>Email</Label>
              <Input type="email" placeholder="you@example.com" />
            </TextField>
            <Switch>
              <SwitchControl />
              <Label>Remember me</Label>
            </Switch>
            <Button type="submit" variant="primary" className="self-start">
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
