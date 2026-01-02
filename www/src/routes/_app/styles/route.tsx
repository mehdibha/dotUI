import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/styles")({
	component: StylesLayout,
});

function StylesLayout() {
	return <Outlet />;
}
