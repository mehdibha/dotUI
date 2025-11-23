"use client";
import { ChevronDownIcon, ChevronUpIcon, ExternalLinkIcon } from "lucide-react";

import { Button } from "@dotui/registry/ui/button";
import { Menu, MenuContent, MenuItem } from "@dotui/registry/ui/menu";
import { Popover } from "@dotui/registry/ui/popover";

interface DemoActionsProps {
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

export const DemoActions = ({
  isExpanded,
  onToggleExpanded,
}: DemoActionsProps) => {
  return (
    <>
      <Button
        variant="quiet"
        size="sm"
        className="h-7 gap-1 pr-2 pl-1 text-xs"
        onPress={onToggleExpanded}
      >
        {isExpanded ? (
          <>
            <ChevronUpIcon /> Collapse
          </>
        ) : (
          <>
            <ChevronDownIcon /> Expand
          </>
        )}
      </Button>
      <Menu>
        <Button variant="quiet" size="sm" className="size-7!">
          <ExternalLinkIcon />
        </Button>
        <Popover placement="bottom end">
          <MenuContent className="**:[svg]:size-4">
            <MenuItem>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 147 70"
              >
                <path d="M56 50.203V14h14v46.156C70 65.593 65.593 70 60.156 70c-2.596 0-5.158-1-7-2.843L0 14h19.797L56 50.203ZM147 56h-14V23.953L100.953 56H133v14H96.687C85.814 70 77 61.186 77 50.312V14h14v32.156L123.156 14H91V0h36.312C138.186 0 147 8.814 147 19.688V56Z" />
              </svg>
              Open in v0
            </MenuItem>
            <MenuItem>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                role="img"
                aria-hidden
                focusable={false}
              >
                <path
                  fill="currentColor"
                  d="M15.75 18H4.25C3.01 18 2 16.99 2 15.75V4.25C2 3.01 3.01 2 4.25 2h11.5C16.99 2 18 3.01 18 4.25v11.5c0 1.24-1.01 2.25-2.25 2.25M4.25 3.5c-.414 0-.75.336-.75.75v11.5c0 .414.336.75.75.75h11.5c.414 0 .75-.336.75-.75V4.25c0-.414-.336-.75-.75-.75z"
                />
              </svg>
              Open in CodeSandbox
            </MenuItem>
            <MenuItem>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                role="img"
                focusable={false}
                aria-hidden
              >
                <path
                  d="M9.20215,18.76367c-.18262,0-.37012-.03711-.55078-.11621-.62598-.27051-.94238-.91992-.77051-1.5791l1.17383-4.50586-3.34863.06348c-.52441,0-1.00879-.28418-1.26465-.74121-.25684-.45801-.24512-1.01953.02832-1.4668L9.7002,1.88574c.35547-.58203,1.04297-.80664,1.67383-.53906.62988.26465.95312.91211.78613,1.57422l-1.20508,4.7959,3.33887-.06152c.52734,0,1.01465.28711,1.26953.74902s.23926,1.02637-.04199,1.47266l-5.19141,8.25098c-.25781.40918-.68066.63574-1.12793.63574ZM9.10254,11.12598c.45215,0,.87109.20508,1.14746.5625.27637.3584.37012.81445.25586,1.25195l-.92969,3.56836,4.62695-7.35352h-3.29688c-.4502,0-.86719-.20312-1.14355-.55859-.27637-.35449-.37207-.80859-.2627-1.24512l.96582-3.84473-4.7168,7.69434,3.35352-.0752Z"
                  fill="currentColor"
                  strokeWidth="0"
                />
              </svg>
              Open in StackBlitz
            </MenuItem>
          </MenuContent>
        </Popover>
      </Menu>
    </>
  );
};
