import { AccountMenu } from "@dotui/ui/registry/blocks/application/account-menu/components/account-menu";
import { ColorEditor } from "@dotui/ui/registry/blocks/application/color-editor/components/accent-color-editor";
import { InviteMembers } from "@dotui/ui/registry/blocks/application/invite-members/components/invite-members";
import { Notifications } from "@dotui/ui/registry/blocks/application/notifications-01/components/notifications";
import { TeamName } from "@dotui/ui/registry/blocks/application/team-name/components/team-name";
import { LoginForm } from "@dotui/ui/registry/blocks/auth/login-01/components/login-form";
import { Booking } from "@dotui/ui/registry/blocks/calendars/booking/components/booking";
import { Backlog } from "@dotui/ui/registry/blocks/tables/backlog/components/backlog";

export function BlocksShowcase() {
  return (
    <div className="grid grid-cols-11 gap-4 p-6">
      <Booking className="col-span-8" />
      <Notifications className="col-span-3" />
      <InviteMembers className="col-span-4" />
      <Backlog className="col-span-7" />
      <div className="col-span-11 grid grid-cols-11 items-start gap-4">
        <AccountMenu className="col-span-2" />
        <div className="col-span-6 flex items-start justify-between gap-4">
          <ColorEditor />
          <div className="flex flex-1 flex-col gap-4">
            <TeamName />
          </div>
        </div>
        <LoginForm className="col-span-3" />
      </div>
    </div>
  );
}
