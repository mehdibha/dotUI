import { AccountMenu } from "@dotui/ui/registry/blocks/application/account-menu/components/account-menu";
import { ColorEditor } from "@dotui/ui/registry/blocks/application/color-editor/components/accent-color-editor";
import { InviteMembers } from "@dotui/ui/registry/blocks/application/invite-members/components/invite-members";
import { Notifications } from "@dotui/ui/registry/blocks/application/notifications/components/notifications";
import { TeamName } from "@dotui/ui/registry/blocks/application/team-name/components/team-name";
import { LoginForm } from "@dotui/ui/registry/blocks/auth/login/components/login-form";
import { Backlog } from "@dotui/ui/registry/blocks/tables/backlog/components/backlog";

import { Booking } from "./booking";
import { Filters } from "./filters";

export function BlocksShowcase() {
  return (
    <div className="grid grid-cols-11 gap-4 p-4 md:p-6">
      <div className="col-span-11 xl:col-span-8 flex gap-4">
        <Booking className="w-80" />
        <Filters className="flex-1" />
      </div>
      <Notifications className="h-118 col-span-11 md:col-span-5 xl:col-span-3" />
      <InviteMembers className="col-span-11 md:col-span-6 lg:col-span-6 xl:col-span-4" />
      <Backlog className="col-span-11 lg:col-span-8 xl:col-span-7" />
      <AccountMenu className="max-lg:hidden lg:col-span-3 lg:block xl:hidden" />
      <div className="col-span-11 grid grid-cols-11 gap-4 lg:items-start">
        <AccountMenu className="col-span-11 min-w-0 sm:col-span-5 lg:hidden xl:col-span-2 xl:block" />
        <LoginForm className="col-span-11 sm:col-span-6 lg:hidden" />
        <div className="col-span-11 flex items-start gap-4 max-sm:flex-col max-sm:items-stretch lg:col-span-7 xl:col-span-6">
          <ColorEditor />
          <TeamName className="flex-1" />
        </div>
        <LoginForm className="hidden w-full max-w-none lg:col-span-4 lg:block xl:col-span-3" />
      </div>
    </div>
  );
}
