import { Link } from "@tanstack/react-router";

import { Header } from "@/components/layout/header";

export function NotFound() {
	return (
		<>
			<Header />
			<main className="container flex flex-1 flex-col items-center justify-center py-20">
				<h1 className="font-bold text-6xl">404</h1>
				<p className="mt-4 text-fg-muted text-lg">Page not found</p>
				<Link to="/" className="mt-8 text-fg-muted text-sm underline underline-offset-4 hover:text-fg">
					Go back home
				</Link>
			</main>
		</>
	);
}
