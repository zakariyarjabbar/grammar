"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function DeleteSubmitButton({ label = "Delete" }: { label?: string }) {
  return (
    <Button
      onClick={(event) => {
        if (!window.confirm("Delete this item? This cannot be undone.")) {
          event.preventDefault();
        }
      }}
      type="submit"
      variant="danger"
    >
      <Trash2 className="h-4 w-4" />
      {label}
    </Button>
  );
}
