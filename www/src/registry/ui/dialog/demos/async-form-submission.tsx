'use client'

import React from 'react'
import * as FormPrimitives from 'react-aria-components/Form'

import { Responsive } from '@/registry/lib/responsive'
import { Button } from '@/registry/ui/button'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/registry/ui/dialog'
import { Drawer } from '@/registry/ui/drawer'
import { Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import { Modal } from '@/registry/ui/modal'
import { TextField } from '@/registry/ui/text-field'

export default function Demo() {
  const [isPending, setIsPending] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsPending(false)
  }

  return (
    <Dialog>
      <Button>Edit username</Button>
      <Responsive
        render={(isMobile) => {
          const content = (
            <DialogContent>
              {({ close }) => (
                <>
                  <DialogHeader>
                    <DialogTitle>Edit username</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogBody>
                    <FormPrimitives.Form
                      onSubmit={(e) => {
                        handleSubmit(e)
                        close()
                      }}
                    >
                      <TextField autoFocus defaultValue="@mehdibha" isRequired>
                        <Label>Username</Label>
                        <Input className="w-full" />
                      </TextField>
                    </FormPrimitives.Form>
                  </DialogBody>
                  <DialogFooter>
                    <Button variant="default" slot="close">
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      isPending={isPending}
                      variant="primary"
                    >
                      Save changes
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          )
          return isMobile ? (
            <Drawer>{content}</Drawer>
          ) : (
            <Modal>{content}</Modal>
          )
        }}
      />
    </Dialog>
  )
}
