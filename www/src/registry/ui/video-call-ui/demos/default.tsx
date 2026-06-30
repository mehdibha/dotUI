'use client'

import * as React from 'react'
import {
  MicIcon,
  MicOffIcon,
  MonitorUpIcon,
  VideoIcon,
  VideoOffIcon,
} from 'lucide-react'

import {
  VideoCallControlButton,
  VideoCallControls,
  VideoCallLeaveButton,
  VideoCallTile,
  VideoCallUI,
} from '@/registry/ui/video-call-ui'

const participants = [
  {
    id: '1',
    name: 'Mehdi Ben Hadj Ali',
    poster:
      'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=640&q=80',
    isMuted: false,
    isCameraOff: false,
  },
  {
    id: '2',
    name: 'Jorge Zreik',
    poster:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=640&q=80',
    isMuted: true,
    isCameraOff: false,
  },
  {
    id: '3',
    name: 'Pranathi P',
    poster: undefined,
    isMuted: false,
    isCameraOff: true,
  },
  {
    id: '4',
    name: 'Max Leiter',
    poster:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=640&q=80',
    isMuted: true,
    isCameraOff: false,
  },
]

export default function Demo() {
  const [micOn, setMicOn] = React.useState(true)
  const [cameraOn, setCameraOn] = React.useState(true)
  const [sharing, setSharing] = React.useState(false)

  return (
    <VideoCallUI className="w-full max-w-2xl">
      {participants.map((participant) => (
        <VideoCallTile
          key={participant.id}
          name={participant.name}
          poster={participant.poster}
          isMuted={participant.isMuted}
          isCameraOff={participant.isCameraOff}
        />
      ))}
      <VideoCallControls className="col-span-full">
        <VideoCallControlButton
          isActive={micOn}
          aria-label={micOn ? 'Mute microphone' : 'Unmute microphone'}
          onPress={() => setMicOn((prev) => !prev)}
        >
          {micOn ? <MicIcon /> : <MicOffIcon />}
        </VideoCallControlButton>
        <VideoCallControlButton
          isActive={cameraOn}
          aria-label={cameraOn ? 'Turn off camera' : 'Turn on camera'}
          onPress={() => setCameraOn((prev) => !prev)}
        >
          {cameraOn ? <VideoIcon /> : <VideoOffIcon />}
        </VideoCallControlButton>
        <VideoCallControlButton
          isActive={!sharing}
          variant={sharing ? 'primary' : 'default'}
          aria-label={sharing ? 'Stop sharing screen' : 'Share screen'}
          onPress={() => setSharing((prev) => !prev)}
        >
          <MonitorUpIcon />
        </VideoCallControlButton>
        <VideoCallLeaveButton />
      </VideoCallControls>
    </VideoCallUI>
  )
}
