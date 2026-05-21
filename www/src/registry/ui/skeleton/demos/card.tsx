"use client";

import { useState } from "react";

import { Avatar, AvatarFallback } from "@/registry/ui/avatar";
import { Button } from "@/registry/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/registry/ui/card";
import { Description, Field, Label } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";
import { Skeleton } from "@/registry/ui/skeleton";
import { Switch, SwitchControl } from "@/registry/ui/switch";
import { Text } from "@/registry/ui/text";

export default function Demo() {
	const [isLoading, setLoading] = useState(true);
	return (
		<div className="space-y-4">
			<Switch isSelected={isLoading} onChange={setLoading}>
				<SwitchControl />
				<Label>isLoading</Label>
			</Switch>
			<Skeleton isLoading={isLoading}>
				<Card className="w-80">
					<CardHeader className="flex-row items-center gap-3">
						<Avatar size="lg">
							<AvatarFallback>DU</AvatarFallback>
						</Avatar>
						<div className="min-w-0 space-y-1">
							<CardTitle>Design system report</CardTitle>
							<CardDescription>Updated a few seconds ago</CardDescription>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div data-skeleton="media" className="h-28 rounded-md" />
						<Text>Component usage is growing across product surfaces.</Text>
						<Field>
							<Label>Workspace</Label>
							<Input defaultValue="Acme dashboard" />
							<Description>Visible to everyone on your team.</Description>
						</Field>
					</CardContent>
					<CardFooter className="justify-between">
						<Button variant="quiet">Dismiss</Button>
						<Button>Open report</Button>
					</CardFooter>
				</Card>
			</Skeleton>
		</div>
	);
}
