import { Button } from "@/registry/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import { Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import { TextField } from "@/registry/ui/text-field"

export function CardDemo() {
  return (
    <div className="absolute inset-0 flex items-start justify-center px-4 pt-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create project</CardTitle>
          <CardDescription>
            Deploy your new project in one click.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <TextField className="w-full">
            <Label>Name</Label>
            <Input placeholder="my-app" />
          </TextField>
          <TextField className="w-full">
            <Label>Framework</Label>
            <Input placeholder="Next.js" />
          </TextField>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button variant="quiet">Cancel</Button>
          <Button variant="primary">Create</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
