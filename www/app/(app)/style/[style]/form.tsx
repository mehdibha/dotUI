"use client";

import type { StyleFormData } from "@/modules/styles/lib/form-context";

import { Form } from "@dotui/ui/components/form";

import { useStyleForm } from "@/modules/styles/lib/form-context";

export default function StyleForm({ children }: { children: React.ReactNode }) {
  const { form } = useStyleForm();

  const onSubmit = (data: StyleFormData) => {
    console.log(data);
  };

  return (
    <Form control={form.control} onSubmit={form.handleSubmit(onSubmit)}>
      {children}
    </Form>
  );
}
