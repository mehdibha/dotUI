"use client";

import React from "react";
import { Button } from "@/components/dynamic-ui/button";
import { Checkbox } from "@/components/dynamic-ui/checkbox";
import { Combobox } from "@/components/dynamic-ui/combobox";
import { DatePicker } from "@/components/dynamic-ui/date-picker";
import { RadioGroup, Radio } from "@/components/dynamic-ui/radio-group";
import { Select, SelectItem } from "@/components/dynamic-ui/select";
import { TextField } from "@/components/dynamic-ui/text-field";
import { Form } from "@/modules/registry/ui/form.basic";

export default function Demo() {
  return (
    <div className="w-sm bg-bg-muted space-y-4 rounded-lg border p-8">
      <h1 className="text-xl font-bold">Register</h1>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          const data = Object.fromEntries(new FormData(e.currentTarget));
          alert(JSON.stringify(data, null, 2));
        }}
        className="space-y-4"
      >
        <TextField
          name="name"
          label="Name"
          minLength={2}
          isRequired
          className="w-full"
        />
        <TextField
          name="email"
          label="Email"
          type="email"
          isRequired
          className="w-full"
        />
        <RadioGroup
          name="gender"
          label="Gender"
          isRequired
          orientation="horizontal"
        >
          <Radio value="male">Male</Radio>
          <Radio value="female">female</Radio>
          <Radio value="other">Other</Radio>
        </RadioGroup>
        <DatePicker
          label="Birth Date"
          name="birth-date"
          isRequired
          className="w-full"
        />
        <Combobox
          name="language"
          label="Preferred language"
          items={languages}
          isRequired
          className="w-full"
        >
          {(item) => (
            <SelectItem key={item.value} id={item.value}>
              {item.label}
            </SelectItem>
          )}
        </Combobox>
        <Select
          name="referral"
          label="How did you hear about us?"
          isRequired
          variant="outline"
          className="w-full"
        >
          <SelectItem id="linkedin">LinkedIn</SelectItem>
          <SelectItem id="x">X</SelectItem>
        </Select>
        <Checkbox isRequired>I agree to the terms and conditions</Checkbox>
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
