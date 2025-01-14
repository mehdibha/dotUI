"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { parseDate } from "@internationalized/date";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/dynamic-core/button";
import { Checkbox } from "@/components/dynamic-core/checkbox";
import { Combobox } from "@/components/dynamic-core/combobox";
import { DatePicker } from "@/components/dynamic-core/date-picker";
import { Item } from "@/components/dynamic-core/list-box";
import { RadioGroup, Radio } from "@/components/dynamic-core/radio-group";
import { Select } from "@/components/dynamic-core/select";
import { TextField } from "@/components/dynamic-core/text-field";
import { Form, FormControl } from "@/registry/core/form_react-hook-form";

const FormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  gender: z.enum(["male", "female", "other"]),
  "birth-date": z.string(),
  referral: z.string({
    required_error: "Please select a method.",
  }),
  language: z.string({
    required_error: "Please select a language.",
  }),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export default function Demo() {
  const { handleSubmit, control } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  return (
    <div className="w-sm bg-bg-muted space-y-4 rounded-lg border p-8">
      <h1 className="text-xl font-bold">Register</h1>
      <Form
        onSubmit={handleSubmit((data) => {
          alert(JSON.stringify(data, null, 2));
        })}
        className="space-y-4"
      >
        <FormControl
          name="name"
          control={control}
          render={(props) => (
            <TextField label="Name" className="w-full" {...props} />
          )}
        />
        <FormControl
          name="email"
          control={control}
          render={(props) => (
            <TextField label="Email" className="w-full" {...props} />
          )}
        />
        <FormControl
          name="gender"
          control={control}
          render={(props) => (
            <RadioGroup label="Gender" orientation="horizontal" {...props}>
              <Radio value="male">Male</Radio>
              <Radio value="female">female</Radio>
              <Radio value="other">Other</Radio>
            </RadioGroup>
          )}
        />
        <FormControl
          name="birth-date"
          control={control}
          render={({ value, onChange, ...props }) => (
            <DatePicker
              label="Birth Date"
              value={value ? parseDate(value) : undefined}
              onChange={(val) => onChange(val?.toString())}
              className="w-full"
              {...props}
            />
          )}
        />
        <FormControl
          name="language"
          control={control}
          render={({ value, onChange, ...props }) => (
            <Combobox
              label="Preferred language"
              items={languages}
              inputValue={value}
              onSelectionChange={onChange}
              className="w-full"
              {...props}
            >
              {(item) => (
                <Item key={item.value} id={item.value}>
                  {item.label}
                </Item>
              )}
            </Combobox>
          )}
        />
        <FormControl
          name="referral"
          control={control}
          render={({ value, ...props }) => (
            <Select
              label="How did you hear about us?"
              selectedKey={value}
              variant="outline"
              className="w-full"
              {...props}
            >
              <Item id="linkedin">LinkedIn</Item>
              <Item id="x">X</Item>
            </Select>
          )}
        />
        <FormControl
          name="terms"
          control={control}
          render={({ value, ...props }) => (
            <Checkbox isSelected={value} {...props}>
              I agree to the terms and conditions
            </Checkbox>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">Register</Button>
        </div>
      </Form>
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
