'use client'

import { Button } from '@/registry/ui/button'
import { Checkbox, CheckboxControl } from '@/registry/ui/checkbox'
import { Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import { Link } from '@/registry/ui/link'
import { TextField } from '@/registry/ui/text-field'

export default function Login() {
  return (
    <div className="grid min-h-svh w-full bg-bg lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-primary p-10 text-fg-on-primary lg:flex">
        <div className="text-lg font-semibold">Acme Inc.</div>
        <blockquote className="space-y-3">
          <p className="text-2xl leading-snug font-medium">
            “This is the design system we wish we’d had from day one.”
          </p>
          <footer className="text-sm text-fg-on-primary/80">
            Sofia Chen — Head of Design
          </footer>
        </blockquote>
        <div className="text-sm text-fg-on-primary/70">© 2026 Acme Inc.</div>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold text-fg">Sign in</h1>
            <p className="text-sm text-fg-muted">
              Enter your credentials to access your account.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <TextField isRequired>
              <Label>Email</Label>
              <Input type="email" placeholder="you@example.com" />
            </TextField>
            <TextField isRequired>
              <Label>Password</Label>
              <Input type="password" placeholder="••••••••" />
            </TextField>
            <div className="flex items-center justify-between">
              <Checkbox>
                <CheckboxControl />
                <Label>Remember me</Label>
              </Checkbox>
              <Link href="#" className="text-sm">
                Forgot password?
              </Link>
            </div>
            <Button variant="primary" className="w-full">
              Sign in
            </Button>
          </div>
          <p className="text-center text-sm text-fg-muted">
            Don&apos;t have an account? <Link href="#">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
