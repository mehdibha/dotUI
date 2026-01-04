import { MenuIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { Menu, MenuContent, MenuItem, MenuSub } from "@dotui/registry/ui/menu";
import { Popover } from "@dotui/registry/ui/popover";

export default function Demo() {
	return (
		<Menu>
			<Button variant="default" aspect="square">
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
