import { Button } from "@/components/dynamic-core/button";
import { TextArea } from "@/components/dynamic-core/text-area";

export function TextAreaDemo() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-4">
        <TextArea
          label="Description"
          description="Type your description"
          className="w-full"
        />
        <TextArea
          label="Comment"
          isInvalid
          errorMessage="You have exceeded the comment limit for one hour."
          className="w-full"
        />
      </div>
      <div className="flex flex-col gap-4">
        <TextArea
          label="Comment"
          placeholder="type something here"
          className="w-full"
          prefix={
            <div className="flex items-center gap-1">
              <Button
                variant="quiet"
                shape="square"
                size="sm"
                className="size-7"
              >
                👍
              </Button>
              <Button
                variant="quiet"
                shape="square"
                size="sm"
                className="size-7"
              >
                ❤️
              </Button>
            </div>
          }
          suffix={
            <div className="flex items-center justify-end">
              <Button variant="primary" size="sm" className="h-7">
                Comment
              </Button>
            </div>
          }
        />
        <TextArea label="Comment" isDisabled className="w-full" />
      </div>
    </div>
  );
}
