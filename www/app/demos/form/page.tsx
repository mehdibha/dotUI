import { Button } from "@dotui/registry/ui/button";
import { Label } from "@dotui/registry/ui/field";
import { Form } from "@dotui/registry/ui/form";
import { Input } from "@dotui/registry/ui/input";
import { TextField } from "@dotui/registry/ui/text-field";

export default function Page() {
  return (
    <Form className="space-y-4">
      <TextField name="name" isRequired>
        <Label>Name</Label>
        <Input placeholder="Name" />
      </TextField>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}
