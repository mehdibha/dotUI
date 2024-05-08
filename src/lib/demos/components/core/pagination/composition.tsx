import {
  PaginationRoot,
  PaginationList,
  PaginationEllipsis,
  PaginationPage,
  PaginationNext,
  PaginationPrevious,
} from "@/lib/components/core/default/pagination";

export default function PaginationDemo() {
  return (
    <PaginationRoot>
      <PaginationList>
        <PaginationPrevious>Back</PaginationPrevious>
        <PaginationPage>1</PaginationPage>
        <PaginationPage isActive>2</PaginationPage>
        <PaginationPage>3</PaginationPage>
        <PaginationEllipsis />
        <PaginationNext />
      </PaginationList>
    </PaginationRoot>
  );
}
