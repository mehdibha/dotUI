import { MinusIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/components/core/default/card";
import { Input } from "@/lib/components/core/default/input";
import { Slider } from "@/lib/components/core/default/slider";
import { Tabs, TabsList, TabsTrigger } from "@/lib/components/core/default/tabs";

export default function Filter() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">Type of place</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Search rooms, entire homes, or any type of place
          </p>
          <Tabs defaultValue="any-type" className="mt-2">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="any-type">Any type</TabsTrigger>
              <TabsTrigger value="room">Room</TabsTrigger>
              <TabsTrigger value="entire-place">Entire place</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div>
          <h3 className="font-semibold">Price range</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Search rooms, entire homes, or any type of place
          </p>
          <Slider defaultValue={[25, 75]} className="mt-2" />
          <div className="mt-4 flex items-center space-x-2">
            <Input type="number" defaultValue={25} className="w-1/2" />
            <MinusIcon strokeWidth={4} className="text-muted-foreground" />
            <Input type="number" defaultValue={75} className="w-1/2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
