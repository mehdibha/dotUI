import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import { Skeleton } from "@/registry/ui/skeleton"

export function SkeletonDemo() {
  return (
    <Skeleton isLoading>
      <Card className="w-64">
        <CardHeader className="flex flex-row items-center gap-3">
          <Avatar>
            <AvatarFallback>DU</AvatarFallback>
          </Avatar>
          <div className="min-w-0 space-y-1">
            <CardTitle>Design system report</CardTitle>
            <CardDescription>Updated a few seconds ago</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p>Component usage is growing across product surfaces.</p>
        </CardContent>
      </Card>
    </Skeleton>
  )
}
