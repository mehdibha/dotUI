import Link from "next/link";
import { ArrowLeftIcon, PenIcon, SaveIcon } from "lucide-react";
import { Button } from "@/components/core/button";
import { Dialog, DialogRoot } from "@/components/core/dialog";
import { ToggleButton } from "@/components/core/toggle-button";
import { Tooltip } from "@/components/core/tooltip";
import { PreviewContent } from "../../preview";

interface ThemeHeaderProps {
  isEditMode: boolean;
  setEditMode: (value: boolean) => void;
}

export function ThemeHeader({ isEditMode, setEditMode }: ThemeHeaderProps) {
  return (
    <div className="max-lg:bg-bg max-lg:sticky max-lg:top-[57px] max-lg:z-10 max-lg:border-b max-lg:p-4">
      <Link
        href="/themes"
        className="text-fg-muted hover:text-fg flex cursor-pointer items-center gap-1 text-sm"
      >
        <ArrowLeftIcon className="size-4" />
        <span>themes</span>
      </Link>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold tracking-tight">Forest</h2>
        <div className="flex items-center gap-2">
          <DialogRoot>
            <Button className="xl:hidden">Preview</Button>
            <Dialog type="drawer" className="h-[80svh] p-0">
              <PreviewContent
                themeName="minimalist"
                collapsible={false}
                resizable={false}
              />
            </Dialog>
          </DialogRoot>
          {isEditMode && (
            <Button shape="square" isDisabled>
              <SaveIcon />
            </Button>
          )}
          <Tooltip content="Edit mode" variant="inverse" showArrow>
            <ToggleButton
              isSelected={isEditMode}
              onChange={setEditMode}
              prefix={<PenIcon />}
              variant="primary"
              shape="rectangle"
            >
              Edit mode
            </ToggleButton>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
