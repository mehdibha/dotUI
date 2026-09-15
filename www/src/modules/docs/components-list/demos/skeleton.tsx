import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Skeleton } from "@/registry/ui/skeleton"

export function SkeletonDemo() {
  return (
    <Skeleton isLoading>
      <div className="flex items-center gap-3">
        <Avatar size="md">
          <AvatarFallback>DU</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <div data-skeleton="block" className="h-3 w-32 rounded-full" />
          <div data-skeleton="block" className="h-3 w-20 rounded-full" />
        </div>
      </div>
    </Skeleton>
  )
}
