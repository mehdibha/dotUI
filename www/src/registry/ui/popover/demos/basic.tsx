import { InfoIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/registry/ui/dialog";
import { Popover } from "@/registry/ui/popover";

export default function Demo() {
	return (
		<Dialog>
			<Button aria-label="Help" isIconOnly>
				<InfoIcon />
			</Button>
			<Popover>
				<DialogContent className="w-56 space-y-4">
					<DialogTitle>Need help?</DialogTitle>
					<p>If you&apos;re having issues accessing your account, contact our customer support team for help.</p>
				</DialogContent>
			</Popover>
		</Dialog>
	);
}
