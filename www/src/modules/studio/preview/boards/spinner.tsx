"use client"

import { SearchIcon } from "@/registry/icons"
import { Button } from "@/registry/ui/button"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { ListBox, ListBoxItem } from "@/registry/ui/list-box"
import { Loader } from "@/registry/ui/loader"
import { TextField } from "@/registry/ui/text-field"

import { Board, BoardSection } from "./board"

const SIZES = ["size-4", "size-5", "size-6", "size-8", "size-10", "size-12"]

export default function SpinnerBoard() {
  return (
    <Board id="spinner">
      <BoardSection title="Sizes" className="justify-evenly gap-8">
        {SIZES.map((size) => (
          <Loader key={size} aria-label="Loading" className={size} />
        ))}
      </BoardSection>
      <BoardSection
        title="In context"
        className="grid grid-cols-1 items-center gap-8 md:grid-cols-3"
      >
        <div className="flex flex-wrap justify-center gap-4">
          <Button isDisabled>
            <Loader />
            Saving…
          </Button>
          <Button variant="primary" isPending>
            Deploy
          </Button>
        </div>
        <TextField
          aria-label="Search"
          defaultValue="Quarterly report"
          className="w-full"
        >
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <Input />
            <InputGroupAddon>
              <Loader aria-label="Searching" />
            </InputGroupAddon>
          </InputGroup>
        </TextField>
        <ListBox
          aria-label="Projects"
          isLoading
          onLoadMore={() => {}}
          className="w-full"
        >
          <ListBoxItem>Acme web</ListBoxItem>
          <ListBoxItem>Billing API</ListBoxItem>
          <ListBoxItem>Docs</ListBoxItem>
        </ListBox>
      </BoardSection>
    </Board>
  )
}
