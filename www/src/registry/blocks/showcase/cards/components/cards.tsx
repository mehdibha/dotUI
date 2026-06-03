import { AccountMenu } from "@/registry/blocks/showcase/cards/components/account-menu";
import { Booking } from "@/registry/blocks/showcase/cards/components/booking";
import { ColorEditorCard } from "@/registry/blocks/showcase/cards/components/color-editor";
import { CookiePreferences } from "@/registry/blocks/showcase/cards/components/cookie-preferences";
import { Faq } from "@/registry/blocks/showcase/cards/components/faq";
import { Feedback } from "@/registry/blocks/showcase/cards/components/feedback";
import { Filters } from "@/registry/blocks/showcase/cards/components/filters";
import { InviteMembers } from "@/registry/blocks/showcase/cards/components/invite-members";
import { LoginForm } from "@/registry/blocks/showcase/cards/components/login-form";
import { Notifications } from "@/registry/blocks/showcase/cards/components/notifications";
import { Payment } from "@/registry/blocks/showcase/cards/components/payment";
import { Shortcuts } from "@/registry/blocks/showcase/cards/components/shortcuts";
import { Storage } from "@/registry/blocks/showcase/cards/components/storage";
import { TeamName } from "@/registry/blocks/showcase/cards/components/team-name";
import { Transactions } from "@/registry/blocks/showcase/cards/components/transactions";
import { TwoFactor } from "@/registry/blocks/showcase/cards/components/two-factor";
import { UploadAvatar } from "@/registry/blocks/showcase/cards/components/upload-avatar";
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
			<TwoFactor />
			<Filters />
			<Storage />
			<Notifications className="h-100" />
			<CookiePreferences />
			<InviteMembers />
			<Shortcuts />
			<Payment />
			<Transactions />
			<AccountMenu />
			<Faq />
			<ColorEditorCard />
			<UploadAvatar />
			<TeamName />
			<Feedback />
			<LoginForm className="max-w-none" />
		</div>
	);
}

export default Cards;
