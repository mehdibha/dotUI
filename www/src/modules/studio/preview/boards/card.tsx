"use client"

import { Button } from "@/registry/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"

import { Board, BoardSection } from "./board"
import { PEOPLE, PersonAvatar } from "./display-parts"

export default function CardBoard() {
  return (
    <Board id="card">
      <BoardSection title="In context" className="block">
        <div className="grid gap-6 @xl/section:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Team members</CardTitle>
              <CardDescription>3 of 5 seats used</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3">
              {PEOPLE.map((person, i) => (
                <div key={person.github} className="flex items-center gap-3">
                  <PersonAvatar person={person} size="sm" />
                  <span className="min-w-0 flex-1 truncate">{person.name}</span>
                  <span className="text-fg-muted">
                    {i === 0 ? "Owner" : "Member"}
                  </span>
                </div>
              ))}
            </CardContent>
            <CardFooter className="justify-between gap-4">
              <span className="text-fg-muted">2 seats left</span>
              <Button size="sm" variant="secondary">
                Invite
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pro plan</CardTitle>
              <CardDescription>Renews on November 1</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-3">
                <dt className="text-fg-muted">Requests</dt>
                <dd className="text-right tabular-nums">1.2M of 2M</dd>
                <dt className="text-fg-muted">Bandwidth</dt>
                <dd className="text-right tabular-nums">48 GB of 100 GB</dd>
                <dt className="text-fg-muted">Next invoice</dt>
                <dd className="text-right tabular-nums">$60.00</dd>
              </dl>
            </CardContent>
            <CardFooter className="gap-2">
              <span className="me-auto text-fg-muted">Billed yearly</span>
              <Button size="sm" variant="quiet">
                Invoices
              </Button>
              <Button size="sm" variant="primary">
                Upgrade
              </Button>
            </CardFooter>
          </Card>
        </div>
      </BoardSection>
    </Board>
  )
}
