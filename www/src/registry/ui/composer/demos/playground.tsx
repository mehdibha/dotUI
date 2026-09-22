"use client"

import { PlusIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  Composer,
  ComposerSubmit,
  ComposerTextArea,
  ComposerToolbar,
} from "@/registry/ui/composer"

export default function Demo() {
  return (
    <Composer className="max-w-md" onSubmit={() => {}}>
      <ComposerTextArea aria-label="Message" placeholder="Ask anything" />
      <ComposerToolbar>
        <Button isIconOnly variant="quiet" aria-label="Add files">
          <PlusIcon />
        </Button>
        <ComposerSubmit />
      </ComposerToolbar>
    </Composer>
  )
}
