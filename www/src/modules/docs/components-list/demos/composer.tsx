import { PlusIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  Composer,
  ComposerSubmit,
  ComposerTextArea,
  ComposerToolbar,
} from "@/registry/ui/composer"

export function ComposerDemo() {
  return (
    <Composer className="w-64">
      <ComposerTextArea aria-label="Message" placeholder="Ask anything" />
      <ComposerToolbar>
        <Button isIconOnly variant="quiet" size="sm" aria-label="Add files">
          <PlusIcon />
        </Button>
        <ComposerSubmit size="sm" />
      </ComposerToolbar>
    </Composer>
  )
}
