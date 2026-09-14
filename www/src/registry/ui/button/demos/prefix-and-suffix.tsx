import { ArrowRightIcon, UploadIcon } from "@/registry/__generated__/icons"
import { Button } from "@/registry/ui/button"

export default function Demo() {
  return (
    <div className="flex items-center gap-2">
      <Button>
        <UploadIcon data-icon="inline-start" />
        Upload
      </Button>
      <Button>
        Continue
        <ArrowRightIcon data-icon="inline-end" />
      </Button>
    </div>
  )
}
