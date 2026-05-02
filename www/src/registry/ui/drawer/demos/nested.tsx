"use client";

import { Button } from "@/registry/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogHeading } from "@/registry/ui/dialog";
import { Drawer, DrawerHandle } from "@/registry/ui/drawer";

/**
 * Nested drawers — open a drawer from inside another drawer. The parent
 * scales/translates back so the new one stacks on top, just like the page
 * indents when the first drawer opens.
 */
export default function Demo() {
	return (
		<Dialog>
			<Button>Open parent drawer</Button>
			<Drawer>
				<DialogContent>
					<DrawerHandle />
					<DialogHeader>
						<DialogHeading>Parent drawer</DialogHeading>
					</DialogHeader>
					<DialogBody>
						<p>Open the child drawer below — this one should scale back.</p>
					</DialogBody>
					<DialogFooter>
						<Dialog>
							<Button>Open child drawer</Button>
							<Drawer>
								<DialogContent>
									<DrawerHandle />
									<DialogHeader>
										<DialogHeading>Child drawer</DialogHeading>
									</DialogHeader>
									<DialogBody>
										<p>Drag me down or click outside to close just this one.</p>
										<p className="mt-2 text-fg-muted text-sm">
											The parent stays open underneath.
										</p>
									</DialogBody>
									<DialogFooter>
										<Dialog>
											<Button variant="outline">Open grandchild</Button>
											<Drawer>
												<DialogContent>
													<DrawerHandle />
													<DialogHeader>
														<DialogHeading>Grandchild</DialogHeading>
													</DialogHeader>
													<DialogBody>
														<p>Three levels deep. Each parent scales further back.</p>
													</DialogBody>
												</DialogContent>
											</Drawer>
										</Dialog>
									</DialogFooter>
								</DialogContent>
							</Drawer>
						</Dialog>
					</DialogFooter>
				</DialogContent>
			</Drawer>
		</Dialog>
	);
}
