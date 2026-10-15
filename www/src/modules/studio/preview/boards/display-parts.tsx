"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/registry/ui/avatar"

export const PEOPLE = [
  { name: "Mehdi Ben Hadj Ali", initials: "MB", github: "mehdibha" },
  { name: "Tanner Linsley", initials: "TL", github: "tannerlinsley" },
  { name: "Devon Govett", initials: "DG", github: "devongovett" },
] as const

export function PersonAvatar({
  person,
  size,
  children,
}: {
  person: (typeof PEOPLE)[number]
  size?: "sm" | "md" | "lg"
  children?: React.ReactNode
}) {
  return (
    <Avatar size={size}>
      <AvatarImage
        src={`https://github.com/${person.github}.png`}
        alt={person.name}
      />
      <AvatarFallback>{person.initials}</AvatarFallback>
      {children}
    </Avatar>
  )
}
