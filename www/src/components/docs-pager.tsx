import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { docsConfig } from "@/config/docs-config";
import { Button } from "@/registry/ui/default/core/button";

export const DocsPager = ({ currentPagePath }: { currentPagePath: string }) => {
  const flattenedItems = docsConfig.nav
    .flatMap(
      (section) =>
        section.items?.flatMap((item) =>
          "items" in item ? item.items : item
        ) ?? []
    )
    .filter(
      (item): item is { href: string; title: string } =>
        item?.href !== undefined
    );

  const currentIndex = flattenedItems.findIndex(
    (item) => item.href === currentPagePath
  );
  const prevPage = currentIndex > 0 ? flattenedItems[currentIndex - 1] : null;
  const nextPage =
    currentIndex < flattenedItems.length - 1
      ? flattenedItems[currentIndex + 1]
      : null;

  return (
    <div className="flex items-center justify-between">
      {prevPage ? (
        <Button
          href={prevPage.href}
          prefix={<ChevronLeftIcon />}
          variant="quiet"
          size="sm"
        >
          {prevPage.title}
        </Button>
      ) : (
        <div /> // Empty div to maintain layout when there's no previous page
      )}
      {nextPage ? (
        <Button
          href={nextPage.href}
          suffix={<ChevronRightIcon />}
          variant="quiet"
          size="sm"
        >
          {nextPage.title}
        </Button>
      ) : (
        <div /> // Empty div to maintain layout when there's no next page
      )}
    </div>
  );
};
