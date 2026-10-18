"use client"

import * as FormPrimitives from "react-aria-components/Form"

import { Button } from "@/registry/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import { Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import { Link } from "@/registry/ui/link"
import { TextField } from "@/registry/ui/text-field"

export default function Demo() {
  return (
    <Card className="w-full max-w-xs">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Button variant="link">Sign Up</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <FormPrimitives.Form
          id="login-form"
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-6"
        >
          <TextField name="email" type="email" isRequired className="w-full">
            <Label>Email</Label>
            <Input placeholder="m@example.com" />
          </TextField>
          <TextField
            name="password"
            type="password"
            isRequired
            className="w-full"
          >
            <div className="flex items-center">
              <Label>Password</Label>
              <Link href="#" className="ml-auto text-sm">
                Forgot your password?
              </Link>
            </div>
            <Input />
          </TextField>
        </FormPrimitives.Form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          variant="primary"
          type="submit"
          form="login-form"
          className="w-full"
        >
          Login
        </Button>
        <Button variant="secondary" className="w-full">
          Login with Google
        </Button>
      </CardFooter>
    </Card>
  )
}
