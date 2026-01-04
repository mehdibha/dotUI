import { AccountMenu } from "@dotui/registry/blocks/showcase/cards/components/account-menu";
import { Backlog } from "@dotui/registry/blocks/showcase/cards/components/backlog";
import { Booking } from "@dotui/registry/blocks/showcase/cards/components/booking";
import { ColorEditorCard } from "@dotui/registry/blocks/showcase/cards/components/color-editor";
import { Filters } from "@dotui/registry/blocks/showcase/cards/components/filters";
import { InviteMembers } from "@dotui/registry/blocks/showcase/cards/components/invite-members";
import { LoginForm } from "@dotui/registry/blocks/showcase/cards/components/login-form";
import { Notifications } from "@dotui/registry/blocks/showcase/cards/components/notifications";
import { TeamName } from "@dotui/registry/blocks/showcase/cards/components/team-name";
import { cn } from "@dotui/registry/lib/utils";

export function Cards(props: React.ComponentProps<"div">) {
	return (
		<div {...props} className={cn("grid grid-cols-11 gap-4 p-4 md:p-6", props.className)}>
			<div className="col-span-11 flex gap-4 max-md:flex-col xl:col-span-8">
				<Booking className="w-full max-md:col-span-1 md:w-80" />
				<Filters className="flex-1 max-md:col-span-1" />
			</div>
			<Notifications className="md:contain-[size] col-span-11 max-md:h-100 md:col-span-5 xl:col-span-3" />
			<InviteMembers className="col-span-11 md:col-span-6 lg:col-span-6 xl:col-span-4" />
			<Backlog className="col-span-11 lg:col-span-8 xl:col-span-7" />
			<AccountMenu className="max-lg:hidden lg:col-span-3 lg:block xl:hidden" />
			<div className="col-span-11 grid grid-cols-11 gap-4 lg:items-start">
				<AccountMenu className="col-span-11 min-w-0 sm:col-span-5 lg:hidden xl:col-span-2 xl:block" />
				<LoginForm className="col-span-11 max-w-none sm:col-span-6 lg:hidden" />
				<div className="col-span-11 flex items-start gap-4 max-sm:flex-col max-sm:items-stretch lg:col-span-7 xl:col-span-6">
					<ColorEditorCard className="max-sm:hidden" />
					<TeamName className="flex-1" />
				</div>
				<LoginForm className="hidden w-full max-w-none lg:col-span-4 lg:block xl:col-span-3" />
			</div>
		</div>
	);
}

export default Cards;
