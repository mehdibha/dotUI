"use client"

import React from "react"
import { AlertCircleIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/registry/ui/alert"
import { Button } from "@/registry/ui/button"
import { Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import { TextField } from "@/registry/ui/text-field"

export default function Demo() {
  const [email, setEmail] = React.useState("")
  const [error, setError] = React.useState(true)

  return (
    <form
      className="flex w-full max-w-xs flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        setError(!email.includes("@"))
      }}
    >
      {error && (
        <Alert variant="danger">
          <AlertCircleIcon />
          <AlertTitle>Invalid email</AlertTitle>
          <AlertDescription>
            Enter a valid email address to continue.
          </AlertDescription>
        </Alert>
      )}
      <TextField value={email} onChange={setEmail} isInvalid={error}>
        <Label>Email</Label>
        <Input type="email" placeholder="you@example.com" />
      </TextField>
      <Button type="submit" variant="primary" size="sm">
        Sign in
      </Button>
    </form>
  )
}
