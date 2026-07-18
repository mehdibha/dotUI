'use client'

import { useEffect, useRef } from 'react'
import Hls from 'hls.js'

import {
  VideoPlayer,
  VideoPlayerControls,
  VideoPlayerVideo,
} from '@/registry/ui/video-player'

const src = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'

export default function Demo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
      return
    }
    const hls = new Hls()
    hls.loadSource(src)
    hls.attachMedia(video)
    return () => hls.destroy()
  }, [])

  return (
    <VideoPlayer className="max-w-xl">
      <VideoPlayerVideo ref={videoRef} />
      <VideoPlayerControls />
    </VideoPlayer>
  )
}
