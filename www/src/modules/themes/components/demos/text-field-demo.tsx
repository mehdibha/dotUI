import { TextField } from "@/components/dynamic-core/text-field";

export function TextFieldDemo() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-4">
        <TextField placeholder="hello@mehdibha.com" className="w-full" />
        <TextField
          label="Email"
          description="Enter your email"
          className="w-full"
        />
      </div>
      <div className="flex flex-col gap-4">
        <TextField
          aria-label="https://"
          prefix={<span>https://</span>}
          className="w-full"
        />
        <TextField
          aria-label="@dotui.org"
          suffix={<span>@dotui.org</span>}
          className="w-full"
        />
        <TextField
          label="Email"
          isInvalid
          errorMessage="This email is already taken."
          className="w-full"
        />
      </div>
    </div>
  );
}
