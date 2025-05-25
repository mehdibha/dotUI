"use client";

import React from "react";
import { EllipsisIcon } from "lucide-react";
import { Link } from "react-aria-components";
import { useMounted } from "@/hooks/use-mounted";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogRoot, Dialog, DialogFooter } from "@/components/ui/dialog";
import { Menu, MenuItem, MenuRoot } from "@/components/ui/menu";
import { Skeleton } from "@/components/ui/skeleton";
import { StyleProvider } from "@/modules/styles/components/style-provider";
import { type Style } from "@/modules/styles/types";
import { CreateThemeDialog } from "./create-style-dialog";

export function StyleCard({
  style,
  isClonable = true,
  isCurrent = false,
  onDelete,
  onSetCurrent,
}: {
  style: Style;
  isCurrent?: boolean;
  isClonable?: boolean;
  onSetCurrent?: () => void;
  onDelete?: () => void;
}) {
  const isMounted = useMounted();
  const [isOpen, setOpen] = React.useState(false);
  const [isCloneOpen, setCloneOpen] = React.useState(false);

  return (
    <Skeleton show={!isMounted}>
      <StyleProvider
        key={style.name}
        style={style}
        mode="site"
        className="text-fg relative"
      >
        <div className="bg-bg flex flex-col items-start justify-start gap-0 overflow-hidden rounded-md border">
          <Link
            aria-label={`Open style ${style.label}`}
            href={`/styles/${style.name}`}
            className="z-1 absolute inset-0"
          />
          <div className="w-full p-2">
            <div className="flex w-full items-center justify-between">
              <h6 className="flex items-center gap-2 text-lg font-semibold">
                <span>{style.label}</span>
                {isCurrent && <Badge className="border">current style</Badge>}
              </h6>
              <MenuRoot>
                <Button
                  variant="quiet"
                  shape="square"
                  size="sm"
                  className="isolate z-10 size-7"
                  aria-label="Open theme options"
                >
                  <EllipsisIcon className="z-2" />
                </Button>
                <Menu>
                  {onSetCurrent && (
                    <MenuItem id="set-default" onAction={onSetCurrent}>
                      Set current style
                    </MenuItem>
                  )}
                  {isClonable && (
                    <MenuItem id="clone" onAction={() => setCloneOpen(true)}>
                      Clone
                    </MenuItem>
                  )}
                  {onDelete && (
                    <MenuItem
                      id="delete"
                      variant="danger"
                      onAction={() => setOpen(true)}
                    >
                      Delete
                    </MenuItem>
                  )}
                </Menu>
              </MenuRoot>
              {onDelete && (
                <DialogRoot isOpen={isOpen} onOpenChange={setOpen}>
                  <Dialog
                    title="Delete theme"
                    description="This theme will be deleted, along with all of its configuration."
                  >
                    <Alert variant="danger">
                      This action is not reversible. Please be certain.
                    </Alert>
                    <DialogFooter>
                      <Button slot="close">Cancel</Button>
                      <Button variant="danger" onPress={onDelete}>
                        Delete
                      </Button>
                    </DialogFooter>
                  </Dialog>
                </DialogRoot>
              )}
            </div>
            {/* <p className="text-fg-muted block text-sm">
              {theme.foundations.dark && theme.foundations.light ? (
                <span>Light and dark mode.</span>
              ) : (
                <span>
                  {theme.foundations.dark ? "Dark" : "Light"} mode only.
                </span>
              )}
            </p> */}
          </div>
          <div className="grid w-full grid-cols-10">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: `var(--neutral-${(i + 1) * 100})`,
                }}
                className="h-4"
              ></div>
            ))}
          </div>
          <div className="grid w-full grid-cols-10">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: `var(--accent-${(i + 1) * 100})`,
                }}
                className="h-4"
              ></div>
            ))}
          </div>
        </div>
      </StyleProvider>
    </Skeleton>
  );
}
