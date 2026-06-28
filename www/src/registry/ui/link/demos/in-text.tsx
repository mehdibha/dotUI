import { Link } from '@/registry/ui/link'

export default function Demo() {
  return (
    <p className="max-w-xs text-sm text-fg-muted">
      Built on <Link href="#">React Aria Components</Link> for accessibility and
      styled with <Link href="#">Tailwind CSS</Link>. Read the{' '}
      <Link href="#">getting started guide</Link> to learn more.
    </p>
  )
}
