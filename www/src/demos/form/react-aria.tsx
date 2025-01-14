"use client";

import React from "react";
import { Button } from "@/components/dynamic-core/button";
import { Checkbox } from "@/components/dynamic-core/checkbox";
import { Combobox } from "@/components/dynamic-core/combobox";
import { DatePicker } from "@/components/dynamic-core/date-picker";
import { Item } from "@/components/dynamic-core/list-box";
import { RadioGroup, Radio } from "@/components/dynamic-core/radio-group";
import { Select } from "@/components/dynamic-core/select";
import { TextField } from "@/components/dynamic-core/text-field";
import { Form } from "@/registry/core/form";

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
            <Item key={item.value} id={item.value}>
              {item.label}
            </Item>
          )}
        </Combobox>
        <Select
          name="referral"
          label="How did you hear about us?"
          isRequired
          variant="outline"
          className="w-full"
        >
          <Item id="linkedin">LinkedIn</Item>
          <Item id="x">X</Item>
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
