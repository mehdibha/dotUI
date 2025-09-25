"use client";

import { parseDate } from "@internationalized/date";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import { Button } from "@dotui/ui/components/button";
import { Checkbox } from "@dotui/ui/components/checkbox";
import { Combobox } from "@dotui/ui/components/combobox";
import { DatePicker } from "@dotui/ui/components/date-picker";
import { FormControl } from "@dotui/ui/components/form";
import { Radio, RadioGroup } from "@dotui/ui/components/radio-group";
import { Select, SelectItem } from "@dotui/ui/components/select";
import { TextField } from "@dotui/ui/components/text-field";

const FormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  gender: z.enum(["male", "female", "other"]),
  "birth-date": z.string().min(1, "Please select a birth date"),
  referral: z.string().min(1, "Please select a method"),
  language: z.string().min(1, "Please select a language"),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type FormData = z.infer<typeof FormSchema>;

export default function Demo() {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      gender: "" as "male" | "female" | "other",
      "birth-date": "",
      referral: "",
      language: "",
      terms: false,
    },
    onSubmit: async ({ value }) => {
      alert(JSON.stringify(value, null, 2));
    },
  });

  return (
    <div className="w-sm bg-muted space-y-4 rounded-lg border p-8">
      <h1 className="text-xl font-bold">Register</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <FormControl
          form={form}
          name="name"
          validators={{
            onChange: ({ value }) => {
              const result = FormSchema.shape.name.safeParse(value);
              return result.success ? undefined : result.error.issues[0]?.message;
            },
          }}
          render={(props) => (
            <TextField label="Name" className="w-full" {...props} />
          )}
        />
        <FormControl
          form={form}
          name="email"
          validators={{
            onChange: ({ value }) => {
              const result = FormSchema.shape.email.safeParse(value);
              return result.success ? undefined : result.error.issues[0]?.message;
            },
          }}
          render={(props) => (
            <TextField label="Email" className="w-full" {...props} />
          )}
        />
        <FormControl
          form={form}
          name="gender"
          validators={{
            onChange: ({ value }) => {
              const result = FormSchema.shape.gender.safeParse(value);
              return result.success ? undefined : result.error.issues[0]?.message;
            },
          }}
          render={({ value, onChange, ...props }) => (
            <RadioGroup 
              label="Gender" 
              orientation="horizontal" 
              value={value}
              onChange={(val) => onChange(val as "male" | "female" | "other")}
              {...props}
            >
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
              <Radio value="other">Other</Radio>
            </RadioGroup>
          )}
        />
        <FormControl
          form={form}
          name="birth-date"
          validators={{
            onChange: ({ value }) => {
              const result = FormSchema.shape["birth-date"].safeParse(value);
              return result.success ? undefined : result.error.issues[0]?.message;
            },
          }}
          render={({ value, onChange, ...props }) => (
            <DatePicker
              label="Birth Date"
              value={value ? parseDate(value) : undefined}
              onChange={(val) => onChange(val?.toString() || "")}
              className="w-full"
              {...props}
            />
          )}
        />
        <FormControl
          form={form}
          name="language"
          validators={{
            onChange: ({ value }) => {
              const result = FormSchema.shape.language.safeParse(value);
              return result.success ? undefined : result.error.issues[0]?.message;
            },
          }}
          render={({ value, onChange, ...props }) => (
            <Combobox
              label="Preferred language"
              items={languages}
              inputValue={value}
              onSelectionChange={(key) => onChange(key as string)}
              className="w-full"
              {...props}
            >
              {(item) => (
                <SelectItem key={item.value} id={item.value}>
                  {item.label}
                </SelectItem>
              )}
            </Combobox>
          )}
        />
        <FormControl
          form={form}
          name="referral"
          validators={{
            onChange: ({ value }) => {
              const result = FormSchema.shape.referral.safeParse(value);
              return result.success ? undefined : result.error.issues[0]?.message;
            },
          }}
          render={({ value, onChange, ...props }) => (
            <Select
              label="How did you hear about us?"
              selectedKey={value}
              onSelectionChange={(key) => onChange(key as string)}
              variant="default"
              className="w-full"
              {...props}
            >
              <SelectItem id="linkedin">LinkedIn</SelectItem>
              <SelectItem id="x">X</SelectItem>
            </Select>
          )}
        />
        <FormControl
          form={form}
          name="terms"
          validators={{
            onChange: ({ value }) => {
              const result = FormSchema.shape.terms.safeParse(value);
              return result.success ? undefined : result.error.issues[0]?.message;
            },
          }}
          render={({ value, onChange, ...props }) => (
            <Checkbox
              isSelected={value}
              onChange={onChange}
              {...props}
            >
              I agree to the terms and conditions
            </Checkbox>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">Register</Button>
        </div>
      </form>
    </div>
  );
}

const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const;