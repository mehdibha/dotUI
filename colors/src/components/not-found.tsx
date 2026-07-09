import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-start gap-4 px-6 py-24">
      <h1 className="text-2xl font-semibold">Not found</h1>
      <p className="text-fg-muted">
        This page doesn&apos;t exist — or this chapter isn&apos;t written yet.
      </p>
      <Link to="/" className="text-fg-accent underline underline-offset-2">
        Back to the chapters
      </Link>
    </div>
  )
}
