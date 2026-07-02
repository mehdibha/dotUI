'use client'

import { Button } from '@/registry/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/registry/ui/card'
import { Checkbox, CheckboxControl } from '@/registry/ui/checkbox'
import { Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import { Link } from '@/registry/ui/link'
import { TextField } from '@/registry/ui/text-field'

export default function Login() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-bg p-6">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Sign in to your account to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <TextField isRequired>
            <Label>Email</Label>
            <Input type="email" placeholder="you@example.com" />
          </TextField>
          <div className="flex flex-col gap-1.5">
            <TextField isRequired>
              <Label>Password</Label>
              <Input type="password" placeholder="••••••••" />
            </TextField>
            <Link href="#" className="self-end text-sm">
              Forgot password?
            </Link>
          </div>
          <Checkbox>
            <CheckboxControl />
            <Label>Remember me for 30 days</Label>
          </Checkbox>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button variant="primary" className="w-full">
            Sign in
          </Button>
          <p className="text-center text-sm text-fg-muted">
            Don&apos;t have an account? <Link href="#">Sign up</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
