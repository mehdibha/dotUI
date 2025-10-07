import Image from "next/image";
import { BathIcon, BedIcon, LandPlotIcon } from "lucide-react";

import { Avatar } from "@dotui/registry-v2/ui/avatar";
import { Badge } from "@dotui/registry-v2/ui/badge";
import { Button } from "@dotui/registry-v2/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@dotui/registry-v2/ui/card";
import { TextField } from "@dotui/registry-v2/ui/text-field";

export function CardDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 items-start gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <TextField
                  label="Email"
                  placeholder="m@example.com"
                  isRequired
                />
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
                <TextField label="Password" isRequired />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button variant="primary" type="submit" className="w-full">
              Login
            </Button>
            <Button className="w-full">Login with Google</Button>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Meeting Notes</CardTitle>
            <CardDescription>
              Transcript from the meeting with the client.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <p>
              Client requested dashboard redesign with focus on mobile
              responsiveness.
            </p>
            <ol className="mt-4 flex list-decimal flex-col gap-2 pl-6">
              <li>New analytics widgets for daily/weekly metrics</li>
              <li>Simplified navigation menu</li>
              <li>Dark mode support</li>
              <li>Timeline: 6 weeks</li>
              <li>Follow-up meeting scheduled for next Tuesday</li>
            </ol>
          </CardContent>
          <CardFooter>
            <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
              <Avatar src="https://github.com/mehdibha.png" fallback="M" />
              <Avatar src="https://github.com/devongovett.png" fallback="D" />
              <Avatar src="https://github.com/shadcn.png" fallback="S" />
            </div>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Is this an image?</CardTitle>
            <CardDescription>This is a card with an image.</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <Image
              src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
              alt="Photo by Drew Beamer"
              className="aspect-video object-cover"
              width={500}
              height={500}
            />
          </CardContent>
          <CardFooter className="flex items-center gap-2">
            <Badge>
              <BedIcon /> 4
            </Badge>
            <Badge>
              <BathIcon /> 2
            </Badge>
            <Badge>
              <LandPlotIcon /> 350m²
            </Badge>
            <div className="ml-auto font-medium tabular-nums">$135,000</div>
          </CardFooter>
        </Card>
      </div>
      <div className="grid grid-cols-4 items-start gap-4">
        <Card>
          <CardContent className="text-sm">Content Only</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Header Only</CardTitle>
            <CardDescription>
              This is a card with a header and a description.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Header and Content</CardTitle>
            <CardDescription>
              This is a card with a header and a content.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">Content</CardContent>
        </Card>
        <Card>
          <CardFooter className="text-sm">Footer Only</CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Header + Footer</CardTitle>
            <CardDescription>
              This is a card with a header and a footer.
            </CardDescription>
          </CardHeader>
          <CardFooter className="text-sm">Footer</CardFooter>
        </Card>
        <Card>
          <CardContent className="text-sm">Content</CardContent>
          <CardFooter className="text-sm">Footer</CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Header + Footer</CardTitle>
            <CardDescription>
              This is a card with a header and a footer.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">Content</CardContent>
          <CardFooter className="text-sm">Footer</CardFooter>
        </Card>
      </div>
    </div>
  );
}
