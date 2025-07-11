"use client";

import { useStyleForm } from "@/modules/styles/lib/form-context";

export default function StyleForm({ children }: { children: React.ReactNode }) {
  const { form } = useStyleForm();

  return (
    <form
      onSubmit={form.handleSubmit(
        (data) => {
          console.log(data);
        },
        (errors) => {
          console.log(errors);
        },
      )}
    >
      {children}
    </form>
  );
}
