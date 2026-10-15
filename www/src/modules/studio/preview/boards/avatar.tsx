"use client"

import { cn } from "@/registry/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/registry/ui/avatar"

import { Board, BoardSection, Specimen, useBoardFocus } from "./board"
import { PEOPLE, PersonAvatar } from "./display-parts"

const SIZES = ["sm", "md", "lg"] as const

const INITIALS = ["JL", "AK", "SR"]

// Image and fallback columns line up across both sections.
const COLUMNS = "grid w-full max-w-md grid-cols-2 items-end gap-x-6"
const ROW = "flex h-10 items-center gap-3"

export default function AvatarBoard() {
  const { axis } = useBoardFocus()
  const image = cn(
    "transition-opacity duration-300",
    axis === "avatarFallback" && "opacity-35",
  )
  return (
    <Board id="avatar">
      <BoardSection title="Sizes">
        <div className={COLUMNS}>
          <Specimen label="Image" className={image}>
            <div className={ROW}>
              {SIZES.map((size) => (
                <PersonAvatar key={size} person={PEOPLE[0]} size={size} />
              ))}
            </div>
          </Specimen>
          <Specimen label="Fallback">
            <div className={ROW}>
              {SIZES.map((size) => (
                <Avatar key={size} size={size}>
                  <AvatarFallback>JL</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </Specimen>
        </div>
      </BoardSection>
      <BoardSection title="Group">
        <div className={COLUMNS}>
          <Specimen label="Image" className={image}>
            <AvatarGroup className="h-10 items-center">
              {PEOPLE.map((person) => (
                <PersonAvatar key={person.github} person={person} />
              ))}
              <AvatarGroupCount>+4</AvatarGroupCount>
            </AvatarGroup>
          </Specimen>
          <Specimen label="Fallback">
            <AvatarGroup className="h-10 items-center">
              {INITIALS.map((initials) => (
                <Avatar key={initials}>
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              ))}
              <AvatarGroupCount>+4</AvatarGroupCount>
            </AvatarGroup>
          </Specimen>
        </div>
      </BoardSection>
    </Board>
  )
}
