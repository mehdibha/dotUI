import { Avatar, AvatarFallback, AvatarImage } from '@/registry/ui/avatar'
import { Button } from '@/registry/ui/button'
import {
  Comment,
  CommentActions,
  CommentAuthor,
  CommentBody,
  CommentContent,
  CommentHeader,
  CommentThread,
  CommentTimestamp,
} from '@/registry/ui/comment-thread'

export default function Demo() {
  return (
    <CommentThread className="w-full max-w-md">
      <Comment>
        <Avatar size="sm">
          <AvatarImage src="https://i.pravatar.cc/80?img=1" alt="Sofia Davis" />
          <AvatarFallback>SD</AvatarFallback>
        </Avatar>
        <CommentContent>
          <CommentHeader>
            <CommentAuthor>Sofia Davis</CommentAuthor>
            <CommentTimestamp>2h ago</CommentTimestamp>
          </CommentHeader>
          <CommentBody>
            This pattern is exactly what we needed. Shipping it.
          </CommentBody>
          <CommentActions>
            <Button variant="quiet" size="xs">
              Reply
            </Button>
            <Button variant="quiet" size="xs">
              Like
            </Button>
          </CommentActions>
          <CommentThread>
            <Comment>
              <Avatar size="sm">
                <AvatarImage
                  src="https://i.pravatar.cc/80?img=5"
                  alt="Max Leiter"
                />
                <AvatarFallback>ML</AvatarFallback>
              </Avatar>
              <CommentContent>
                <CommentHeader>
                  <CommentAuthor>Max Leiter</CommentAuthor>
                  <CommentTimestamp>1h ago</CommentTimestamp>
                </CommentHeader>
                <CommentBody>Agreed — clean composition.</CommentBody>
              </CommentContent>
            </Comment>
          </CommentThread>
        </CommentContent>
      </Comment>
    </CommentThread>
  )
}
