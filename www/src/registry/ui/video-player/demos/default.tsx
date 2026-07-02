import { VideoPlayer } from '@/registry/ui/video-player'

export default function Demo() {
  return (
    <VideoPlayer
      className="max-w-xl"
      src="https://www.w3schools.com/html/mov_bbb.mp4"
      poster="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80"
    />
  )
}
