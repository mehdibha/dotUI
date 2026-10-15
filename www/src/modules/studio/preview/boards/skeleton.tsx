"use client"

import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import { Skeleton } from "@/registry/ui/skeleton"

import { Board, BoardSection } from "./board"

const TEXT = "box-decoration-clone"

const PEOPLE = [
  { initials: "MK", name: "Maya Kim", email: "maya@acme.com", role: "Owner" },
  {
    initials: "JO",
    name: "Jonas Ortega",
    email: "jonas@acme.com",
    role: "Admin",
  },
  {
    initials: "AL",
    name: "Ada Lindqvist",
    email: "ada@acme.com",
    role: "Member",
  },
  { initials: "RB", name: "Ravi Bose", email: "ravi@acme.com", role: "Guest" },
]

const MEDIA = [
  { title: "Designing with tokens", meta: "12 min · 2.4k views" },
  { title: "Motion that feels right", meta: "8 min · 980 views" },
  { title: "Color, from scratch", meta: "21 min · 5.1k views" },
  { title: "Shipping a theme", meta: "6 min · 640 views" },
]

export default function SkeletonBoard() {
  return (
    <Board id="skeleton">
      <div className="grid gap-8 md:grid-cols-2">
        <BoardSection title="Card" className="flex-1">
          <Skeleton isLoading className="w-full">
            <Card>
              <CardHeader className="flex flex-row items-center gap-3">
                <Avatar size="lg">
                  <AvatarFallback>MK</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col items-start gap-1">
                  <CardTitle>Maya Kim</CardTitle>
                  <CardDescription>Product designer</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="text-sm">
                <span data-skeleton="text" className={TEXT}>
                  Leads the design system and the studio's onboarding, from the
                  first token to the last release.
                </span>
              </CardContent>
              <CardFooter className="justify-end gap-2">
                <Button variant="quiet">Message</Button>
                <Button variant="primary">Follow</Button>
              </CardFooter>
            </Card>
          </Skeleton>
        </BoardSection>
        <BoardSection title="List" className="flex-1">
          <Skeleton isLoading className="w-full">
            <ul className="divide-y rounded-(--studio-radius-card) border bg-card">
              {PEOPLE.map((person) => (
                <li
                  key={person.email}
                  className="flex items-center gap-3 px-4 py-2.5"
                >
                  <Avatar size="sm">
                    <AvatarFallback>{person.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
                    <span data-skeleton="text" className="text-sm font-medium">
                      {person.name}
                    </span>
                    <span data-skeleton="text" className="text-xs">
                      {person.email}
                    </span>
                  </div>
                  <Badge>{person.role}</Badge>
                </li>
              ))}
            </ul>
          </Skeleton>
        </BoardSection>
      </div>
      <BoardSection title="Media" className="block">
        <Skeleton
          isLoading
          className="grid w-full grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-4"
        >
          {MEDIA.map((item) => (
            <div key={item.title} className="flex flex-col items-start gap-1.5">
              <div
                data-skeleton="media"
                className="mb-1 aspect-video w-full rounded-(--studio-radius-card)"
              />
              <span
                data-skeleton="text"
                className="max-w-full truncate text-sm font-medium"
              >
                {item.title}
              </span>
              <span
                data-skeleton="text"
                className="max-w-full truncate text-xs"
              >
                {item.meta}
              </span>
            </div>
          ))}
        </Skeleton>
      </BoardSection>
    </Board>
  )
}
