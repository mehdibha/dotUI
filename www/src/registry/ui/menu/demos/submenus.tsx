import { MenuIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Menu, MenuContent, MenuItem, MenuSub } from "@/registry/ui/menu";
import { Popover } from "@/registry/ui/popover";

export default function Demo() {
	return (
		<Menu>
			<Button variant="default" isIconOnly>
				<MenuIcon />
			</Button>
			<Popover>
				<MenuContent>
					<MenuItem>Account settings</MenuItem>
					<MenuSub>
						<MenuItem>Invite users</MenuItem>
						<Popover>
							<MenuContent>
								<MenuItem>SMS</MenuItem>
								<MenuItem>Twitter</MenuItem>
								<MenuSub>
									<MenuItem>Email</MenuItem>
									<Popover>
										<MenuContent>
											<MenuItem>Work</MenuItem>
											<MenuItem>Personal</MenuItem>
										</MenuContent>
									</Popover>
								</MenuSub>
							</MenuContent>
						</Popover>
					</MenuSub>
				</MenuContent>
			</Popover>
		</Menu>
	);
}
