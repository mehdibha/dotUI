import { AccountMenu } from "@/registry/blocks/showcase/cards/components/account-menu";
import { Booking } from "@/registry/blocks/showcase/cards/components/booking";
import { ColorEditorCard } from "@/registry/blocks/showcase/cards/components/color-editor";
import { Filters } from "@/registry/blocks/showcase/cards/components/filters";
import { InviteMembers } from "@/registry/blocks/showcase/cards/components/invite-members";
import { LoginForm } from "@/registry/blocks/showcase/cards/components/login-form";
import { Notifications } from "@/registry/blocks/showcase/cards/components/notifications";
import { Pricing } from "@/registry/blocks/showcase/cards/components/pricing";
import { TeamName } from "@/registry/blocks/showcase/cards/components/team-name";
import { cn } from "@/registry/lib/utils";

export function Cards(props: React.ComponentProps<"div">) {
	return (
		<div
			{...props}
			className={cn(
				"columns-1 gap-4 *:mb-4 *:break-inside-avoid sm:columns-2 lg:columns-3 xl:columns-4",
				props.className,
			)}
		>
			<Booking />
			<Filters />
			<Notifications className="h-100" />
			<InviteMembers />
			<Pricing />
			<AccountMenu />
			<ColorEditorCard />
			<TeamName />
			<LoginForm className="max-w-none" />
		</div>
	);
}

export default Cards;
