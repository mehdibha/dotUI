import { ArrowRightIcon, UploadIcon } from "@/registry/__generated__/icons"
import { Button } from "@/registry/ui/button"

export default function Demo() {
  return (
    <div className="flex items-center gap-2">
      <Button>
        <UploadIcon data-icon-start="" />
        Upload
      </Button>
      <Button>
        Continue
        <ArrowRightIcon data-icon-end="" />
      </Button>
    </div>
  )
}
