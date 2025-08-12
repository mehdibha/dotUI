import { AccountMenu } from "@dotui/ui/registry/blocks/application/account-menu/components/account-menu";
import { ColorEditor } from "@dotui/ui/registry/blocks/application/color-editor/components/accent-color-editor";
import { InviteMembers } from "@dotui/ui/registry/blocks/application/invite-members/components/invite-members";
import { Notifications } from "@dotui/ui/registry/blocks/application/notifications/components/notifications";
import { TeamName } from "@dotui/ui/registry/blocks/application/team-name/components/team-name";
import { LoginForm } from "@dotui/ui/registry/blocks/auth/login/components/login-form";
import { Booking } from "@dotui/ui/registry/blocks/calendars/booking/components/booking";
import { Backlog } from "@dotui/ui/registry/blocks/tables/backlog/components/backlog";

export function BlocksShowcase() {
  return (
    <div className="grid grid-cols-11 gap-4 p-4 md:p-6">
      <Booking className="col-span-11 xl:col-span-8" />
      <Notifications className="col-span-11 md:col-span-4 lg:col-span-5 xl:col-span-3" />
      <InviteMembers className="col-span-11 md:col-span-7 lg:col-span-6 xl:col-span-4" />
      <Backlog className="col-span-11 lg:col-span-8 xl:col-span-7" />
      <AccountMenu className="max-lg:hidden lg:col-span-3 lg:block xl:hidden" />
      <div className="col-span-11 grid grid-cols-11 gap-4 lg:items-start">
        <AccountMenu className="col-span-11 sm:col-span-5 lg:hidden xl:col-span-2 xl:block" />
        <LoginForm className="col-span-11 sm:col-span-6 lg:hidden" />
        <div className="col-span-11 flex items-start gap-4 max-sm:flex-col max-sm:items-stretch lg:col-span-7 xl:col-span-6">
          <ColorEditor />
          <TeamName className="flex-1" />
        </div>
        <LoginForm className="hidden lg:col-span-4 lg:block xl:col-span-3" />
      </div>
    </div>
  );
}
