import { CaptionsIcon } from "@/registry/__generated__/icons"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/registry/ui/avatar"
import { Button } from "@/registry/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"

export function CardDemo() {
  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Meeting notes</CardTitle>
        <CardDescription>Transcript from the client call.</CardDescription>
        <CardAction>
          <Button variant="secondary" size="sm">
            <CaptionsIcon />
            Transcribe
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>
          Client requested a dashboard redesign with a focus on mobile
          responsiveness. Timeline: 6 weeks.
        </p>
      </CardContent>
      <CardFooter className="justify-between">
        <AvatarGroup>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src="https://github.com/maxleiter.png"
              alt="@maxleiter"
            />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src="https://github.com/evilrabbit.png"
              alt="@evilrabbit"
            />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+8</AvatarGroupCount>
        </AvatarGroup>
        <Button variant="primary" size="sm">
          Open
        </Button>
      </CardFooter>
    </Card>
  )
}
