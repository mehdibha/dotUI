import { ArrowRight, BookOpen, ExternalLink } from 'lucide-react'

import { Link } from '@/registry/ui/link'

export default function Demo() {
  return (
    <div className="flex flex-col items-start gap-3">
      <Link href="#">
        <BookOpen className="size-4" />
        Read the docs
      </Link>
      <Link href="#">
        Read the changelog
        <ArrowRight className="size-4" />
      </Link>
      <Link href="#" variant="quiet">
        Open in v0
        <ExternalLink className="size-3.5" />
      </Link>
    </div>
  )
}
