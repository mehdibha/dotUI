import { Avatar, AvatarFallback, AvatarImage } from '@/registry/ui/avatar'
import { Button } from '@/registry/ui/button'
import {
  Notification,
  NotificationActions,
  NotificationContent,
  NotificationDescription,
  NotificationFeed,
  NotificationTime,
  NotificationTitle,
} from '@/registry/ui/notification-feed'

export default function Demo() {
  return (
    <NotificationFeed className="max-w-md">
      <Notification unread>
        <Avatar size="sm">
          <AvatarImage src="https://i.pravatar.cc/80?img=12" alt="Olivia" />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <NotificationContent>
          <NotificationTitle>
            <strong>Olivia Martin</strong> requested your review
          </NotificationTitle>
          <NotificationDescription>
            “Add carousel component” is ready for review.
          </NotificationDescription>
          <NotificationActions>
            <Button variant="primary" size="xs">
              Review
            </Button>
            <Button variant="quiet" size="xs">
              Dismiss
            </Button>
          </NotificationActions>
        </NotificationContent>
        <NotificationTime>5m</NotificationTime>
      </Notification>
      <Notification>
        <Avatar size="sm">
          <AvatarImage src="https://i.pravatar.cc/80?img=33" alt="Jackson" />
          <AvatarFallback>JL</AvatarFallback>
        </Avatar>
        <NotificationContent>
          <NotificationTitle>
            <strong>Jackson Lee</strong> mentioned you
          </NotificationTitle>
          <NotificationDescription>
            “…let&apos;s ship the new tokens.”
          </NotificationDescription>
        </NotificationContent>
        <NotificationTime>1h</NotificationTime>
      </Notification>
    </NotificationFeed>
  )
}
