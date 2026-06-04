"use client";

import { BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, Breadcrumbs } from "@/registry/ui/breadcrumbs";

import { AnimatedPreview } from "../animated-preview";

export default function Demo() {
	return (
		<AnimatedPreview
			script={async (s) => {
				await s.wait(600);
				await s.hover("home", { dwell: 900 });
				await s.hover("components", { dwell: 900 });
				await s.wait(400);
				await s.moveOff();
				await s.wait(700);
			}}
		>
			{(ref) => (
				<Breadcrumbs>
					<BreadcrumbItem>
						<span ref={ref("home")}>
							<BreadcrumbLink href="#">Home</BreadcrumbLink>
						</span>
						<BreadcrumbSeparator />
					</BreadcrumbItem>
					<BreadcrumbItem>
						<span ref={ref("components")}>
							<BreadcrumbLink href="#">Components</BreadcrumbLink>
						</span>
						<BreadcrumbSeparator />
					</BreadcrumbItem>
					<BreadcrumbItem>
						<BreadcrumbLink>Breadcrumbs</BreadcrumbLink>
					</BreadcrumbItem>
				</Breadcrumbs>
			)}
		</AnimatedPreview>
	);
}
