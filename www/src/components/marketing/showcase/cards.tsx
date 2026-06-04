import { AccountMenu } from "@/components/marketing/showcase/account-menu";
import { Booking } from "@/components/marketing/showcase/booking";
import { ColorEditorCard } from "@/components/marketing/showcase/color-editor";
import { CookiePreferences } from "@/components/marketing/showcase/cookie-preferences";
import { Faq } from "@/components/marketing/showcase/faq";
import { Feedback } from "@/components/marketing/showcase/feedback";
import { Filters } from "@/components/marketing/showcase/filters";
import { InviteMembers } from "@/components/marketing/showcase/invite-members";
import { LoginForm } from "@/components/marketing/showcase/login-form";
import { Notifications } from "@/components/marketing/showcase/notifications";
import { Payment } from "@/components/marketing/showcase/payment";
import { Shortcuts } from "@/components/marketing/showcase/shortcuts";
import { Storage } from "@/components/marketing/showcase/storage";
import { TeamName } from "@/components/marketing/showcase/team-name";
import { Transactions } from "@/components/marketing/showcase/transactions";
import { TwoFactor } from "@/components/marketing/showcase/two-factor";
import { UploadAvatar } from "@/components/marketing/showcase/upload-avatar";
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
