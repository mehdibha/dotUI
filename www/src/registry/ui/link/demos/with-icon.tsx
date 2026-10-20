import {
  ArrowRightIcon,
  BookOpenIcon,
  ExternalLinkIcon,
} from "@/registry/icons"
import { Link } from "@/registry/ui/link"

export default function Demo() {
  return (
    <div className="flex flex-col items-start gap-3">
      <Link href="#">
        <BookOpenIcon className="size-4" />
        Read the docs
      </Link>
      <Link href="#">
        Read the changelog
        <ArrowRightIcon className="size-4" />
      </Link>
      <Link href="#" variant="quiet">
        Open in v0
        <ExternalLinkIcon className="size-3.5" />
      </Link>
    </div>
  )
}
