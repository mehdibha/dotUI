import { useRouter } from "@tanstack/react-router";

// Router-wide error boundary. notFound() throws are handled by the router's
// defaultNotFoundComponent; this catches any other loader/render error so it
// renders scoped chrome with a retry instead of bubbling to the document root.
// Retry uses router.invalidate() (re-runs the route loaders), per TanStack's
// guidance for loader errors — reset() alone clears the boundary without refetching.
export function DefaultError({ error }: { error: Error }) {
	const router = useRouter();

	return (
		<main className="container flex flex-1 flex-col items-center justify-center py-20 text-center">
			<h1 className="text-6xl font-bold">Error</h1>
			<p className="mt-4 text-lg text-fg-muted">Something went wrong.</p>
			{error?.message ? <p className="mt-2 max-w-xl text-sm text-fg-muted">{error.message}</p> : null}
			<button
				type="button"
				onClick={() => router.invalidate()}
				className="mt-8 text-sm text-fg-muted underline underline-offset-4 hover:text-fg"
			>
				Try again
			</button>
		</main>
	);
}
