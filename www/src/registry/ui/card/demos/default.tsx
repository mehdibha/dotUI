import { Button } from '@/registry/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/registry/ui/card'

export default function Demo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Default Card</CardTitle>
        <CardDescription>This card uses the default spacing.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          The card component provides a simple container with header, content,
          and footer sections.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="default" className="w-full">
          Action
        </Button>
      </CardFooter>
    </Card>
  )
}
