"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/Field";

type PasswordInputProps = {
  id: string;
  name: string;
  placeholder?: string;
  autoComplete?: string;
  minLength?: number;
  required?: boolean;
};

export function PasswordInput(props: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input {...props} type={visible ? "text" : "password"} />
      <button
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-muted hover:bg-secondary hover:text-ink"
        onClick={() => setVisible((value) => !value)}
        type="button"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
