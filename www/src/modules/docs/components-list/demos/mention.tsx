import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Field, Label } from "@/registry/ui/field"
import { MenuContent, MenuItem } from "@/registry/ui/menu"
import { useStyles as useTokenFieldStyles } from "@/registry/ui/token-field/styles"

import { DemoState } from "../demo-state"
import { Surface } from "../overlay"

const PEOPLE = [
  { id: "alex", name: "Alex Miller" },
  { id: "sarah", name: "Sarah Jones" },
  { id: "david", name: "David Kim" },
]

// The field is laid out by hand with the real TokenField styles so the
// suggestions can hang off the trailing `@`, where Mention anchors its popover.
export function MentionDemo() {
  const { input, token } = useTokenFieldStyles()()
  return (
    <DemoState
      states={{
        "[data-menu-item]:first-of-type": [
          "data-hovered",
          "data-focused",
          "data-focus-visible",
        ],
      }}
    >
      <div className="absolute inset-0 flex justify-center px-4 pt-4">
        <Field className="w-full max-w-[17rem]">
          <Label>Comment</Label>
          <div data-rac="" data-focused="" className={input()}>
            cc <span className={token()}>@alex</span>{" "}
            <span className="relative">
              @
              <Surface
                variant="menu"
                className="absolute top-full left-0 mt-2 w-44"
              >
                <MenuContent aria-label="People" items={PEOPLE}>
                  {(person) => (
                    <MenuItem id={person.id} textValue={person.id}>
                      <Avatar size="sm">
                        <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm">{person.name}</span>
                        <span className="text-xs text-fg-muted">
                          @{person.id}
                        </span>
                      </div>
                    </MenuItem>
                  )}
                </MenuContent>
              </Surface>
            </span>
          </div>
        </Field>
      </div>
    </DemoState>
  )
}
