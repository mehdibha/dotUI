import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <div className="container flex min-h-[calc(100svh-var(--header-height,0px))] flex-col items-center justify-center py-20">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-lg text-fg-muted">Page not found</p>
      <Link
        to="/"
        className="mt-8 text-sm text-fg-muted underline underline-offset-4 hover:text-fg"
      >
        Go back home
      </Link>
    </div>
  )
}
