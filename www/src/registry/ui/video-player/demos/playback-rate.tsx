'use client'

import { useRef, useState } from 'react'

import { SettingsIcon } from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { Menu, MenuContent, MenuItem } from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'
import {
  VideoPlayer,
  VideoPlayerControls,
  VideoPlayerFullscreenButton,
  VideoPlayerPlayButton,
  VideoPlayerSeekSlider,
  VideoPlayerTime,
  VideoPlayerVideo,
  VideoPlayerVolume,
} from '@/registry/ui/video-player'

const rates = [0.5, 1, 1.5, 2]

export default function Demo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [rate, setRate] = useState(1)
  return (
    <VideoPlayer className="max-w-xl">
      <VideoPlayerVideo
        ref={videoRef}
        src="https://media.w3.org/2010/05/sintel/trailer.mp4"
        poster="https://media.w3.org/2010/05/sintel/poster.png"
        preload="metadata"
      />
      <VideoPlayerControls>
        <VideoPlayerSeekSlider />
        <div className="flex items-center gap-1">
          <VideoPlayerPlayButton />
          <VideoPlayerVolume />
          <VideoPlayerTime />
          <div className="ml-auto flex items-center gap-1">
            <Menu>
              <Button
                aria-label={`Playback speed: ${rate}x`}
                variant="quiet"
                size="sm"
                isIconOnly
              >
                <SettingsIcon />
              </Button>
              <Popover>
                <MenuContent>
                  {rates.map((value) => (
                    <MenuItem
                      key={value}
                      onAction={() => {
                        if (videoRef.current) {
                          videoRef.current.playbackRate = value
                        }
                        setRate(value)
                      }}
                    >
                      {value === 1 ? 'Normal' : `${value}x`}
                    </MenuItem>
                  ))}
                </MenuContent>
              </Popover>
            </Menu>
            <VideoPlayerFullscreenButton />
          </div>
        </div>
      </VideoPlayerControls>
    </VideoPlayer>
  )
}
