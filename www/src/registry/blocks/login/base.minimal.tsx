'use client'

import { Button } from '@/registry/ui/button'
import { Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import { Link } from '@/registry/ui/link'
import { TextField } from '@/registry/ui/text-field'

export default function Login() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-bg p-6">
      <div className="flex w-full max-w-xs flex-col gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 rounded-lg bg-fg" />
          <h1 className="text-xl font-semibold text-fg">Sign in to Acme</h1>
        </div>
        <div className="flex flex-col gap-3">
          <TextField isRequired aria-label="Email">
            <Label className="sr-only">Email</Label>
            <Input type="email" placeholder="you@example.com" />
          </TextField>
          <TextField isRequired aria-label="Password">
            <Label className="sr-only">Password</Label>
            <Input type="password" placeholder="Password" />
          </TextField>
          <Button variant="primary" className="w-full">
            Continue
          </Button>
        </div>
        <p className="text-center text-sm text-fg-muted">
          New here? <Link href="#">Create an account</Link>
        </p>
      </div>
    </div>
  )
}
