import * as React from "react";
import { ScrollArea } from "@/lib/components/core/default/scroll-area";

export default function ScrollAreaDemo() {
  return (
    <div className="rounded-md border p-6">
      <ScrollArea orientation="horizontal" className="h-52 w-72" type="always">
        <div className="flex w-[700px] gap-4 p-2">
          <p>
            Three fundamental aspects of typography are legibility, readability, and
            aesthetics. Although in a non-technical sense "legible" and "readable" are
            often used synonymously, typographically they are separate but related
            concepts.
          </p>
          <p>
            Legibility describes how easily individual characters can be distinguished
            from one another. It is described by Walter Tracy as “the quality of being
            decipherable and recognisable”. For instance, if a “b” and an “h”, or a “3”
            and an “8”, are difficult to distinguish at small sizes, this is a problem of
            legibility.
          </p>
        </div>
      </ScrollArea>
    </div>
  );
}
